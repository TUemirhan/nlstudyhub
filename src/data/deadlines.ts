export interface Deadline {
  id: string;
  title: string;
  date: string; // ISO format
  category: 'application' | 'scholarship' | 'housing' | 'visa' | 'test';
  applicableTo: {
    nationalities: ('eu' | 'non-eu')[];
    degrees: ('bachelor' | 'master')[];
    intakes: ('sept-2025' | 'sept-2026' | 'feb-2026')[];
  };
  description: string;
  url?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const DEADLINES: Deadline[] = [
  {
    id: 'numerus-fixus-2025',
    title: 'Numerus Fixus Application Deadline',
    date: '2025-01-15T23:59:00',
    category: 'application',
    applicableTo: {
      nationalities: ['eu', 'non-eu'],
      degrees: ['bachelor'],
      intakes: ['sept-2025']
    },
    description: 'Strict deadline for medicine, psychology, and other numerus fixus programs. No exceptions.',
    url: 'https://www.studielink.nl',
    priority: 'critical'
  },
  {
    id: 'nl-scholarship-2025',
    title: 'NL Scholarship Application',
    date: '2025-04-01T23:59:00',
    category: 'scholarship',
    applicableTo: {
      nationalities: ['non-eu'],
      degrees: ['bachelor', 'master'],
      intakes: ['sept-2025']
    },
    description: 'One-time €5,000 grant for non-EEA students. Varies by institution.',
    priority: 'high'
  },
  {
    id: 'housing-amsterdam-2025',
    title: 'University Housing Application Opens',
    date: '2025-02-01T09:00:00',
    category: 'housing',
    applicableTo: {
      nationalities: ['eu', 'non-eu'],
      degrees: ['bachelor', 'master'],
      intakes: ['sept-2025']
    },
    description: 'UVA/VU housing applications open. First come, first served.',
    priority: 'critical'
  },
  {
    id: 'ielts-registration',
    title: 'IELTS Test Registration Deadline',
    date: '2024-11-15T00:00:00', // Dynamic based on intake
    category: 'test',
    applicableTo: {
      nationalities: ['eu', 'non-eu'],
      degrees: ['bachelor', 'master'],
      intakes: ['sept-2025']
    },
    description: 'Last date to register for IELTS to get results before applications.',
    priority: 'high'
  }
];

export function getRelevantDeadlines(
  nationality: 'eu' | 'non-eu' | null,
  degree: 'bachelor' | 'master' | null,
  intake: string | null
): Deadline[] {
  if (!nationality || !degree || !intake) return [];
  
  return DEADLINES.filter(d => {
    const natMatch = d.applicableTo.nationalities.includes(nationality);
    const degMatch = d.applicableTo.degrees.includes(degree);
    const intakeMatch = d.applicableTo.intakes.includes(intake as any);
    return natMatch && degMatch && intakeMatch;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getDaysUntil(date: string): number {
  const deadline = new Date(date);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getUrgencyColor(days: number): string {
  if (days < 7) return 'text-red-600 bg-red-50 border-red-200';
  if (days < 30) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-green-600 bg-green-50 border-green-200';
}