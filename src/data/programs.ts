import type { University, Program } from './types';
import { researchUniversities, researchPrograms } from './programs-research';
import { appliedUniversities, appliedPrograms } from './programs-applied';

export const universities: University[] = [...researchUniversities, ...appliedUniversities];

export const programs: Program[] = [...researchPrograms, ...appliedPrograms];

export function getUniversityById(id: string): University | undefined {
  return universities.find((u) => u.id === id);
}

export function getProgramsByUniversity(id: string): Program[] {
  return programs.filter((p) => p.universityId === id);
}

export function getProgramById(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

export const researchUniversitiesList = researchUniversities;
export const appliedUniversitiesList = appliedUniversities;
