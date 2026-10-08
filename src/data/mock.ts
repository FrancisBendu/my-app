/**
 * All demo (seed) data for RAYNO lives here.
 * When the backend is ready, replace these exports with API calls
 * that return the same shapes. Things the user creates in the app
 * (listings, chats, requests) live in src/lib/store.tsx instead.
 */
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';
import { productImages } from './productImages';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type Category =
  | 'phones'
  | 'electronics'
  | 'fashion'
  | 'accessories'
  | 'beauty'
  | 'home'
  | 'vehicles'
  | 'property'
  | 'food'
  | 'services';

export const categories: { key: Category; label: string; icon: IconName }[] = [
  { key: 'electronics', label: 'Electronics', icon: 'tv-outline' },
  { key: 'phones', label: 'Phones', icon: 'phone-portrait-outline' },
  { key: 'fashion', label: 'Fashion', icon: 'shirt-outline' },
  { key: 'accessories', label: 'Watches & Bags', icon: 'watch-outline' },
  { key: 'beauty', label: 'Beauty', icon: 'sparkles-outline' },
  { key: 'home', label: 'Home', icon: 'home-outline' },
  { key: 'vehicles', label: 'Vehicles', icon: 'car-outline' },
  { key: 'property', label: 'Property', icon: 'business-outline' },
  { key: 'food', label: 'Food', icon: 'basket-outline' },
  { key: 'services', label: 'Services', icon: 'construct-outline' },
];

export const categoryStyle: Record<Category, { icon: IconName; tint: string }> = {
  electronics: { icon: 'tv-outline', tint: '#E6F0FF' },
  phones: { icon: 'phone-portrait-outline', tint: '#E6F0FF' },
  fashion: { icon: 'shirt-outline', tint: '#FCE8F1' },
  accessories: { icon: 'watch-outline', tint: '#F3ECFF' },
  beauty: { icon: 'sparkles-outline', tint: '#FFEFF3' },
  home: { icon: 'bed-outline', tint: '#FFF1E0' },
  vehicles: { icon: 'car-sport-outline', tint: '#FDE7E7' },
  property: { icon: 'home-outline', tint: '#E3F8EC' },
  food: { icon: 'basket-outline', tint: '#FFF6D6' },
  services: { icon: 'construct-outline', tint: '#FFF6D6' },
};

export type Listing = {
  id: string;
  title: string;
  price: number;
  /** Appended after the price, e.g. "+" for "NLe 300+". */
  priceSuffix?: string;
  /** Price before a discount; listings with this set appear in Deals. */
  oldPrice?: number;
  /** A place label from src/data/locations.ts, e.g. "Lumley, Freetown". */
  location: string;
  category: Category;
  condition?: 'New' | 'Used';
  description: string;
  /** Who is selling: a Member id. */
  sellerId: string;
  /** Bundled `require(...)` or a URI. Keep photos small (~500px). Cards fall back to an icon. */
  image?: number | string;
  images?: (number | string)[];
  /** ISO date. */
  postedAt: string;
  trending?: boolean;
  /** Key attributes shown as a table on the item page, e.g. { Storage: '256GB' }. */
  specs?: Record<string, string>;
  /** How many have been sold on RAYNO. */
  sold?: number;
};

/** A seller, store or service provider. */
export type Member = {
  id: string;
  name: string;
  kind: 'store' | 'person' | 'provider';
  verified: boolean;
  rating: number;
  reviews: number;
  location: string;
  /** Year they joined RAYNO. */
  since: number;
  about: string;
  /** Service providers only. */
  trade?: string;
  availability?: 'Available Now' | 'Available Today' | 'Busy';
  priceFrom?: number;
  /** Stores only. */
  storeCategory?: string;
};

export type Message = {
  id: string;
  from: 'me' | 'them';
  text: string;
  at: string;
};

export type Conversation = {
  id: string;
  memberId: string;
  listingId?: string;
  messages: Message[];
  unread: number;
};

export type ActionCard = {
  key: 'need-it-now' | 'market' | 'services' | 'stores' | 'deals';
  title: string;
  subtitle: string;
  /** 'percent-disc' draws the white % badge used on the Deals card. */
  icon: IconName | 'percent-disc';
  color: string;
  href: '/need-it-now' | '/market' | '/services' | '/stores' | '/deals';
};

export const DEFAULT_LOCATION = 'Freetown';

export const actionCards: ActionCard[] = [
  {
    key: 'need-it-now',
    title: 'I Need It Now',
    subtitle: 'Get quick offers',
    icon: 'flash',
    color: '#0066FF',
    href: '/need-it-now',
  },
  {
    key: 'market',
    title: 'Market',
    subtitle: 'Buy & Sell',
    icon: 'bag-handle-outline',
    color: '#00C853',
    href: '/market',
  },
  {
    key: 'services',
    title: 'Services',
    subtitle: 'Find Professionals',
    icon: 'construct',
    color: '#FF8A00',
    href: '/services',
  },
  {
    key: 'stores',
    title: 'Stores',
    subtitle: 'Verified Businesses',
    icon: 'storefront',
    color: '#7B3FE4',
    href: '/stores',
  },
  {
    key: 'deals',
    title: 'Deals',
    subtitle: "Today's Offers",
    icon: 'percent-disc',
    color: '#F0393C',
    href: '/deals',
  },
];

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const members: Member[] = [
  {
    id: 's1',
    name: 'Abu Electronics',
    kind: 'store',
    verified: true,
    rating: 4.9,
    reviews: 342,
    location: 'Lumley, Freetown',
    since: 2024,
    storeCategory: 'Phones & Electronics',
    about: 'Phones, TVs, laptops and accessories. Original products with warranty. Delivery within Freetown.',
  },
  {
    id: 's2',
    name: 'Freetown Home Furnishings',
    kind: 'store',
    verified: true,
    rating: 4.7,
    reviews: 128,
    location: 'Kissy, Freetown',
    since: 2024,
    storeCategory: 'Furniture & Appliances',
    about: 'Sofas, beds, fridges and home appliances. We deliver across the Western Area.',
  },
  {
    id: 's3',
    name: "Fatmata's Fashion",
    kind: 'store',
    verified: false,
    rating: 4.6,
    reviews: 57,
    location: 'Bo',
    since: 2025,
    storeCategory: 'Fashion',
    about: 'African prints, dresses and shoes for women and men. Custom tailoring available.',
  },
  {
    id: 's4',
    name: 'Kamara Motors',
    kind: 'store',
    verified: true,
    rating: 4.5,
    reviews: 89,
    location: 'Wellington, Freetown',
    since: 2024,
    storeCategory: 'Vehicles',
    about: 'Cars and motorbikes, new and foreign used. Papers checked before sale.',
  },
  {
    id: 's5',
    name: 'Makeni Mobile Hub',
    kind: 'store',
    verified: true,
    rating: 4.8,
    reviews: 73,
    location: 'Makeni',
    since: 2025,
    storeCategory: 'Phones',
    about: 'Smartphones, chargers, solar power banks and repairs in Makeni.',
  },
  {
    id: 'u1',
    name: 'Hawa Turay',
    kind: 'person',
    verified: true,
    rating: 4.8,
    reviews: 21,
    location: 'Wilberforce, Freetown',
    since: 2025,
    about: 'I rent out rooms and apartments in the west end of Freetown.',
  },
  {
    id: 'u2',
    name: 'Mohamed Bangura',
    kind: 'person',
    verified: false,
    rating: 4.4,
    reviews: 12,
    location: 'Kenema',
    since: 2025,
    about: 'Selling solar kits, generators and farm produce in Kenema.',
  },
  {
    id: 'p1',
    name: 'Alhaji Kamara',
    kind: 'provider',
    verified: true,
    rating: 4.9,
    reviews: 124,
    location: 'Freetown',
    since: 2024,
    trade: 'Electrician',
    availability: 'Available Now',
    priceFrom: 300,
    about: 'House wiring, sockets, meters and fault finding. 10 years experience.',
  },
  {
    id: 'p2',
    name: 'Susu Conteh',
    kind: 'provider',
    verified: true,
    rating: 4.8,
    reviews: 96,
    location: 'Freetown',
    since: 2024,
    trade: 'Plumber',
    availability: 'Available Today',
    priceFrom: 250,
    about: 'Leaks, taps, toilets, water tanks and pipe installation.',
  },
  {
    id: 'p3',
    name: 'Ibrahim Sesay',
    kind: 'provider',
    verified: true,
    rating: 4.7,
    reviews: 88,
    location: 'Waterloo',
    since: 2024,
    trade: 'AC Technician',
    availability: 'Available Now',
    priceFrom: 400,
    about: 'AC installation, gas refill and servicing. Fridges and freezers too.',
  },
  {
    id: 'p4',
    name: 'Mariama Kargbo',
    kind: 'provider',
    verified: false,
    rating: 4.6,
    reviews: 72,
    location: 'Freetown',
    since: 2025,
    trade: 'Cleaner',
    availability: 'Available Today',
    priceFrom: 150,
    about: 'Home and office cleaning, laundry and move-in/move-out cleaning.',
  },
  {
    id: 'p5',
    name: 'Sahr Mansaray',
    kind: 'provider',
    verified: true,
    rating: 4.7,
    reviews: 41,
    location: 'Koidu',
    since: 2025,
    trade: 'Mechanic',
    availability: 'Available Today',
    priceFrom: 300,
    about: 'Car and motorbike repairs, servicing and diagnostics in Kono.',
  },
  {
    id: 'p6',
    name: 'Isatu Koroma',
    kind: 'provider',
    verified: true,
    rating: 4.9,
    reviews: 63,
    location: 'Bo',
    since: 2025,
    trade: 'Tailor',
    availability: 'Available Now',
    priceFrom: 200,
    about: 'Dresses, suits, school uniforms and alterations.',
  },
  {
    id: 's6',
    name: 'Big Market Boutique',
    kind: 'store',
    verified: true,
    rating: 4.8,
    reviews: 211,
    location: 'Freetown',
    since: 2024,
    storeCategory: 'Men’s Fashion & Shoes',
    about: 'Shirts, jackets, boots, loafers and sneakers. Shop at Big Market, Wallace Johnson Street.',
  },
  {
    id: 's7',
    name: 'Scent & Time Aberdeen',
    kind: 'store',
    verified: true,
    rating: 4.9,
    reviews: 158,
    location: 'Aberdeen, Freetown',
    since: 2024,
    storeCategory: 'Watches, Perfume & Bags',
    about: 'Original watches, perfumes and leather bags. Gift wrapping available.',
  },
];

export const trades = ['Electrician', 'Plumber', 'AC Technician', 'Mechanic', 'Cleaner', 'Tailor'];

const photos = (images: number[]) => ({ image: images[0], images });
const P = productImages;

export const listings: Listing[] = [
  {
    id: 'l1',
    title: 'iPhone 16 Pro Max',
    price: 26500,
    location: 'Lumley, Freetown',
    category: 'phones',
    condition: 'New',
    description:
      'Brand new, sealed in box. Available in Natural, Blue, White and Desert titanium. 1 year shop warranty. Delivery anywhere in Freetown.',
    specs: { Storage: '256GB', Colours: 'Natural, Blue, White, Desert', Warranty: '1 year', 'SIM': 'Nano + eSIM' },
    sellerId: 's1',
    ...photos(P.iphone16),
    postedAt: hoursAgo(3),
    sold: 38,
    trending: true,
  },
  {
    id: 'l2',
    title: 'L-Shaped Fabric Sofa',
    price: 12500,
    location: 'Kissy, Freetown',
    category: 'home',
    condition: 'New',
    description: 'Modern L-shaped sofa with chaise. Strong wood frame, washable covers. Free delivery in the Western Area.',
    specs: { Seats: '5–6', Colour: 'Light grey / beige', Material: 'Fabric, hardwood frame', Delivery: 'Free in Western Area' },
    sellerId: 's2',
    ...photos(P.lsofa),
    postedAt: hoursAgo(9),
    sold: 12,
  },
  {
    id: 'l3',
    title: 'Electrician Services',
    price: 300,
    priceSuffix: '+',
    location: 'Freetown',
    category: 'services',
    description: 'House wiring, sockets, meters and fault finding. Same-day call-outs in Freetown.',
    sellerId: 'p1',
    image: require('../../assets/listings/electrician.jpg'),
    postedAt: daysAgo(1),
    sold: 124,
  },
  {
    id: 'l4',
    title: 'Smart TV 55" 4K',
    price: 9800,
    oldPrice: 11500,
    location: 'Lumley, Freetown',
    category: 'electronics',
    condition: 'New',
    description: '55" 4K smart TV with YouTube, Netflix and Prime Video. Wall bracket included.',
    specs: { Screen: '55" 4K UHD', Apps: 'YouTube, Netflix, Prime', Warranty: '1 year', Includes: 'Wall bracket' },
    sellerId: 's1',
    ...photos(P.smarttv),
    postedAt: daysAgo(2),
    sold: 21,
  },
  {
    id: 'l5',
    title: 'Toyota Corolla 2012',
    price: 85000,
    location: 'Wellington, Freetown',
    category: 'vehicles',
    condition: 'Used',
    description: 'Automatic, AC working, clean papers. Inspection welcome.',
    specs: { Year: '2012', Gearbox: 'Automatic', Fuel: 'Petrol', Papers: 'Complete' },
    sellerId: 's4',
    image: require('../../assets/listings/car.jpg'),
    postedAt: daysAgo(1),
    trending: true,
  },
  {
    id: 'l6',
    title: 'Pleated Knit Dress',
    price: 350,
    location: 'Bo',
    category: 'fashion',
    condition: 'New',
    description: 'Soft pleated knit dress with buttons. Colours: white, blue, red, pink, yellow. Sizes S–XL.',
    specs: { Sizes: 'S, M, L, XL', Colours: 'White, Blue, Red, Pink, Yellow', Material: 'Stretch knit' },
    sellerId: 's3',
    ...photos(P.pleateddress),
    postedAt: hoursAgo(20),
    sold: 96,
    trending: true,
  },
  {
    id: 'l7',
    title: 'Rooms for Rent',
    price: 1200,
    priceSuffix: '/mo',
    location: 'Wilberforce, Freetown',
    category: 'property',
    description: 'Self-contained rooms with water and EDSA meter. 6 months advance.',
    specs: { Type: 'Self-contained room', Water: 'Yes', Power: 'EDSA meter', Advance: '6 months' },
    sellerId: 'u1',
    image: require('../../assets/listings/house.jpg'),
    postedAt: daysAgo(3),
    trending: true,
  },
  {
    id: 'l8',
    title: 'ASUS ROG Gaming Laptop',
    price: 16000,
    oldPrice: 17500,
    location: 'Lumley, Freetown',
    category: 'electronics',
    condition: 'Used',
    description: 'Core i7, RTX graphics, 16GB RAM, 512GB SSD. Clean, tested, with charger.',
    specs: { Processor: 'Intel Core i7', Graphics: 'NVIDIA RTX', RAM: '16GB', Storage: '512GB SSD', Grade: 'A (Good)' },
    sellerId: 's1',
    ...photos(P.roglaptop),
    postedAt: daysAgo(2),
    sold: 4,
    trending: true,
  },
  {
    id: 'l9',
    title: 'Samsung Galaxy A15',
    price: 3200,
    oldPrice: 3600,
    location: 'Makeni',
    category: 'phones',
    condition: 'New',
    description: '128GB, dual SIM, long battery life. Comes with charger and case.',
    specs: { Storage: '128GB', SIM: 'Dual SIM', Battery: '5000 mAh' },
    sellerId: 's5',
    postedAt: hoursAgo(6),
    sold: 17,
  },
  {
    id: 'l10',
    title: 'Solar Panel Kit 300W',
    price: 6500,
    oldPrice: 7400,
    location: 'Kenema',
    category: 'electronics',
    condition: 'New',
    description: '300W panel, battery, inverter and 4 bulbs. Installation available in Kenema.',
    sellerId: 'u2',
    postedAt: daysAgo(1),
    trending: true,
  },
  {
    id: 'l11',
    title: 'Generator 5kVA',
    price: 9000,
    location: 'Kenema',
    category: 'electronics',
    condition: 'Used',
    description: 'Petrol generator, runs well, recently serviced.',
    sellerId: 'u2',
    postedAt: daysAgo(4),
  },
  {
    id: 'l12',
    title: '4-Door Refrigerator',
    price: 14500,
    oldPrice: 15800,
    location: 'Kissy, Freetown',
    category: 'home',
    condition: 'New',
    description: 'Large 4-door fridge freezer, low power use. Free delivery in Freetown.',
    specs: { Size: '190.5 × 90.8 × 74.8 cm', Doors: '4', Warranty: '2 years', Delivery: 'Free in Freetown' },
    sellerId: 's2',
    ...photos(P.fridge),
    postedAt: daysAgo(2),
    sold: 6,
  },
  {
    id: 'l13',
    title: 'Bajaj Boxer Motorbike',
    price: 22000,
    location: 'Wellington, Freetown',
    category: 'vehicles',
    condition: 'New',
    description: 'Brand new Bajaj Boxer 150. Papers ready.',
    sellerId: 's4',
    postedAt: daysAgo(5),
  },
  {
    id: 'l14',
    title: 'Local Rice 50kg',
    price: 950,
    location: 'Kenema',
    category: 'food',
    description: 'Clean local rice from Kenema farms. Bulk orders welcome.',
    sellerId: 'u2',
    postedAt: hoursAgo(12),
    sold: 230,
  },
  {
    id: 'l15',
    title: 'iPhone 13 Pro Max',
    price: 10500,
    location: 'Makeni',
    category: 'phones',
    condition: 'Used',
    description: '256GB, battery health 88%, no scratches on screen. Face ID working.',
    specs: { Storage: '256GB', Battery: '88%', Grade: 'A (Good)' },
    sellerId: 's5',
    ...photos(P.iphone13),
    postedAt: hoursAgo(30),
    sold: 9,
  },
  {
    id: 'l16',
    title: 'Dell Latitude Laptop',
    price: 5200,
    oldPrice: 5800,
    location: 'Lumley, Freetown',
    category: 'electronics',
    condition: 'Used',
    description: 'Core i5, 8GB RAM, 256GB SSD. Good for office and school.',
    specs: { Processor: 'Intel Core i5', RAM: '8GB', Storage: '256GB SSD', Grade: 'A (Good)' },
    sellerId: 's1',
    ...photos(P.delllaptop),
    postedAt: daysAgo(3),
    sold: 15,
  },
  {
    id: 'l17',
    title: 'iPad Pro + Magic Keyboard',
    price: 24000,
    location: 'Lumley, Freetown',
    category: 'electronics',
    condition: 'New',
    description: '11" iPad Pro with Magic Keyboard. Perfect for work, school and design.',
    specs: { Screen: '11"', Storage: '256GB', Includes: 'Magic Keyboard', Warranty: '1 year' },
    sellerId: 's1',
    ...photos(P.ipadpro),
    postedAt: daysAgo(1),
    sold: 3,
  },
  {
    id: 'l18',
    title: 'Wireless Mouse (Silent)',
    price: 180,
    oldPrice: 220,
    location: 'Makeni',
    category: 'electronics',
    condition: 'New',
    description: 'Slim rechargeable 2.4GHz wireless mouse. Silent clicks.',
    specs: { Connection: '2.4GHz USB', Battery: 'Rechargeable', Colours: 'Silver, Black' },
    sellerId: 's5',
    ...photos(P.mouse),
    postedAt: hoursAgo(15),
    sold: 140,
  },
  {
    id: 'l19',
    title: 'Car Android Screen 9"',
    price: 1600,
    location: 'Wellington, Freetown',
    category: 'vehicles',
    condition: 'New',
    description: 'Android car stereo with GPS, Bluetooth and reverse camera input. Fitting available.',
    specs: { Screen: '9" touch', Features: 'GPS, Bluetooth, USB', Fitting: 'Available' },
    sellerId: 's4',
    ...photos(P.carstereo),
    postedAt: daysAgo(2),
    sold: 27,
  },
  {
    id: 'l20',
    title: 'Linen Shirt (Band Collar)',
    price: 420,
    location: 'Freetown',
    category: 'fashion',
    condition: 'New',
    description: 'Breathable linen shirt, perfect for the heat. White and sky blue.',
    specs: { Sizes: 'M, L, XL, XXL', Colours: 'White, Sky blue', Material: 'Linen' },
    sellerId: 's6',
    ...photos(P.linenshirt),
    postedAt: hoursAgo(5),
    sold: 58,
    trending: true,
  },
  {
    id: 'l21',
    title: 'Oxford Shirt with Elbow Patch',
    price: 350,
    location: 'Freetown',
    category: 'fashion',
    condition: 'New',
    description: 'Classic cotton Oxford shirt. Navy, white, light blue and grey.',
    specs: { Sizes: 'S–XXL', Colours: 'Navy, White, Blue, Grey', Material: 'Cotton' },
    sellerId: 's6',
    ...photos(P.oxfordshirt),
    postedAt: daysAgo(1),
    sold: 74,
  },
  {
    id: 'l22',
    title: 'Track Jacket',
    price: 580,
    location: 'Freetown',
    category: 'fashion',
    condition: 'New',
    description: 'Zip-up track jacket with stripes. Sky blue, black and pink.',
    specs: { Sizes: 'M, L, XL', Colours: 'Sky blue, Black, Pink' },
    sellerId: 's6',
    ...photos(P.trackjacket),
    postedAt: daysAgo(2),
    sold: 31,
  },
  {
    id: 'l23',
    title: 'Knit Varsity Cardigan',
    price: 650,
    location: 'Freetown',
    category: 'fashion',
    condition: 'New',
    description: 'Cream cardigan with knit sleeves and striped cuffs.',
    specs: { Sizes: 'S, M, L', Colour: 'Cream / blue' },
    sellerId: 's6',
    ...photos(P.cardigan),
    postedAt: daysAgo(3),
    sold: 12,
  },
  {
    id: 'l24',
    title: 'Plaid Midi Dress',
    price: 450,
    location: 'Bo',
    category: 'fashion',
    condition: 'New',
    description: 'Flowing plaid midi dress with short sleeves. Gold, coral and navy prints.',
    specs: { Sizes: 'S–XL', Colours: 'Gold, Coral, Navy' },
    sellerId: 's3',
    ...photos(P.plaiddress),
    postedAt: hoursAgo(28),
    sold: 44,
  },
  {
    id: 'l25',
    title: 'Floral Maxi Dress',
    price: 500,
    location: 'Bo',
    category: 'fashion',
    condition: 'New',
    description: 'Long floral wrap dress with belt. Plus sizes available.',
    specs: { Sizes: 'M–4XL', Colours: 'Green, Yellow, Pink, Black' },
    sellerId: 's3',
    ...photos(P.maxidress),
    postedAt: daysAgo(2),
    sold: 37,
    trending: true,
  },
  {
    id: 'l26',
    title: 'Leather Chelsea Boots',
    price: 1050,
    location: 'Freetown',
    category: 'fashion',
    condition: 'New',
    description: 'Genuine leather Chelsea boots with chunky sole. Black and dark brown.',
    specs: { Sizes: '40–46', Colours: 'Black, Dark brown', Material: 'Leather' },
    sellerId: 's6',
    ...photos(P.chelseaboots),
    postedAt: daysAgo(1),
    sold: 19,
  },
  {
    id: 'l27',
    title: 'Suede Chelsea Boots',
    price: 950,
    location: 'Freetown',
    category: 'fashion',
    condition: 'New',
    description: 'Soft tan suede boots with cream sole.',
    specs: { Sizes: '40–45', Colour: 'Tan' },
    sellerId: 's6',
    ...photos(P.suedeboots),
    postedAt: daysAgo(4),
    sold: 8,
  },
  {
    id: 'l28',
    title: 'Suede Loafers',
    price: 800,
    location: 'Freetown',
    category: 'fashion',
    condition: 'New',
    description: 'Brown suede loafers with stitched toe. Smart and comfortable.',
    specs: { Sizes: '40–46', Colour: 'Brown' },
    sellerId: 's6',
    ...photos(P.loafers),
    postedAt: daysAgo(2),
    sold: 23,
  },
  {
    id: 'l29',
    title: 'Cole Haan Penny Loafers',
    price: 1250,
    oldPrice: 1450,
    location: 'Freetown',
    category: 'fashion',
    condition: 'New',
    description: 'Two-tone leather penny loafers, in original box.',
    specs: { Sizes: '37–41', Colour: 'Burgundy / white' },
    sellerId: 's6',
    ...photos(P.pennyloafers),
    postedAt: daysAgo(1),
    sold: 6,
  },
  {
    id: 'l30',
    title: 'White Sneakers',
    price: 700,
    location: 'Bo',
    category: 'fashion',
    condition: 'New',
    description: 'Clean all-white sneakers. Unisex sizes.',
    specs: { Sizes: '36–45', Colour: 'White' },
    sellerId: 's3',
    ...photos(P.whitesneakers),
    postedAt: hoursAgo(10),
    sold: 65,
    trending: true,
  },
  {
    id: 'l31',
    title: 'Nike Running Shoes',
    price: 1000,
    location: 'Bo',
    category: 'fashion',
    condition: 'New',
    description: 'Lightweight running shoes, navy with orange sole.',
    specs: { Sizes: '40–45', Colour: 'Navy / orange' },
    sellerId: 's3',
    ...photos(P.runningshoes),
    postedAt: daysAgo(2),
    sold: 29,
  },
  {
    id: 'l32',
    title: 'Black & White Court Sneakers',
    price: 650,
    location: 'Freetown',
    category: 'fashion',
    condition: 'New',
    description: 'Leather court sneakers. Easy to clean.',
    specs: { Sizes: '39–45', Colour: 'Black / white' },
    sellerId: 's6',
    ...photos(P.courtsneakers),
    postedAt: daysAgo(3),
    sold: 41,
  },
  {
    id: 'l33',
    title: 'Fisherman Sandals',
    price: 350,
    location: 'Bo',
    category: 'fashion',
    condition: 'New',
    description: 'Woven leather sandals with buckle. Black and brown.',
    specs: { Sizes: '36–42', Colours: 'Black, Brown' },
    sellerId: 's3',
    ...photos(P.sandals),
    postedAt: daysAgo(1),
    sold: 52,
  },
  {
    id: 'l34',
    title: 'Casio Classic Gold Watch',
    price: 780,
    oldPrice: 900,
    location: 'Aberdeen, Freetown',
    category: 'accessories',
    condition: 'New',
    description: 'Original Casio with date, gold case and brown leather strap. Water resistant.',
    specs: { Brand: 'Casio', Strap: 'Leather', 'Water resistant': 'Yes', Warranty: '1 year' },
    sellerId: 's7',
    ...photos(P.casiogold),
    postedAt: hoursAgo(7),
    sold: 33,
    trending: true,
  },
  {
    id: 'l35',
    title: 'Casio Green Dial Watch',
    price: 820,
    location: 'Aberdeen, Freetown',
    category: 'accessories',
    condition: 'New',
    description: 'Green sunburst dial with olive leather strap.',
    specs: { Brand: 'Casio', Strap: 'Leather', 'Water resistant': 'Yes' },
    sellerId: 's7',
    ...photos(P.casiogreen),
    postedAt: daysAgo(1),
    sold: 18,
  },
  {
    id: 'l36',
    title: 'Casio Blue & Black Dial',
    price: 800,
    location: 'Aberdeen, Freetown',
    category: 'accessories',
    condition: 'New',
    description: 'Slim dress watch. Blue or black dial, leather strap.',
    specs: { Brand: 'Casio', Colours: 'Blue, Black' },
    sellerId: 's7',
    ...photos(P.casioblue),
    postedAt: daysAgo(2),
    sold: 14,
  },
  {
    id: 'l37',
    title: 'Rectangular Leather Watch',
    price: 550,
    location: 'Aberdeen, Freetown',
    category: 'accessories',
    condition: 'New',
    description: 'Elegant tank-style watch, gold case and brown strap. Unisex.',
    specs: { Strap: 'Leather', Case: 'Gold tone' },
    sellerId: 's7',
    ...photos(P.tankwatch),
    postedAt: daysAgo(3),
    sold: 22,
  },
  {
    id: 'l38',
    title: 'Coach Laptop Messenger Bag',
    price: 2500,
    location: 'Aberdeen, Freetown',
    category: 'accessories',
    condition: 'New',
    description: 'Signature canvas laptop bag with leather trim. Fits 15" laptops.',
    specs: { Fits: '15" laptop', Colours: 'Charcoal, Khaki', Material: 'Coated canvas, leather' },
    sellerId: 's7',
    ...photos(P.laptopbag),
    postedAt: daysAgo(2),
    sold: 7,
  },
  {
    id: 'l39',
    title: 'Lattafa Khamrah Perfume 100ml',
    price: 750,
    oldPrice: 850,
    location: 'Aberdeen, Freetown',
    category: 'beauty',
    condition: 'New',
    description: 'Original Lattafa Khamrah eau de parfum. Warm, sweet and long-lasting.',
    specs: { Size: '100ml', Type: 'Eau de parfum', Brand: 'Lattafa' },
    sellerId: 's7',
    ...photos(P.perfume),
    postedAt: hoursAgo(4),
    sold: 112,
    trending: true,
  },
  {
    id: 'l40',
    title: 'Living Room Set (5 pieces)',
    price: 19500,
    oldPrice: 22000,
    location: 'Kissy, Freetown',
    category: 'home',
    condition: 'New',
    description: 'Curved sofa, two armchairs and two coffee tables. Several colours.',
    specs: { Pieces: '5', Colours: 'Cream, Brown, Orange accents', Delivery: 'Free in Western Area' },
    sellerId: 's2',
    ...photos(P.livingset),
    postedAt: daysAgo(1),
    sold: 4,
    trending: true,
  },
  {
    id: 'l41',
    title: 'Office Sofa Set',
    price: 9500,
    location: 'Kissy, Freetown',
    category: 'home',
    condition: 'New',
    description: '3-seater, 2 armchairs and coffee table. Great for offices and lounges.',
    specs: { Pieces: '4', Colour: 'Taupe' },
    sellerId: 's2',
    ...photos(P.officesofa),
    postedAt: daysAgo(5),
    sold: 3,
  },
  {
    id: 'l42',
    title: 'Compact Hatchback 2019',
    price: 68000,
    location: 'Wellington, Freetown',
    category: 'vehicles',
    condition: 'Used',
    description: 'Foreign used, low mileage, very fuel efficient. Engine and papers checked.',
    specs: { Year: '2019', Gearbox: 'Automatic', Fuel: 'Petrol', Papers: 'Complete' },
    sellerId: 's4',
    ...photos(P.hatchback),
    postedAt: daysAgo(2),
  },
];

export type Review = {
  id: string;
  sellerId: string;
  listingId?: string;
  author: string;
  rating: number;
  text: string;
  at: string;
};

export const reviews: Review[] = [
  { id: 'r1', sellerId: 's1', listingId: 'l1', author: 'Mohamed K.', rating: 5, text: 'Original phone, sealed. Delivered to Kissy the same day.', at: daysAgo(3) },
  { id: 'r2', sellerId: 's1', listingId: 'l1', author: 'Aminata S.', rating: 5, text: 'Good price and they explained the warranty.', at: daysAgo(9) },
  { id: 'r3', sellerId: 's1', author: 'Ibrahim B.', rating: 4, text: 'Laptop works well. Took a bit long to reply on chat.', at: daysAgo(14) },
  { id: 'r4', sellerId: 's2', author: 'Fatu J.', rating: 5, text: 'Sofa is exactly like the photos. Free delivery to Hill Station.', at: daysAgo(6) },
  { id: 'r5', sellerId: 's3', listingId: 'l6', author: 'Kadiatu M.', rating: 5, text: 'Fits nicely and the material is soft. Ordered two colours.', at: daysAgo(2) },
  { id: 'r6', sellerId: 's3', author: 'Hawa D.', rating: 4, text: 'Nice dresses. Sent to Freetown by bus.', at: daysAgo(12) },
  { id: 'r7', sellerId: 's6', author: 'Abdul T.', rating: 5, text: 'Quality shirts, I will buy again.', at: daysAgo(4) },
  { id: 'r8', sellerId: 's7', listingId: 'l39', author: 'Isha K.', rating: 5, text: 'Original perfume, smells amazing and lasts all day.', at: daysAgo(1) },
  { id: 'r9', sellerId: 's7', author: 'Sorie F.', rating: 5, text: 'Watch came in the original box.', at: daysAgo(8) },
  { id: 'r10', sellerId: 's4', author: 'Alpha B.', rating: 4, text: 'Fitted the screen in my car, works with Bluetooth.', at: daysAgo(10) },
  { id: 'r11', sellerId: 's5', author: 'Musa K.', rating: 5, text: 'Best phone shop in Makeni.', at: daysAgo(5) },
];

export const seedConversations: Conversation[] = [
  {
    id: 'c1',
    memberId: 's1',
    listingId: 'l1',
    unread: 1,
    messages: [
      { id: 'm1', from: 'me', text: 'Hello, is this still available?', at: hoursAgo(2.2) },
      { id: 'm2', from: 'them', text: "Yes, it's available.", at: hoursAgo(2.1) },
      { id: 'm3', from: 'me', text: 'Can you do NLe 26,000?', at: hoursAgo(2) },
      {
        id: 'm4',
        from: 'them',
        text: 'Yes, that works. You can come to our shop in Lumley or we can deliver.',
        at: hoursAgo(1.9),
      },
    ],
  },
  {
    id: 'c2',
    memberId: 'p1',
    unread: 0,
    messages: [
      { id: 'm5', from: 'me', text: 'My sockets are not working, can you come today?', at: daysAgo(1.1) },
      { id: 'm6', from: 'them', text: 'I can come fix it this afternoon.', at: daysAgo(1) },
    ],
  },
];

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  at: string;
  icon: IconName;
};

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Price drop',
    body: 'Samsung TV 55" is now NLe 9,800 (was NLe 11,500).',
    at: hoursAgo(1),
    icon: 'pricetag-outline',
  },
  {
    id: 'n2',
    title: 'New message',
    body: 'Abu Electronics replied to your message.',
    at: hoursAgo(1.9),
    icon: 'chatbubble-ellipses-outline',
  },
  {
    id: 'n3',
    title: 'Welcome to RAYNO',
    body: 'Buy, sell and find services anywhere in Sierra Leone.',
    at: daysAgo(2),
    icon: 'sparkles-outline',
  },
];
