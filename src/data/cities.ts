import type { City } from './types';

export const cities: City[] = [
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    region: 'North Holland',
    studentPopulation: 115000,
    averageRent: 950,
    rentRange: [750, 1500],
    utilities: 150,
    groceries: 320,
    transport: 60,
    insurance: 140,
    leisure: 250,
    description:
      'The capital and largest student city, home to UvA, VU, and HvA. A vibrant, international hub with the highest cost of living in the Netherlands.',
    vibe: 'Cosmopolitan, creative, fast-paced',
  },
  {
    id: 'rotterdam',
    name: 'Rotterdam',
    region: 'South Holland',
    studentPopulation: 85000,
    averageRent: 780,
    rentRange: [600, 1200],
    utilities: 140,
    groceries: 295,
    transport: 55,
    insurance: 140,
    leisure: 220,
    description:
      'A modern port city with Erasmus University and Rotterdam UAS. Diverse, bold architecture, and strong business connections to global trade.',
    vibe: 'Modern, diverse, entrepreneurial',
  },
  {
    id: 'utrecht',
    name: 'Utrecht',
    region: 'Utrecht',
    studentPopulation: 70000,
    averageRent: 820,
    rentRange: [650, 1250],
    utilities: 145,
    groceries: 300,
    transport: 55,
    insurance: 140,
    leisure: 230,
    description:
      'A central, canal-ringed city home to Utrecht University and HU. A major student hub with a lively cultural scene and excellent rail connections.',
    vibe: 'Lively, central, cultural',
  },
  {
    id: 'eindhoven',
    name: 'Eindhoven',
    region: 'North Brabant',
    studentPopulation: 50000,
    averageRent: 650,
    rentRange: [500, 950],
    utilities: 130,
    groceries: 280,
    transport: 50,
    insurance: 140,
    leisure: 200,
    description:
      'The Brainport tech region, home to TU/e and Fontys. Strong industry ties to ASML and Philips, lower rent, and a growing international community.',
    vibe: 'Innovative, technical, community-driven',
  },
  {
    id: 'delft',
    name: 'Delft',
    region: 'South Holland',
    studentPopulation: 27000,
    averageRent: 700,
    rentRange: [550, 1050],
    utilities: 135,
    groceries: 290,
    transport: 45,
    insurance: 140,
    leisure: 210,
    description:
      'A historic student town centered around TU Delft. Compact, cycling-friendly, and deeply student-oriented with a strong international community.',
    vibe: 'Historic, cozy, student-centric',
  },
  {
    id: 'groningen',
    name: 'Groningen',
    region: 'Groningen',
    studentPopulation: 60000,
    averageRent: 600,
    rentRange: [450, 850],
    utilities: 125,
    groceries: 270,
    transport: 40,
    insurance: 140,
    leisure: 190,
    description:
      'A lively student city in the north, home to the University of Groningen and Hanze UAS. One of the most affordable student cities with a young, energetic population.',
    vibe: 'Young, energetic, affordable',
  },
  {
    id: 'leiden',
    name: 'Leiden',
    region: 'South Holland',
    studentPopulation: 28000,
    averageRent: 720,
    rentRange: [550, 1000],
    utilities: 135,
    groceries: 290,
    transport: 45,
    insurance: 140,
    leisure: 210,
    description:
      'A historic university town and home to the oldest university in the Netherlands. Charming canals, a strong international academic community, and close to The Hague.',
    vibe: 'Historic, academic, charming',
  },
  {
    id: 'maastricht',
    name: 'Maastricht',
    region: 'Limburg',
    studentPopulation: 21000,
    averageRent: 620,
    rentRange: [480, 880],
    utilities: 130,
    groceries: 280,
    transport: 45,
    insurance: 140,
    leisure: 200,
    description:
      'A southern, internationally-focused city home to Maastricht University. Known for problem-based learning and a large international student body in a European border region.',
    vibe: 'International, intimate, cross-border',
  },
  {
    id: 'nijmegen',
    name: 'Nijmegen',
    region: 'Gelderland',
    studentPopulation: 30000,
    averageRent: 630,
    rentRange: [480, 880],
    utilities: 130,
    groceries: 280,
    transport: 45,
    insurance: 140,
    leisure: 200,
    description:
      'A green, student-friendly city home to Radboud University and HAN. Known for its strong international community and the annual Four Days Marches festival.',
    vibe: 'Green, relaxed, international',
  },
  {
    id: 'wageningen',
    name: 'Wageningen',
    region: 'Gelderland',
    studentPopulation: 12000,
    averageRent: 580,
    rentRange: [450, 800],
    utilities: 125,
    groceries: 270,
    transport: 40,
    insurance: 140,
    leisure: 180,
    description:
      'A compact, sustainability-focused town home to Wageningen University. One of the highest proportions of international students in the country.',
    vibe: 'Sustainable, compact, close-knit',
  },
  {
    id: 'enschede',
    name: 'Enschede',
    region: 'Overijssel',
    studentPopulation: 30000,
    averageRent: 570,
    rentRange: [440, 800],
    utilities: 125,
    groceries: 270,
    transport: 40,
    insurance: 140,
    leisure: 180,
    description:
      'A student city in the east, home to the University of Twente and Saxion. Affordable living, a strong tech-entrepreneurship scene, and a vibrant campus culture.',
    vibe: 'Entrepreneurial, campus-focused, affordable',
  },
  {
    id: 'the-hague',
    name: 'The Hague',
    region: 'South Holland',
    studentPopulation: 25000,
    averageRent: 760,
    rentRange: [600, 1100],
    utilities: 140,
    groceries: 295,
    transport: 55,
    insurance: 140,
    leisure: 220,
    description:
      'The diplomatic capital, home to THUAS and Leiden University\'s Hague campus. International law, politics, and justice define this globally connected city.',
    vibe: 'Diplomatic, international, political',
  },
];

// IND study norm (studienorm) for 2025-2026: €1,094.12 per month
// Source: IND / Dutch government, academic year 2024-2025 (currently in effect for 2025-2026 applications)
export const IND_MONTHLY_AMOUNT = 1094.12;
export const IND_ANNUAL_AMOUNT = IND_MONTHLY_AMOUNT * 12; // €13,129.44

// Statutory tuition fee 2025-2026
export const STATUTORY_TUITION_2025 = 2601;

export function getCityById(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}

export function getMonthlyTotal(city: City): number {
  return (
    city.averageRent + city.utilities + city.groceries + city.transport + city.insurance + city.leisure
  );
}

export function getAnnualTotal(city: City): number {
  return getMonthlyTotal(city) * 12;
}
