import {
  ArrowLeft,
  Clock,
  Globe2,
  MapPin,
  Users,
  Calendar,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Euro,
  ArrowRight,
} from 'lucide-react';
import { getProgramById, getUniversityById } from '@/data/programs';
import { useRouter } from '@/router';

export function ProgramDetailPage({ programId }: { programId: string }) {
  const { navigate } = useRouter();
  const program = getProgramById(programId);

  if (!program) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg font-semibold text-navy-900">Program not found</p>
        <button onClick={() => navigate({ name: 'programs' })} className="btn-outline mt-4 text-sm">
          Back to Program Finder
        </button>
      </div>
    );
  }

  const uni = getUniversityById(program.universityId)!;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container-page py-4">
          <button
            onClick={() => navigate({ name: 'programs' })}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Program Finder
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-navy-950 py-12">
        <div className="container-page">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-navy-700 text-white">
                  {program.degree === 'bachelor' ? 'Bachelor’s' : 'Master’s'}
                </span>
                <span className="badge bg-slate-700 text-slate-200">{program.field}</span>
                {program.numerousFixus && (
                  <span className="badge bg-dutch-500 text-white">Numerus Fixus</span>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{program.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-lg text-slate-300">
                <Building2 className="h-5 w-5 text-dutch-400" />
                {uni.name}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4" />
                {uni.city} · {uni.type === 'research' ? 'Research University' : 'University of Applied Sciences'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Overview */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-navy-900">Program overview</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{program.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <InfoCard icon={Clock} label="Duration" value={program.duration} />
                <InfoCard icon={Globe2} label="Language" value={program.language} />
                <InfoCard icon={Users} label="Intl. seats" value={`${program.internationalSeats}`} />
                <InfoCard icon={Calendar} label="Deadline" value={program.deadline} />
              </div>
            </div>

            {/* Requirements */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-navy-900">Admission requirements</h2>
              <ul className="mt-4 space-y-3">
                {program.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-dutch-500" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Credential Equivalency */}
            <div className="card p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-navy-700" />
                <h2 className="text-lg font-bold text-navy-900">Diploma credential equivalency</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{program.credentialEquivalency}</p>
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-navy-200 bg-navy-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" />
                <p className="text-sm text-navy-800">
                  All international diplomas must be evaluated by Nuffic (or via the university’s
                  admission office) to confirm equivalency to the Dutch VWO or HAVO level.
                </p>
              </div>
            </div>

            {/* University info */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-navy-900">About {uni.shortName}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{uni.description}</p>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <StatBox label="Total students" value={uni.totalStudents.toLocaleString()} />
                <StatBox label="Intl. students" value={uni.internationalStudents.toLocaleString()} />
                <StatBox label="English programs" value={`${uni.englishPrograms}`} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tuition */}
            <div className="card p-6">
              <h3 className="flex items-center gap-2 text-base font-bold text-navy-900">
                <Euro className="h-5 w-5 text-dutch-500" />
                Tuition fees
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">EU / EEA</div>
                    <div className="text-lg font-extrabold text-navy-900">€{program.tuitionEu.toLocaleString()}</div>
                  </div>
                  <span className="badge bg-navy-50 text-navy-700">per year</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-dutch-50 p-3">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Non-EU</div>
                    <div className="text-lg font-extrabold text-dutch-700">€{program.tuitionNonEu.toLocaleString()}</div>
                  </div>
                  <span className="badge bg-dutch-100 text-dutch-700">per year</span>
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div className="card p-6">
              <h3 className="flex items-center gap-2 text-base font-bold text-navy-900">
                <Calendar className="h-5 w-5 text-dutch-500" />
                Application deadline
              </h3>
              <div className="mt-3 text-2xl font-extrabold text-navy-900">{program.deadline}</div>
              {program.numerousFixus && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-dutch-200 bg-dutch-50 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-dutch-600" />
                  <p className="text-sm text-dutch-800">
                    This is a numerus fixus program. The January 15 deadline is absolute — no late
                    applications are accepted.
                  </p>
                </div>
              )}
            </div>

            {/* Seats */}
            <div className="card p-6">
              <h3 className="flex items-center gap-2 text-base font-bold text-navy-900">
                <Users className="h-5 w-5 text-navy-700" />
                Seat capacity
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">International seats</span>
                  <span className="font-bold text-navy-900">{program.internationalSeats}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total seats</span>
                  <span className="font-bold text-navy-900">{program.totalSeats}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-dutch-500"
                    style={{ width: `${(program.internationalSeats / program.totalSeats) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {Math.round((program.internationalSeats / program.totalSeats) * 100)}% of seats reserved for international students
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <button
                onClick={() => navigate({ name: 'roadmap' })}
                className="btn-primary w-full"
              >
                <GraduationCap className="h-4 w-4" />
                Build my application roadmap
              </button>
              <button
                onClick={() => navigate({ name: 'calculator' })}
                className="btn-outline w-full"
              >
                <Euro className="h-4 w-4" />
                Calculate my costs & IND proof
              </button>
              <button
                onClick={() => navigate({ name: 'scholarships' })}
                className="btn-ghost w-full text-sm"
              >
                Find scholarships for this program
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <Icon className="h-4 w-4 text-navy-600" />
      <div className="mt-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-sm font-bold text-navy-900">{value}</div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <div className="text-lg font-extrabold text-navy-900">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{label}</div>
    </div>
  );
}
