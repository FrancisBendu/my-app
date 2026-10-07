/**
 * Places in Sierra Leone, grouped by region and district (all 16 districts).
 * Each district lists its main towns; Freetown also lists common neighbourhoods.
 * This is reference data, not mock data — extend it freely.
 */

export type Region = {
  name: string;
  districts: District[];
};

export type District = {
  name: string;
  towns: string[];
};

export type Place = {
  /** What the user sees and what listings store, e.g. "Lumley, Freetown" or "Bo". */
  label: string;
  town: string;
  district: string;
  region: string;
};

export const ALL_SIERRA_LEONE = 'All of Sierra Leone';

export const regions: Region[] = [
  {
    name: 'Western Area',
    districts: [
      {
        name: 'Western Area Urban',
        towns: [
          'Freetown',
          'Aberdeen',
          'Allen Town',
          'Brookfields',
          'Calaba Town',
          'Cline Town',
          'Congo Cross',
          'Goderich',
          'Hill Station',
          'Juba',
          'Kingtom',
          'Kissy',
          'Lumley',
          'Murray Town',
          'Tengbeh Town',
          'Wellington',
          'Wilberforce',
        ],
      },
      {
        name: 'Western Area Rural',
        towns: [
          'Waterloo',
          'Hastings',
          'Jui',
          'Grafton',
          'Kossoh Town',
          'Regent',
          'Lakka',
          'Hamilton',
          'Tombo',
          'Kent',
          'York',
          'Newton',
          'Songo',
        ],
      },
    ],
  },
  {
    name: 'Northern Province',
    districts: [
      { name: 'Bombali', towns: ['Makeni', 'Binkolo', 'Kalangba', 'Karina'] },
      { name: 'Falaba', towns: ['Bendugu', 'Sinkunia', 'Musaia'] },
      { name: 'Koinadugu', towns: ['Kabala', 'Fadugu', 'Kurubonla'] },
      { name: 'Tonkolili', towns: ['Magburaka', 'Mile 91', 'Bumbuna', 'Matotoka', 'Yele'] },
    ],
  },
  {
    name: 'North West Province',
    districts: [
      { name: 'Kambia', towns: ['Kambia', 'Rokupr', 'Kychom', 'Madina'] },
      { name: 'Karene', towns: ['Kamakwie', 'Batkanu', 'Kamalo'] },
      { name: 'Port Loko', towns: ['Port Loko', 'Lunsar', 'Lungi', 'Masiaka', 'Pepel', 'Mange'] },
    ],
  },
  {
    name: 'Southern Province',
    districts: [
      { name: 'Bo', towns: ['Bo', 'Tikonko', 'Gerihun', 'Baoma', 'Sumbuya', 'Telu'] },
      { name: 'Bonthe', towns: ['Bonthe', 'Mattru Jong', 'Tihun'] },
      { name: 'Moyamba', towns: ['Moyamba', 'Shenge', 'Rotifunk', 'Mano', 'Taiama'] },
      { name: 'Pujehun', towns: ['Pujehun', 'Zimmi', 'Potoru', 'Bandajuma'] },
    ],
  },
  {
    name: 'Eastern Province',
    districts: [
      {
        name: 'Kailahun',
        towns: ['Kailahun', 'Pendembu', 'Segbwema', 'Daru', 'Buedu', 'Koindu'],
      },
      { name: 'Kenema', towns: ['Kenema', 'Blama', 'Tongo Field', 'Panguma', 'Hangha'] },
      { name: 'Kono', towns: ['Koidu', 'Yengema', 'Tombodu', 'Motema', 'Kayima'] },
    ],
  },
];

const FREETOWN_DISTRICT = 'Western Area Urban';

/** Every town as a flat, searchable list. */
export const places: Place[] = regions.flatMap((region) =>
  region.districts.flatMap((district) =>
    district.towns.map((town) => ({
      label:
        district.name === FREETOWN_DISTRICT && town !== 'Freetown' ? `${town}, Freetown` : town,
      town,
      district: district.name,
      region: region.name,
    })),
  ),
);

export function findPlace(label: string): Place | undefined {
  return places.find((p) => p.label === label);
}

/**
 * True when a listing in `itemLocation` should show for someone browsing `selected`.
 * Matching is by district, so choosing "Bo" also shows listings in Tikonko.
 */
export function isNearby(itemLocation: string, selected: string): boolean {
  if (selected === ALL_SIERRA_LEONE) return true;
  const a = findPlace(itemLocation);
  const b = findPlace(selected);
  if (!a || !b) return itemLocation === selected;
  return a.district === b.district;
}
