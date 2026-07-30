import { useState } from 'react';
import {
  Search,
  Compass,
  Calculator,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Clock,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { useRouter } from '@/router';
import { programs, universities } from '@/data/programs';
import { cities } from '@/data/cities';
import { scholarships } from '@/data/scholarships';

const heroBg = 'https://images.pexels.com/photos/6152717/pexels-photo-6152717.jpeg?auto=compress&cs=tinysrgb&w=1920';

const heroStats = [
  { value: '122k+', label: 'International students in NL' },
  { value: '2,100+', label: 'English-taught programmes' },
  { value: '€1,094', label: 'Monthly IND proof norm' },
  { value: 'Jan 15', label: 'Numerus fixus deadline' },
];

const features = [
  {
    title: 'Immigration & Visa Timeline',
    description:
      'A personalised step-by-step roadmap from Studielink registration to your BSN — tailored to your nationality and degree level.',
    icon: Compass,
    route: 'roadmap' as const,
    number: '01',
  },
  {
    title: 'Cost of Living & IND Calculator',
    description:
      'Calculate exactly how much financial proof you need for your IND visa and compare monthly costs across every major student city.',
    icon: Calculator,
    route: 'calculator' as const,
    number: '02',
  },
  {
    title: 'University Program Finder',
    description:
      'Browse English-taught programs at research and applied sciences universities, with deadlines, seat capacities, and credential rules.',
    icon: GraduationCap,
    route: 'programs' as const,
    number: '03',
  },
];

export function HomePage() {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: 'programs' });
  };

  return (
    <div className="transition-colors">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] overflow-hidden flex flex-col">
        {/* Background image + layered overlays */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Amsterdam canal buildings"
            className="h-full w-full object-cover object-center"
          />
          {/* Dark tint keeping the photo visible but legible */}
          <div className="absolute inset-0 bg-navy-950/70" />
          {/* Subtle left-side vignette for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-transparent to-transparent" />
          {/* Bottom fade to white transition */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent" />
        </div>

        {/* Content */}
        <div className="container-page relative z-10 flex flex-1 flex-col justify-center pt-20 pb-20 lg:pt-28 lg:pb-28">
          <div className="max-w-2xl xl:max-w-3xl">
            {/* Eyebrow */}
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-dutch-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-dutch-400">
                For International Students Only
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.75rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl xl:text-7xl">
              Your complete roadmap<br className="hidden sm:block" /> to studying in the{' '}
              <span className="text-dutch-400">Netherlands.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Built exclusively for EU &amp; Non-EU students — navigate visas, IND financial proof,
              English-taught programmes and deadlines with confidence.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-9 flex w-full max-w-xl overflow-hidden rounded-xl shadow-2xl">
              <div className="flex flex-1 items-center bg-white dark:bg-slate-800 px-4 transition-colors">
                <Search className="mr-2 h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search university programs, visa requirements, or deadlines..."
                  className="min-w-0 flex-1 bg-transparent py-4 text-sm text-navy-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-dutch-500 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-dutch-600 active:bg-dutch-700"
              >
                Explore
              </button>
            </form>

            {/* Quick tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['Numerus fixus', 'MVV visa', 'IND proof', 'NL Scholarship', 'IELTS'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate({ name: 'programs' })}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm transition-colors hover:border-dutch-400 hover:bg-white/20 hover:text-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip — sits on top of the gradient fade */}
        <div className="relative z-10 border-t border-white/10 bg-navy-950/60 backdrop-blur-md">
          <div className="container-page">
            <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label} className="px-6 py-5 sm:px-8 sm:py-6">
                  <div className="text-2xl font-extrabold text-white sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs leading-snug text-slate-400 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-950 py-24 transition-colors">
        <div className="container-page">
          <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-dutch-500">Platform tools</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-4xl transition-colors">
                Everything you need, in one place
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400 lg:text-right transition-colors">
              Three tools built around the real challenges international students face applying to Dutch higher education.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <button
                  key={feat.title}
                  onClick={() => navigate({ name: feat.route })}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-navy-300 dark:hover:border-navy-700 hover:shadow-xl"
                >
                  {/* Number watermark */}
                  <span className="absolute right-6 top-6 text-6xl font-extrabold text-slate-100 dark:text-slate-800 select-none transition-colors group-hover:text-navy-100 dark:group-hover:text-navy-900/30">
                    {feat.number}
                  </span>
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 dark:bg-navy-900/50 transition-colors group-hover:bg-dutch-500">
                    <Icon className="h-6 w-6 text-navy-700 dark:text-navy-300 transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="relative z-10 mt-6 text-xl font-bold text-navy-900 dark:text-white transition-colors">{feat.title}</h3>
                  <p className="relative z-10 mt-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400 transition-colors">{feat.description}</p>
                  <div className="relative z-10 mt-6 flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-navy-300 transition-colors group-hover:text-dutch-600 dark:group-hover:text-dutch-400">
                    Open tool
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="bg-navy-950 py-24">
        <div className="container-page">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-dutch-500">How it works</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              From confusion to clarity in 3 steps
            </h2>
            <p className="mt-3 text-slate-400">
              We translate Dutch immigration and education bureaucracy into a clear, sequential path you can act on today.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Tell us your status',
                body: 'Select EU/EEA or Non-EU and your target degree. We filter every requirement to your exact profile.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Get your timeline',
                body: 'Receive a sequential roadmap covering Studielink, language tests, credential evaluation, and visa steps.',
                icon: BookOpen,
              },
              {
                step: '03',
                title: 'Plan your finances',
                body: 'Calculate IND financial proof, compare city costs, and find scholarships you can stack.',
                icon: Award,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-navy-900 p-8">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-extrabold text-navy-700">{item.step}</span>
                    <div className="h-px flex-1 bg-navy-700" />
                    <Icon className="h-5 w-5 text-dutch-500" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <button onClick={() => navigate({ name: 'roadmap' })} className="btn-accent">
              Build my roadmap
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROGRAMS ─────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-950 py-24 transition-colors">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-dutch-500">Program directory</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-4xl transition-colors">
                Featured English-taught programs
              </h2>
            </div>
            <button
              onClick={() => navigate({ name: 'programs' })}
              className="hidden items-center gap-1.5 text-sm font-semibold text-navy-700 dark:text-navy-300 transition-colors hover:text-dutch-600 sm:flex"
            >
              View all {programs.length} programs
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {programs.slice(0, 6).map((program) => {
              const uni = universities.find((u) => u.id === program.universityId);
              return (
                <button
                  key={program.id}
                  onClick={() => navigate({ name: 'program-detail', id: program.id })}
                  className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-300 dark:hover:border-navy-700 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-navy-50 dark:bg-navy-900/50 px-2.5 py-0.5 text-xs font-semibold text-navy-700 dark:text-navy-300">
                        {program.degree === 'bachelor' ? 'BSc / BA' : 'MSc / MA'}
                      </span>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {program.field}
                      </span>
                    </div>
                    {program.numerousFixus && (
                      <span className="rounded-full bg-dutch-50 dark:bg-dutch-900/30 px-2.5 py-0.5 text-xs font-semibold text-dutch-700 dark:text-dutch-400">
                        Numerus Fixus
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-base font-bold leading-snug text-navy-900 dark:text-white transition-colors group-hover:text-navy-700 dark:group-hover:text-navy-300">
                    {program.name}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    <MapPin className="h-3.5 w-3.5 text-dutch-400" />
                    {uni?.shortName} · {uni?.city}
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 transition-colors">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {program.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe2 className="h-3.5 w-3.5" /> English
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 transition-colors">
                    <div>
                      <span className="text-xs text-slate-400 dark:text-slate-500">Deadline</span>
                      <p className="text-sm font-bold text-navy-800 dark:text-navy-200">{program.deadline}</p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-navy-700 dark:text-navy-300 transition-colors group-hover:text-dutch-600 dark:group-hover:text-dutch-400">
                      View details
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <button onClick={() => navigate({ name: 'programs' })} className="btn-outline text-sm">
              View all programs <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── CITY COMPARISON ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 py-24 transition-colors">
        <div className="container-page">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-dutch-500">Cost of living</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-4xl transition-colors">
                Compare your student city
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400 lg:text-right transition-colors">
              Living costs vary dramatically. Know your numbers before you commit.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cities.map((city, i) => (
              <button
                key={city.id}
                onClick={() => navigate({ name: 'calculator' })}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-dutch-400 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-navy-900 dark:text-white transition-colors">{city.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{city.region}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    #{i + 1}
                  </span>
                </div>
                <div className="mt-5">
                  <span className="text-3xl font-extrabold text-navy-900 dark:text-white transition-colors">€{city.averageRent}</span>
                  <span className="ml-1 text-sm text-slate-400 dark:text-slate-500">/mo rent</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Range: €{city.rentRange[0]}–{city.rentRange[1]}
                </div>
                <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-400 dark:text-slate-500 transition-colors">
                  {city.studentPopulation.toLocaleString()} students
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-dutch-500 opacity-0 transition-opacity group-hover:opacity-100">
                  See full breakdown <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button onClick={() => navigate({ name: 'calculator' })} className="btn-primary">
              Open the Cost & IND Calculator
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── SCHOLARSHIPS ──────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-950 py-24 transition-colors">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-dutch-500">Funding</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-4xl transition-colors">
                Scholarships for international students
              </h2>
            </div>
            <button
              onClick={() => navigate({ name: 'scholarships' })}
              className="hidden items-center gap-1.5 text-sm font-semibold text-navy-700 dark:text-navy-300 hover:text-dutch-600 sm:flex transition-colors"
            >
              View all scholarships <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.slice(0, 3).map((sch) => (
              <button
                key={sch.id}
                onClick={() => navigate({ name: 'scholarships' })}
                className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-300 dark:hover:border-navy-700 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    sch.nationality === 'non-eu'
                      ? 'bg-dutch-50 dark:bg-dutch-900/30 text-dutch-700 dark:text-dutch-400'
                      : sch.nationality === 'eu'
                      ? 'bg-navy-50 dark:bg-navy-900/30 text-navy-700 dark:text-navy-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {sch.nationality === 'non-eu' ? 'Non-EU only' : sch.nationality === 'eu' ? 'EU only' : 'All nationalities'}
                  </span>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {sch.degreeLevel === 'both' ? 'BSc + MSc' : sch.degreeLevel === 'master' ? 'MSc' : 'BSc'}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-navy-900 dark:text-white transition-colors">{sch.name}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sch.provider}</p>

                <div className="mt-4 text-3xl font-extrabold text-navy-900 dark:text-white transition-colors">
                  €{sch.amount.toLocaleString()}
                </div>

                <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">{sch.description}</p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 transition-colors">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Deadline: <span className="font-semibold text-navy-800 dark:text-navy-200">{sch.deadline}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-navy-700 dark:text-navy-300 transition-colors group-hover:text-dutch-600 dark:group-hover:text-dutch-400">
                    Details <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────── */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-14 transition-colors">
        <div className="container-page">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
            <div className="text-center lg:text-left">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white transition-colors">Guidance you can rely on</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors">
                Every tool is built around official IND, Nuffic, and Studielink regulations.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
              {[
                'IND-compliant visa guidance',
                'Nuffic credential pathways',
                'EU & Non-EU pathways',
                'Studielink integration',
                'Scholarship database',
                'City cost comparison',
              ].map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-medium text-navy-700 dark:text-navy-300 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-dutch-500" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-950 py-20">
        <div className="absolute inset-0 opacity-10">
          <img src={heroBg} alt="" className="h-full w-full object-cover" aria-hidden />
        </div>
        <div className="container-page relative z-10 flex flex-col items-center gap-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-dutch-500">Start here</p>
          <h2 className="max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
            Ready to map out your path to the Netherlands?
          </h2>
          <p className="max-w-lg text-slate-400">
            Build your personalised immigration and application roadmap in under 30 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate({ name: 'roadmap' })} className="btn-accent">
              Build my roadmap <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate({ name: 'programs' })} className="btn-outline border-white/20 text-white hover:bg-white/10">
              Browse programs <ShieldCheck className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}