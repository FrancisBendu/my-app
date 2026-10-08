/**
 * App state for the demo: everything the user creates or changes
 * (their listings, chats, saved items, requests, profile, location).
 * It is saved on this phone with AsyncStorage. When the backend is ready,
 * these functions become API calls and the shapes stay the same.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LOCATION,
  listings as seedListings,
  members as seedMembers,
  seedConversations,
  type Category,
  type Conversation,
  type Listing,
  type Member,
} from '@/data/mock';

export type NeedRequest = {
  id: string;
  text: string;
  category: Category;
  location: string;
  budget?: number;
  when: 'Right now' | 'Today' | 'This week';
  createdAt: string;
};

export type CartItem = { listingId: string; qty: number };

export type PaymentMethod = 'orange' | 'afrimoney' | 'card' | 'cash';

export type OrderStatus = 'Paid · protected' | 'Pay on delivery' | 'Received' | 'Problem reported';

export type Order = {
  id: string;
  items: { listingId: string; title: string; price: number; qty: number; sellerId: string }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  method: PaymentMethod;
  /** Card orders keep only the brand and last 4 digits — never the full number. */
  cardLabel?: string;
  payerPhone?: string;
  fulfilment: 'delivery' | 'pickup';
  address: string;
  phone: string;
  status: OrderStatus;
  createdAt: string;
};

export type Profile = {
  name: string;
  phone: string;
  location: string;
};

type State = {
  location: string;
  savedIds: string[];
  myListings: Listing[];
  myServices: Member[];
  conversations: Conversation[];
  requests: NeedRequest[];
  profile: Profile;
  cart: CartItem[];
  orders: Order[];
  viewedIds: string[];
};

const STORAGE_KEY = 'rayno-state-v1';
export const ME = 'me';

const initialState: State = {
  location: DEFAULT_LOCATION,
  savedIds: ['l2', 'l3', 'l5', 'l6'],
  myListings: [],
  myServices: [],
  conversations: seedConversations,
  requests: [],
  profile: { name: '', phone: '', location: DEFAULT_LOCATION },
  cart: [],
  orders: [],
  viewedIds: [],
};

const newId = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function useAppState() {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...initialState, ...(JSON.parse(raw) as Partial<State>) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 300);
  }, [state, ready]);

  const me: Member = useMemo(
    () => ({
      id: ME,
      name: state.profile.name.trim() || 'You',
      kind: 'person',
      verified: false,
      rating: 0,
      reviews: 0,
      location: state.profile.location,
      since: new Date().getFullYear(),
      about: 'Your RAYNO profile.',
    }),
    [state.profile],
  );

  const allListings = useMemo(() => [...state.myListings, ...seedListings], [state.myListings]);
  const allMembers = useMemo(() => [...seedMembers, ...state.myServices, me], [state.myServices, me]);

  const getListing = useCallback((id: string) => allListings.find((l) => l.id === id), [allListings]);
  const getMember = useCallback((id: string) => allMembers.find((m) => m.id === id), [allMembers]);

  const setLocation = useCallback((location: string) => setState((s) => ({ ...s, location })), []);

  const toggleSaved = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        savedIds: s.savedIds.includes(id) ? s.savedIds.filter((x) => x !== id) : [id, ...s.savedIds],
      })),
    [],
  );

  const addListing = useCallback((listing: Omit<Listing, 'id' | 'postedAt' | 'sellerId'>) => {
    const created: Listing = { ...listing, id: newId('my'), sellerId: ME, postedAt: new Date().toISOString() };
    setState((s) => ({ ...s, myListings: [created, ...s.myListings] }));
    return created.id;
  }, []);

  const removeListing = useCallback(
    (id: string) => setState((s) => ({ ...s, myListings: s.myListings.filter((l) => l.id !== id) })),
    [],
  );

  const addService = useCallback(
    (service: Pick<Member, 'name' | 'trade' | 'priceFrom' | 'location' | 'about'>) => {
      const created: Member = {
        ...service,
        id: newId('svc'),
        kind: 'provider',
        verified: false,
        rating: 0,
        reviews: 0,
        since: new Date().getFullYear(),
        availability: 'Available Today',
      };
      setState((s) => ({ ...s, myServices: [created, ...s.myServices] }));
      return created.id;
    },
    [],
  );

  const addRequest = useCallback((request: Omit<NeedRequest, 'id' | 'createdAt'>) => {
    const created: NeedRequest = { ...request, id: newId('req'), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, requests: [created, ...s.requests] }));
    return created.id;
  }, []);

  const removeRequest = useCallback(
    (id: string) => setState((s) => ({ ...s, requests: s.requests.filter((r) => r.id !== id) })),
    [],
  );

  /** Returns the id of the chat with this member (about this listing), creating it if needed. */
  const openConversation = useCallback(
    (memberId: string, listingId?: string) => {
      const existing = state.conversations.find(
        (c) => c.memberId === memberId && (c.listingId ?? null) === (listingId ?? null),
      );
      if (existing) return existing.id;
      const created: Conversation = { id: newId('c'), memberId, listingId, messages: [], unread: 0 };
      setState((s) => ({ ...s, conversations: [created, ...s.conversations] }));
      return created.id;
    },
    [state.conversations],
  );

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const message = { id: newId('m'), from: 'me' as const, text, at: new Date().toISOString() };
    setState((s) => ({
      ...s,
      conversations: s.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c,
      ),
    }));
  }, []);

  const markRead = useCallback(
    (conversationId: string) =>
      setState((s) =>
        s.conversations.some((c) => c.id === conversationId && c.unread > 0)
          ? {
              ...s,
              conversations: s.conversations.map((c) =>
                c.id === conversationId ? { ...c, unread: 0 } : c,
              ),
            }
          : s,
      ),
    [],
  );

  const updateProfile = useCallback(
    (profile: Profile) => setState((s) => ({ ...s, profile })),
    [],
  );

  const resetDemo = useCallback(() => setState(initialState), []);

  /** Remembers what the user opened, newest first, for "Recently viewed". */
  const addViewed = useCallback(
    (id: string) =>
      setState((s) =>
        s.viewedIds[0] === id ? s : { ...s, viewedIds: [id, ...s.viewedIds.filter((x) => x !== id)].slice(0, 12) },
      ),
    [],
  );

  const addToCart = useCallback(
    (listingId: string, qty = 1) =>
      setState((s) => {
        const existing = s.cart.find((c) => c.listingId === listingId);
        const cart = existing
          ? s.cart.map((c) => (c.listingId === listingId ? { ...c, qty: c.qty + qty } : c))
          : [...s.cart, { listingId, qty }];
        return { ...s, cart };
      }),
    [],
  );

  const setCartQty = useCallback(
    (listingId: string, qty: number) =>
      setState((s) => ({
        ...s,
        cart:
          qty <= 0
            ? s.cart.filter((c) => c.listingId !== listingId)
            : s.cart.map((c) => (c.listingId === listingId ? { ...c, qty } : c)),
      })),
    [],
  );

  const placeOrder = useCallback(
    (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
      const created: Order = {
        ...order,
        id: newId('RN-'),
        createdAt: new Date().toISOString(),
        status: order.method === 'cash' ? 'Pay on delivery' : 'Paid · protected',
      };
      setState((s) => ({
        ...s,
        orders: [created, ...s.orders],
        cart: s.cart.filter((c) => !order.items.some((i) => i.listingId === c.listingId)),
      }));
      return created.id;
    },
    [],
  );

  const setOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) =>
      setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)) })),
    [],
  );

  return {
    ready,
    ...state,
    me,
    allListings,
    allMembers,
    getListing,
    getMember,
    setLocation,
    toggleSaved,
    addListing,
    removeListing,
    addService,
    addRequest,
    removeRequest,
    openConversation,
    sendMessage,
    markRead,
    updateProfile,
    resetDemo,
    addViewed,
    addToCart,
    setCartQty,
    placeOrder,
    setOrderStatus,
  };
}

type Store = ReturnType<typeof useAppState>;

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useAppState();
  if (!store.ready) return null;
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
