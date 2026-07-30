import { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  Clock,
  Globe2,
  MapPin,
  ArrowRight,
  Users,
  Calendar,
  Building2,
  X,
} from 'lucide-react';
import { programs, universities, getUniversityById } from '@/data/programs';
import { useRouter } from '@/router';
import type { DegreeLevel, ProgramType, DeadlineType } from '@/data/types';

const fields = [
  'All',
  'Engineering',
  'Computer Science',
  'Business & Economics',
  'Environmental Science',
  'Life Sciences',
  'Humanities & Social Sciences',
  'Law & Politics',
  'Natural Sciences',
  'Medicine & Health',
  'Psychology',
  'Communication & Media',
  'Mathematics & Physics',
  'Tourism & Leisure',
  'Built Environment',
];

const deadlineLabels: Record<DeadlineType, string> = {
  'numerous-fixus': 'Numerus Fixus',
  standard: 'Standard',
  rolling: 'Rolling',
  'early-bird': 'Early Bird',
};

export function ProgramsPage() {
  const { navigate } = useRouter();
  const [search, setSearch] = useState('');
  const [degreeFilter, setDegreeFilter] = useState<'all' | DegreeLevel>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ProgramType>('all');
  const [fieldFilter, setFieldFilter] = useState('All');
  const [nfOnly, setNfOnly] = useState(false);
  const [uniFilter, setUniFilter] = useState('all');

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const uni = getUniversityById(p.universityId);
      if (!uni) return false;

      const q = search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !uni.name.toLowerCase().includes(q) && !uni.city.toLowerCase().includes(q)) {
        return false;
      }
      if (degreeFilter !== 'all' && p.degree !== degreeFilter) return false;
      if (typeFilter !== 'all' && uni.type !== typeFilter) return false;
      if (fieldFilter !== 'All' && p.field !== fieldFilter) return false;
      if (nfOnly && !p.numerousFixus) return false;
      if (uniFilter !== 'all' && p.universityId !== uniFilter) return false;
      return true;
    });
  }, [search, degreeFilter, typeFilter, fieldFilter, nfOnly, uniFilter]);

  const clearFilters = () => {
    setSearch('');
    setDegreeFilter('all');
    setTypeFilter('all');
    setFieldFilter('All');
    setNfOnly(false);
    setUniFilter('all');
  };

  const hasFilters = search || degreeFilter !== 'all' || typeFilter !== 'all' || fieldFilter !== 'All' || nfOnly || uniFilter !== 'all';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="border-b border-slate-200 bg-navy-950 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 text-dutch-400">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Program Finder</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              English-taught programs in the Netherlands
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Browse {programs.length} English-taught programs across {universities.length} Dutch
              universities. Filter by degree, type, field, and deadline. Every program lists
              international seat capacity, credential equivalencies, and exact deadlines.
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
                placeholder="Search by program name, university, or city..."
                className="input pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Filter className="h-4 w-4" /> Filters:
              </div>

              {/* Degree */}
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

              {/* University type */}
              <div className="flex gap-1.5">
                {(['all', 'research', 'applied'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      typeFilter === t ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'all' ? 'All types' : t === 'research' ? 'Research' : 'Applied'}
                  </button>
                ))}
              </div>

              {/* Field */}
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 focus:border-navy-500 focus:outline-none"
              >
                {fields.map((f) => (
                  <option key={f} value={f}>{f === 'All' ? 'All fields' : f}</option>
                ))}
              </select>

              {/* Numerus fixus toggle */}
              <button
                onClick={() => setNfOnly(!nfOnly)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  nfOnly ? 'bg-dutch-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                Numerus Fixus only
              </button>

              {/* University filter */}
              <select
                value={uniFilter}
                onChange={(e) => setUniFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 focus:border-navy-500 focus:outline-none"
              >
                <option value="all">All universities</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>{u.shortName}</option>
                ))}
              </select>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-dutch-600"
                >
                  <X className="h-3.5 w-3.5" /> Clear all
                </button>
              )}

              <span className="ml-auto text-sm text-slate-500">
                <span className="font-bold text-navy-900">{filtered.length}</span> programs
              </span>
            </div>
          </div>
        </div>

        {/* Program Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((program) => {
            const uni = getUniversityById(program.universityId)!;
            return (
              <button
                key={program.id}
                onClick={() => navigate({ name: 'program-detail', id: program.id })}
                className="card-hover group flex flex-col p-5 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="badge bg-navy-50 text-navy-700">
                      {program.degree === 'bachelor' ? 'BSc/BA' : 'MSc/MA'}
                    </span>
                    {program.numerousFixus && (
                      <span className="badge bg-dutch-50 text-dutch-700">Numerus Fixus</span>
                    )}
                  </div>
                  <span className="badge bg-slate-100 text-slate-600">{deadlineLabels[program.deadlineType]}</span>
                </div>

                <h3 className="mt-3 text-base font-bold text-navy-900 group-hover:text-navy-700">
                  {program.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Building2 className="h-3.5 w-3.5" /> {uni.shortName}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {uni.city} · {uni.type === 'research' ? 'Research' : 'Applied Sciences'}
                </p>

                <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                  {program.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3.5 w-3.5" /> {program.duration}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Globe2 className="h-3.5 w-3.5" /> {program.language}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Users className="h-3.5 w-3.5" /> {program.internationalSeats} intl. seats
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="h-3.5 w-3.5" /> {program.deadline}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-navy-900">
                    €{program.tuitionNonEu.toLocaleString()}<span className="text-xs font-normal text-slate-400">/yr (Non-EU)</span>
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-navy-700 group-hover:text-dutch-600">
                    Details <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-navy-900">No programs found</p>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
            <button onClick={clearFilters} className="btn-outline mt-4 text-sm">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
