import { useState, useMemo } from 'react';
import { Award, Search, CheckCircle2, AlertTriangle, Star, ArrowRight, ExternalLink, Info } from 'lucide-react';
import { scholarships } from '@/data/scholarships';
import { useRouter } from '@/router';

export function ScholarshipsPage() {
  const { navigate } = useRouter();
  const [search, setSearch] = useState('');
  const [natFilter, setNatFilter] = useState<'all' | 'eu' | 'non-eu'>('all');
  const [degreeFilter, setDegreeFilter] = useState<'all' | 'bachelor' | 'master'>('all');

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      const q = search.toLowerCase();
      if (q && !s.name.toLowerCase().includes(q) && !s.provider.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) {
        return false;
      }
      if (natFilter !== 'all' && s.nationality !== natFilter && s.nationality !== 'both') return false;
      if (degreeFilter !== 'all' && s.degreeLevel !== degreeFilter && s.degreeLevel !== 'both') return false;
      return true;
    });
  }, [search, natFilter, degreeFilter]);

  // Helper to open external links safely
  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="border-b border-slate-200 bg-navy-950 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 text-dutch-400">
              <Award className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Scholarship Repository</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Scholarships for international students
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              A searchable database of scholarships available to EU and Non-EU students, with
              stackability rules so you know what can be combined.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        {/* Search + Filters */}
        <div className="card p-5">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarships by name, provider, or keyword..."
                className="input pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1.5">
                {(['all', 'non-eu', 'eu'] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => setNatFilter(n)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      natFilter === n ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n === 'all' ? 'All nationalities' : n === 'non-eu' ? 'Non-EU' : 'EU'}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5">
                {(['all', 'bachelor', 'master'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDegreeFilter(d)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      degreeFilter === d ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d === 'all' ? 'All degrees' : d === 'bachelor' ? 'Bachelor' : 'Master'}
                  </button>
                ))}
              </div>
              <span className="ml-auto text-sm text-slate-500">
                <span className="font-bold text-navy-900">{filtered.length}</span> scholarships
              </span>
            </div>
          </div>
        </div>

        {/* Scholarship Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sch) => (
            <div key={sch.id} className="card-hover flex flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <Star className="h-5 w-5 text-dutch-500" />
                <div className="flex gap-1.5">
                  <span className={`badge ${
                    sch.nationality === 'non-eu' ? 'bg-dutch-50 text-dutch-700' :
                    sch.nationality === 'eu' ? 'bg-navy-50 text-navy-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {sch.nationality === 'non-eu' ? 'Non-EU' : sch.nationality === 'eu' ? 'EU' : 'All'}
                  </span>
                  <span className="badge bg-slate-100 text-slate-600">
                    {sch.degreeLevel === 'both' ? 'BSc + MSc' : sch.degreeLevel === 'master' ? 'MSc' : 'BSc'}
                  </span>
                </div>
              </div>
              <h3 className="mt-3 text-base font-bold text-navy-900">{sch.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{sch.provider}</p>
              <div className="mt-3 text-2xl font-extrabold text-navy-800">
                €{sch.amount.toLocaleString()}
              </div>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{sch.description}</p>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Eligibility</h4>
                <ul className="mt-1.5 space-y-1">
                  {sch.eligibility.map((e, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-dutch-500" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              {/* IMPROVED Stackable Indicator */}
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className={`flex items-start gap-2 text-xs p-2.5 rounded-lg ${
                  sch.stackable 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {sch.stackable ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold block">Stackable</span>
                        <span className="text-green-700/80 text-[10px] leading-tight block mt-0.5">
                          Can combine with: {sch.stackableWith.join(', ')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Non-stackable</span>
                        <span className="text-amber-700/80 text-[10px] block mt-0.5">
                          Must choose this OR other awards
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* FIXED Apply Button */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Deadline: <span className="font-semibold text-navy-700">{sch.deadline}</span>
                </span>
                <button
                  onClick={() => openExternalLink(sch.link)}
                  className="group flex items-center gap-1 font-semibold text-navy-700 hover:text-dutch-600 transition-colors"
                  aria-label={`Apply for ${sch.name}`}
                >
                  Apply
                  <ExternalLink className="h-3 w-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-navy-900">No scholarships found</p>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-navy-950 p-8 text-center">
          <h3 className="text-xl font-bold text-white">Need help with your IND financial proof?</h3>
          <p className="mt-2 text-sm text-slate-400">
            Calculate exactly how much you need beyond scholarships.
          </p>
          <button onClick={() => navigate({ name: 'calculator' })} className="btn-accent mt-5">
            Open the Cost & IND Calculator
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}