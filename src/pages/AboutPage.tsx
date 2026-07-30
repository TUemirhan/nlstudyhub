import {
  Target,
  ShieldCheck,
  Globe2,
  Users,
  BookOpen,
  Calculator,
  Compass,
  Heart,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from '@/router';
import { programs, universities } from '@/data/programs';
import { scholarships } from '@/data/scholarships';
import { cities } from '@/data/cities';

const values = [
  {
    icon: ShieldCheck,
    title: 'Accuracy first',
    body: 'Every figure, deadline, and requirement is checked against official IND, Nuffic, and Studielink sources — not crowdsourced forums.',
  },
  {
    icon: Globe2,
    title: 'Built for internationals',
    body: 'We focus exclusively on the non-Dutch student experience: visa steps, credential evaluation, financial proof, and English-taught programs.',
  },
  {
    icon: BookOpen,
    title: 'Clear, not bureaucratic',
    body: 'We translate Dutch immigration and education jargon into plain, sequential steps you can act on today.',
  },
];

const stats = [
  { value: `${programs.length}`, label: 'English-taught programs' },
  { value: `${universities.length}`, label: 'Dutch universities' },
  { value: `${cities.length}`, label: 'Student cities compared' },
  { value: `${scholarships.length}`, label: 'Scholarships listed' },
];

export function AboutPage() {
  const { navigate } = useRouter();

  return (
    <div className="transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-br from-dutch-500/20 to-transparent" />
        </div>
        <div className="container-page relative z-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-dutch-500">About NLStudyHub</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            We make studying in the Netherlands understandable.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">
            NLStudyHub is a free guidance platform built exclusively for international students applying
            to Dutch higher education. We cut through the bureaucracy of IND visas, Studielink,
            numerus fixus, and credential evaluation so you can focus on what matters: getting admitted.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 transition-colors">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-navy-900 dark:text-white sm:text-4xl transition-colors">{s.value}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm transition-colors">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white dark:bg-slate-950 py-20 transition-colors">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-dutch-500" />
            <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white sm:text-3xl transition-colors">Our mission</h2>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300 transition-colors">
            The Netherlands is one of Europe's most popular study destinations, with over 122,000
            international students. Yet the application process is fragmented across IND, Nuffic,
            Studielink, and individual universities — each with different rules for EU and non-EU
            students. We centralise all of that into one clear, accurate, up-to-date platform.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300 transition-colors">
            Whether you need to know the exact IND financial proof amount, which programs have numerus
            fixus deadlines on January 15, or how your secondary diploma evaluates against Dutch VWO
            or HAVO — we have the answer, sourced from official channels.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 dark:bg-slate-950 py-20 transition-colors">
        <div className="container-page">
          <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white sm:text-3xl transition-colors">What we stand for</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 dark:bg-navy-900/50">
                    <Icon className="h-6 w-6 text-navy-700 dark:text-navy-300" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900 dark:text-white transition-colors">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 transition-colors">{v.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools overview */}
      <section className="bg-white dark:bg-slate-950 py-20 transition-colors">
        <div className="container-page">
          <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white sm:text-3xl transition-colors">What we offer</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Compass, title: 'Immigration Roadmap', body: 'A personalised step-by-step visa timeline.', route: 'roadmap' as const },
              { icon: Calculator, title: 'Cost & IND Calculator', body: 'Calculate financial proof and compare city costs.', route: 'calculator' as const },
              { icon: BookOpen, title: 'Program Finder', body: `Browse ${programs.length} English-taught programs.`, route: 'programs' as const },
              { icon: Users, title: 'Scholarship Database', body: `${scholarships.length} scholarships with eligibility and stacking rules.`, route: 'scholarships' as const },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.title}
                  onClick={() => navigate({ name: tool.route })}
                  className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-navy-300 dark:hover:border-navy-700 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 dark:bg-navy-900/50 transition-colors group-hover:bg-dutch-500">
                    <Icon className="h-5 w-5 text-navy-700 dark:text-navy-300 transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy-900 dark:text-white transition-colors">{tool.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">{tool.body}</p>
                  <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-dutch-500">
                    Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="bg-navy-950 py-20">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Where our data comes from</h2>
          <p className="mt-4 text-slate-400">
            We do not crowdsource or guess. Every piece of guidance traces back to an official source:
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'IND (Immigration and Naturalisation Service) — visa requirements and financial proof norms',
              'Nuffic / EP-Nuffic — credential evaluation and diploma equivalency',
              'Studielink — central application portal deadlines and numerus fixus rules',
              'Dutch Ministry of Education — statutory tuition fees and scholarship regulations',
              'Individual university websites — program-specific deadlines, seat capacities, and fees',
            ].map((source) => (
              <li key={source} className="flex items-start gap-3 text-sm text-slate-300">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-dutch-400" />
                {source}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-slate-50 dark:bg-slate-950 py-20 transition-colors">
        <div className="container-page max-w-2xl text-center">
          <Heart className="mx-auto h-8 w-8 text-dutch-500" />
          <h2 className="mt-4 text-2xl font-extrabold text-navy-900 dark:text-white sm:text-3xl transition-colors">Have a question or correction?</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 transition-colors">
            We are always looking to improve. If you spot an outdated figure or have a suggestion,
            we would love to hear from you.
          </p>
          <a
            href="mailto:hello@nlstudyhub.nl"
            className="btn-primary mt-6 inline-flex"
          >
            <Mail className="h-4 w-4" /> hello@nlstudyhub.nl
          </a>
        </div>
      </section>
    </div>
  );
}