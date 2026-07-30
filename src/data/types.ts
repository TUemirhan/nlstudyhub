export type NationalityStatus = 'eu' | 'non-eu';
export type DegreeLevel = 'bachelor' | 'master';

export type ProgramType = 'research' | 'applied';
export type DeadlineType = 'numerous-fixus' | 'rolling' | 'standard' | 'early-bird';

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  type: ProgramType;
  logo: string;
  internationalStudents: number;
  totalStudents: number;
  englishPrograms: number;
  description: string;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  degree: DegreeLevel;
  field: string;
  language: 'English';
  duration: string;
  tuitionEu: number;
  tuitionNonEu: number;
  deadlineType: DeadlineType;
  deadline: string;
  numerousFixus: boolean;
  internationalSeats: number;
  totalSeats: number;
  requirements: string[];
  credentialEquivalency: string;
  description: string;
  tags: string[];
}

export interface City {
  id: string;
  name: string;
  region: string;
  studentPopulation: number;
  averageRent: number;
  rentRange: [number, number];
  utilities: number;
  groceries: number;
  transport: number;
  insurance: number;
  leisure: number;
  description: string;
  vibe: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: number;
  eligibility: string[];
  degreeLevel: DegreeLevel | 'both';
  nationality: 'eu' | 'non-eu' | 'both';
  stackable: boolean;
  stackableWith: string[];
  deadline: string;
  link: string;
  description: string;
}

export interface RoadmapStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  timeline: string;
  duration: string;
  appliesTo: NationalityStatus[];
  degree: DegreeLevel[];
  tasks: string[];
  links: { label: string; url: string }[];
  warning?: string;
}

export interface RoadmapData {
  nationality: 'eu' | 'non-eu' | null;
  degree: 'bachelor' | 'master' | null;
  field: string | null;
  hasEnglishTest: boolean | null;
  budget: 'scholarship-needed' | 'self-funded' | 'partial' | null;
  intake: 'sept-2025' | 'sept-2026' | 'feb-2026' | null;
  housing: 'university' | 'private' | 'undecided' | null;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  nationality: NationalityStatus;
  targetDegree: DegreeLevel;
  targetCity?: string; // Add this
  createdAt: string;
}