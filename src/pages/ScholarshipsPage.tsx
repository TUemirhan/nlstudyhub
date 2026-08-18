import { useState, useEffect, useMemo } from 'react';
import { Award, Search, CheckCircle2, Star, ArrowRight, Info } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { scholarships } from '@/data/scholarships';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@/router';
import { AuthModal } from '@/components/AuthModal';

export function ScholarshipsPage() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [natFilter, setNatFilter] = useState<'all' | 'eu' | 'non-eu'>('all');
  const [degreeFilter, setDegreeFilter] = useState<'all' | 'bachelor' | 'master'>('all');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const loadSaved = async () => {
      if (!user) {
        setSavedIds(new Set());
        return;
      }
      try {
        const savedDoc = await getDoc(doc(db, 'saved_items', user.uid));
        if (savedDoc.exists()) {
          const items = savedDoc.data().items || [];
          setSavedIds(new Set(items.filter((i: any) => i.type === 'scholarship').map((i: any) => i.id)));
        } else {
          setSavedIds(new Set());
        }
      } catch (err) {
        console.error('Error loading saved items:', err);
      }
    };
    loadSaved();
  }, [user]);

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

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleSave = async (sch: (typeof scholarships)[number]) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (savingId) return;

    const isSaved = savedIds.has(sch.id);
    setSavingId(sch.id);

    const newSavedIds = new Set(savedIds);
    if (isSaved) {
      newSavedIds.delete(sch.id);
    } else {
      newSavedIds.add(sch.id);
    }
    setSavedIds(newSavedIds);

    try {
      const savedRef = doc(db, 'saved_items', user.uid);
      const savedDoc = await getDoc(savedRef);
      const currentItems: any[] = savedDoc.exists() ? (savedDoc.data().items || []) : [];

      let newItems;
      if (isSaved) {
        newItems = currentItems.filter((i) => i.id !== sch.id);
      } else {
        const newItem = {
          id: sch.id,
          type: 'scholarship',
          name: sch.name,
          detail: `${sch.provider} • €${sch.amount.toLocaleString()}`,
          deadline: sch.deadline,
        };
        newItems = [...currentItems.filter((i) => i.id !== sch.id), newItem];
      }

      await setDoc(savedRef, { items: newItems }, { merge: true });
    } catch (err) {
      console.error('Error saving item:', err);
      setSavedIds(savedIds);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="border-b border-slate-200 dark:border-slate-700 bg-navy-950 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 text-dutch-400">
              <Award className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Scholarship Repository</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Scholarships for international students
            </h1>
            <p className="mt-4 text-lg text-slate-300 dark:text-slate-400">
              A searchable database of scholarships available to EU and Non-EU students, with
              stackability rules so you know what can be combined.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        {/* Search + Filters */}
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarships by name, provider, or keyword..."
                className="input pl-10 bg-white dark:bg-slate-800 text-navy-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-dutch-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1.5">
                {(['all', 'non-eu', 'eu'] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => setNatFilter(n)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      natFilter === n ? 'bg-navy-800 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
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
                      degreeFilter === d ? 'bg-navy-800 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {d === 'all' ? 'All degrees' : d === 'bachelor' ? 'Bachelor' : 'Master'}
                  </button>
                ))}
              </div>
              <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
                <span className="font-bold text-navy-900 dark:text-white">{filtered.length}</span> scholarships
              </span>
            </div>
          </div>
        </div>

        {/* Scholarship Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sch) => {
            const isSaved = savedIds.has(sch.id);
            const isSaving = savingId === sch.id;
            return (
              <div key={sch.id} className="card-hover flex flex-col p-5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-xl hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleSave(sch)}
                    disabled={isSaving}
                    aria-label={isSaved ? `Remove ${sch.name} from saved items` : `Save ${sch.name}`}
                    aria-pressed={isSaved}
                    className="disabled:opacity-50 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-5 w-5 transition-colors ${
                        isSaved ? 'text-dutch-500 dark:text-amber-400 fill-dutch-500 dark:fill-amber-400' : 'text-slate-400 dark:text-slate-600 hover:text-dutch-400 dark:hover:text-amber-300'
                      }`}
                    />
                  </button>
                  <div className="flex gap-1.5">
                    <span className={`badge px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide border ${
                      sch.nationality === 'non-eu' ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' :
                      sch.nationality === 'eu' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}>
                      {sch.nationality === 'non-eu' ? 'Non-EU' : sch.nationality === 'eu' ? 'EU' : 'All'}
                    </span>
                    <span className="badge px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                      {sch.degreeLevel === 'both' ? 'BSc + MSc' : sch.degreeLevel === 'master' ? 'MSc' : 'BSc'}
                    </span>
                  </div>
                </div>

                {/* Heading — bright white in dark mode */}
                <h3 className="mt-3 text-base font-extrabold text-navy-900 dark:text-white tracking-tight leading-snug">
                  {sch.name}
                </h3>
                
                {/* Provider — light gray */}
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {sch.provider}
                </p>
                
                {/* Amount — bright glowing blue/white */}
                <div className="mt-3 text-3xl font-extrabold text-blue-700 dark:text-sky-300 tracking-tight drop-shadow-[0_2px_8px_rgba(14,165,233,0.25)] dark:drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                  €{sch.amount.toLocaleString()}
                </div>
                
                {/* Description — readable gray */}
                <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {sch.description}
                </p>

                {/* Eligibility — readable white/gray */}
                <div className="mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Eligibility
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {sch.eligibility.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-dutch-500 dark:text-emerald-400" />
                        <span className="leading-snug">{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stackable info box */}
                <div className="mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                  <div className={`flex items-start gap-3 text-xs p-3 rounded-xl border transition-colors ${
                    sch.stackable 
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                  }`}>
                    {sch.stackable ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <div className="flex-1">
                          <span className="font-extrabold block text-sm">Stackable</span>
                          <span className="text-emerald-700/90 dark:text-emerald-300/90 text-[11px] leading-relaxed block mt-1">
                            Can combine with: <span className="font-semibold">{sch.stackableWith.join(', ')}</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div>
                          <span className="font-extrabold block text-sm">Non-stackable</span>
                          <span className="text-amber-700/90 dark:text-amber-300/90 text-[11px] block mt-1">
                            Must choose this OR other awards
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Deadline + Apply */}
                <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Deadline: <span className="font-extrabold text-navy-900 dark:text-white">{sch.deadline}</span>
                  </span>
                  <button
                    onClick={() => openExternalLink(sch.link)}
                    className="group flex items-center gap-1.5 font-extrabold text-blue-700 dark:text-sky-300 hover:text-dutch-500 dark:hover:text-amber-300 transition-colors"
                    aria-label={`Apply for ${sch.name}`}
                  >
                    Apply
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl font-extrabold text-navy-900 dark:text-white">No scholarships found</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-gradient-to-br from-navy-950 to-slate-900 dark:from-slate-950 dark:to-navy-950 p-10 text-center border border-slate-800 shadow-2xl">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">Need help with your IND financial proof?</h3>
          <p className="mt-3 text-base text-slate-300 dark:text-slate-400">
            Calculate exactly how much you need beyond scholarships.
          </p>
          <button onClick={() => navigate({ name: 'calculator' })} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-dutch-500 hover:bg-dutch-600 text-white px-8 py-3.5 font-extrabold text-base shadow-lg shadow-dutch-500/30 hover:shadow-dutch-500/50 transition-all hover:-translate-y-0.5">
            Open the Cost & IND Calculator
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode="signin" />
    </div>
  );
}