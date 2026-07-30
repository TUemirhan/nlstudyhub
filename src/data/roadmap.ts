import type { RoadmapStep } from './types';

export const roadmapSteps: RoadmapStep[] = [
  {
    id: 'research',
    phase: 'Preparation',
    title: 'Research & Shortlist Programs',
    description:
      'Identify English-taught programs, confirm your diploma is recognized, and verify language requirements before applying.',
    timeline: '12–18 months before start',
    duration: '2–3 months',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Shortlist English-taught programs using the Program Finder',
      'Check if your diploma needs Nuffic credential evaluation',
      'Verify IELTS/TOEFL/Cambridge minimum scores for each program',
      'Note whether the program is a numerus fixus (selection) program',
    ],
    links: [
      { label: 'Nuffic Credential Evaluation', url: 'https://www.nuffic.nl/en/subjects/diploma-recognition' },
      { label: 'Studielink', url: 'https://www.studielink.nl' },
    ],
  },
  {
    id: 'language',
    phase: 'Preparation',
    title: 'English Language Proficiency',
    description:
      'Most English-taught programs require a certified language test. Book early — test slots fill up months in advance.',
    timeline: '10–12 months before start',
    duration: '1–3 months (incl. prep)',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Register for IELTS Academic, TOEFL iBT, or Cambridge C1 Advanced',
      'Minimum common thresholds: IELTS 6.5, TOEFL 90, Cambridge C1 (180)',
      'Send official score reports directly to your chosen universities',
      'Some programs require higher scores (e.g. IELTS 7.0 for law/humanities)',
    ],
    links: [
      { label: 'IELTS', url: 'https://www.ielts.org' },
      { label: 'TOEFL', url: 'https://www.ets.org/toefl' },
      { label: 'Cambridge English', url: 'https://www.cambridgeenglish.org' },
    ],
    warning: 'Test results are valid for 2 years. Schedule your test at least 6 months before the application deadline.',
  },
  {
    id: 'studielink',
    phase: 'Application',
    title: 'Register on Studielink',
    description:
      'Studielink is the central online application portal for Dutch higher education. You create one account and apply to multiple institutions.',
    timeline: 'By the program deadline',
    duration: '1–2 hours',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Create a Studielink account with your passport details',
      'Add your chosen program(s) and upload required documents',
      'Pay the application fee (if applicable)',
      'For numerus fixus programs: ensure submission before January 15',
    ],
    links: [
      { label: 'Studielink Portal', url: 'https://www.studielink.nl' },
      { label: 'Numerus Fixus Info', url: 'https://www.studyinnl.org/finances/scholarships' },
    ],
    warning: 'Numerus fixus programs have a hard deadline of January 15. Late applications are not accepted under any circumstances.',
  },
  {
    id: 'credential',
    phase: 'Application',
    title: 'Diploma Credential Evaluation (Nuffic)',
    description:
      'Your secondary or bachelor’s diploma must be evaluated for equivalency to the Dutch VWO (bachelor) or a research university bachelor (master).',
    timeline: 'Alongside application',
    duration: '4–6 weeks',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Submit diploma and transcripts for Nuffic evaluation (or via the university)',
      'Provide certified translations if documents are not in English/Dutch',
      'For research universities: confirm VWO equivalency including subject levels',
      'For applied sciences: HAVO equivalency is typically sufficient',
    ],
    links: [
      { label: 'Nuffic Credential Evaluation', url: 'https://www.nuffic.nl/en/subjects/diploma-recognition' },
    ],
    warning: 'Some diplomas require a subject deficit test (e.g. mathematics). Plan for this early.',
  },
  {
    id: 'matching',
    phase: 'Application',
    title: 'University Matching Procedure',
    description:
      'Research universities require a matching activity to assess whether the program fits your background and motivation.',
    timeline: 'After Studielink submission',
    duration: '2–4 weeks',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor'],
    tasks: [
      'Complete the online or on-campus matching activity',
      'Submit a motivation letter or personal statement',
      'Some programs require an interview or entrance exam',
      'Receive a positive or negative advice (binding for some programs)',
    ],
    links: [],
    warning: 'A negative binding advice means you cannot enroll in that program that year. Take the matching seriously.',
  },
  {
    id: 'admission',
    phase: 'Application',
    title: 'Receive Admission Decision',
    description:
      'The university evaluates your complete application and issues an admission decision, often conditional on final results.',
    timeline: 'April–June (for September start)',
    duration: '4–8 weeks',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Receive a (conditional) admission letter via email and Studielink',
      'Accept the offer in Studielink within the stated deadline',
      'For Non-EU: the university now begins the visa sponsorship process',
      'Pay any required deposit or first installment',
    ],
    links: [],
  },
  {
    id: 'mvv',
    phase: 'Immigration',
    title: 'MVV Entry Visa & VVR Residence Permit (Non-EU)',
    description:
      'Non-EU students need an MVV (entry visa) and VVR (residence permit). Your university acts as the sponsor through the IND.',
    timeline: 'June–July (for September start)',
    duration: '2–3 months',
    appliesTo: ['non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Sign the university’s visa sponsorship agreement',
      'Transfer the IND financial proof (living costs + tuition) to the university',
      'University submits the IND application as your sponsor',
      'Collect your MVV at the Dutch embassy/consulate in your country',
      'Upon arrival, the university arranges your VVR residence permit card',
    ],
    links: [
      { label: 'IND Student Visa', url: 'https://ind.nl/en/study' },
      { label: 'Financial Proof Requirements', url: 'https://ind.nl/en/study/study-residence-permit' },
    ],
    warning: 'The IND requires proof of €1,094.12/month (2025-2026 study norm) for the duration of your study, plus full tuition. Transfer this to the university — do not bring cash.',
  },
  {
    id: 'eu-residence',
    phase: 'Immigration',
    title: 'EU/EEA Registration (No Visa Required)',
    description:
      'EU/EEA students do not need a visa or residence permit, but must register with the municipality if staying longer than 4 months.',
    timeline: 'Upon arrival',
    duration: '1–2 weeks',
    appliesTo: ['eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Travel to the Netherlands with a valid passport or ID',
      'Register with the municipality (BRP) to receive your BSN',
      'No IND residence permit required for EU/EEA citizens',
      'Optional: apply for a Dutch citizen service number (BSN) for work',
    ],
    links: [
      { label: 'EU Citizen Rights', url: 'https://ind.nl/en/eu-citizens' },
    ],
  },
  {
    id: 'financial',
    phase: 'Immigration',
    title: 'IND Financial Proof (Non-EU)',
    description:
      'Before the visa is approved, you must demonstrate sufficient funds to cover living costs and tuition for the full study year.',
    timeline: 'Before MVV approval',
    duration: '1–2 weeks (transfer time)',
    appliesTo: ['non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Transfer the IND living cost amount (€1,094.12 × 12 = €13,129.44 for 2025-2026) to the university',
      'Transfer the first year’s tuition fee',
      'University holds these funds and transfers them back as monthly stipends',
      'Alternatively: provide a bank statement or approved guarantor',
    ],
    links: [
      { label: 'IND Financial Proof', url: 'https://ind.nl/en/study/study-residence-permit/financial-requirements' },
    ],
    warning: 'Funds must be in a blocked account or transferred to the university. Personal bank statements are only accepted in specific cases.',
  },
  {
    id: 'housing',
    phase: 'Arrival',
    title: 'Arrange Housing',
    description:
      'Student housing in the Netherlands is extremely competitive. Start your search the moment you receive admission.',
    timeline: 'May–August (for September start)',
    duration: 'Ongoing',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Apply for university housing through the international office (limited supply)',
      'Use platforms like Kamernet, Pararius, or Facebook housing groups',
      'Budget for a deposit + first month’s rent upfront',
      'Sign up for room waiting lists in your student city early',
    ],
    links: [],
    warning: 'Amsterdam and Utrecht have severe housing shortages. Expect 6–12 month waiting lists for affordable rooms.',
  },
  {
    id: 'bsn',
    phase: 'Arrival',
    title: 'Municipal Registration & BSN',
    description:
      'Every resident must register with the municipality (BRP) to receive a Burgerservicenummer (BSN) — required for banking, work, and healthcare.',
    timeline: 'Within first 2 weeks of arrival',
    duration: '1 appointment + 2 week wait',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Book an appointment with your city’s municipality (gemeente)',
      'Bring: passport, birth certificate (legalized/apostilled), rental contract',
      'Receive your BSN by mail within ~2 weeks',
      'Use your BSN to open a Dutch bank account and get health insurance',
    ],
    links: [
      { label: 'BSN Information', url: 'https://www.government.nl/topics/personal-data/citizen-service-number' },
    ],
    warning: 'Non-EU students: you cannot register until your VVR residence permit is processed. Coordinate with the university’s international office.',
  },
  {
    id: 'insurance',
    phase: 'Arrival',
    title: 'Dutch Health Insurance',
    description:
      'All residents must have health insurance. EU students can use their EHIC for the first year; Non-EU students must take out Dutch insurance or a student policy.',
    timeline: 'Within 4 months of arrival',
    duration: '1–2 hours',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'EU students: use your EHIC card (valid 1 year), then switch to Dutch insurance if working',
      'Non-EU students: take out a student health insurance policy (e.g. AON IPS)',
      'If you take a part-time job, you MUST switch to standard Dutch basisverzekering',
      'Apply for healthcare allowance (zorgtoeslag) if eligible',
    ],
    links: [
      { label: 'AON IPS Student Insurance', url: 'https://www.aon.com/en-nl/ips' },
    ],
    warning: 'Failing to get insurance within 4 months results in fines. If you start working, Dutch law requires standard insurance regardless of nationality.',
  },
  {
    id: 'enroll',
    phase: 'Arrival',
    title: 'University Enrollment & Orientation',
    description:
      'Finalize your enrollment, attend the international student orientation, and collect your student card.',
    timeline: 'Late August / Early September',
    duration: '1 week',
    appliesTo: ['eu', 'non-eu'],
    degree: ['bachelor', 'master'],
    tasks: [
      'Complete enrollment in Studielink (accept all offers)',
      'Attend the international student orientation week (e.g. ESN, ISN)',
      'Collect your student card and campus access',
      'Register for courses and set up your university email',
    ],
    links: [],
  },
];

export function getFilteredSteps(
  nationality: 'eu' | 'non-eu',
  degree: 'bachelor' | 'master'
): RoadmapStep[] {
  return roadmapSteps.filter(
    (step) => step.appliesTo.includes(nationality) && step.degree.includes(degree)
  );
}
