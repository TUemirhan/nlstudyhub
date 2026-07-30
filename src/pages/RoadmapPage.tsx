import { useState } from 'react';
import {
  Compass,
  Globe,
  FileText,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  MapPin,
  Clock,
  Calendar,
} from 'lucide-react';
import { getFilteredSteps } from '@/data/roadmap';
import type { NationalityStatus, DegreeLevel, RoadmapStep } from '@/data/types';

const phaseColors: Record<string, string> = {
  Preparation: 'navy',
  Application: 'dutch',
  Immigration: 'navy',
  Arrival: 'dutch',
};

export function RoadmapPage() {
  const [nationality, setNationality] = useState<NationalityStatus | null>(null);
  const [degree, setDegree] = useState<DegreeLevel | null>(null);
  const [started, setStarted] = useState(false);

  const canStart = nationality && degree;
  const steps = started && nationality && degree ? getFilteredSteps(nationality, degree) : [];

  const reset = () => {
    setNationality(null);
    setDegree(null);
    setStarted(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="border-b border-slate-200 bg-navy-950 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 text-dutch-400">
              <Compass className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Immigration Roadmap</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Your personalized application & immigration timeline
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Answer two questions and we’ll generate a sequential, step-by-step roadmap from your
              first application to your first day as a registered student in the Netherlands.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-12">
        {!started ? (
          /* Wizard Selection */
          <div className="mx-auto max-w-3xl">
            <div className="card p-8 sm:p-10">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy-700">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-xs text-white">1</span>
                  What is your nationality status?
                </div>
                <p className="mt-1 ml-9 text-sm text-slate-500">
                  This determines whether you need an MVV entry visa and IND residence permit.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setNationality('eu')}
                    className={`flex items-start gap-3 rounded-xl border-2 p-5 text-left transition-all ${
                      nationality === 'eu'
                        ? 'border-navy-600 bg-navy-50'
                        : 'border-slate-200 hover:border-navy-300 hover:bg-slate-50'
                    }`}
                  >
                    <Globe className="h-6 w-6 shrink-0 text-navy-700" />
                    <div>
                      <div className="font-bold text-navy-900">EU / EEA Citizen</div>
                      <p className="mt-1 text-sm text-slate-500">
                        No visa required. Register with municipality for BSN.
                      </p>
                    </div>
                    {nationality === 'eu' && <CheckCircle2 className="ml-auto h-5 w-5 text-navy-600" />}
                  </button>
                  <button
                    onClick={() => setNationality('non-eu')}
                    className={`flex items-start gap-3 rounded-xl border-2 p-5 text-left transition-all ${
                      nationality === 'non-eu'
                        ? 'border-dutch-500 bg-dutch-50'
                        : 'border-slate-200 hover:border-dutch-300 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="h-6 w-6 shrink-0 text-dutch-600" />
                    <div>
                      <div className="font-bold text-navy-900">Non-EU / Non-EEA Citizen</div>
                      <p className="mt-1 text-sm text-slate-500">
                        Requires MVV entry visa and VVR residence permit via university sponsorship.
                      </p>
                    </div>
                    {nationality === 'non-eu' && <CheckCircle2 className="ml-auto h-5 w-5 text-dutch-600" />}
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy-700">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-xs text-white">2</span>
                  What degree level are you applying for?
                </div>
                <p className="mt-1 ml-9 text-sm text-slate-500">
                  Bachelor’s and Master’s applicants follow different admission and matching procedures.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setDegree('bachelor')}
                    className={`flex items-start gap-3 rounded-xl border-2 p-5 text-left transition-all ${
                      degree === 'bachelor'
                        ? 'border-navy-600 bg-navy-50'
                        : 'border-slate-200 hover:border-navy-300 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="h-6 w-6 shrink-0 text-navy-700" />
                    <div>
                      <div className="font-bold text-navy-900">Bachelor’s Degree</div>
                      <p className="mt-1 text-sm text-slate-500">
                        Undergraduate programs (3–4 years). Includes matching procedure.
                      </p>
                    </div>
                    {degree === 'bachelor' && <CheckCircle2 className="ml-auto h-5 w-5 text-navy-600" />}
                  </button>
                  <button
                    onClick={() => setDegree('master')}
                    className={`flex items-start gap-3 rounded-xl border-2 p-5 text-left transition-all ${
                      degree === 'master'
                        ? 'border-navy-600 bg-navy-50'
                        : 'border-slate-200 hover:border-navy-300 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="h-6 w-6 shrink-0 text-navy-700" />
                    <div>
                      <div className="font-bold text-navy-900">Master’s Degree</div>
                      <p className="mt-1 text-sm text-slate-500">
                        Graduate programs (1–2 years). No matching procedure required.
                      </p>
                    </div>
                    {degree === 'master' && <CheckCircle2 className="ml-auto h-5 w-5 text-navy-600" />}
                  </button>
                </div>
              </div>

              <button
                disabled={!canStart}
                onClick={() => setStarted(true)}
                className="btn-primary w-full text-base"
              >
                Generate My Roadmap
                <ArrowRight className="h-5 w-5" />
              </button>
              {!canStart && (
                <p className="mt-2 text-center text-xs text-slate-400">
                  Select both options above to continue.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Generated Roadmap */
          <div>
            {/* Summary bar */}
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="badge bg-navy-100 text-navy-800">
                  {nationality === 'eu' ? 'EU / EEA' : 'Non-EU / Non-EEA'}
                </span>
                <span className="badge bg-dutch-100 text-dutch-800">
                  {degree === 'bachelor' ? 'Bachelor’s' : 'Master’s'}
                </span>
                <span className="text-slate-500">{steps.length} steps in your roadmap</span>
              </div>
              <button onClick={reset} className="btn-outline text-sm">
                <RotateCcw className="h-4 w-4" />
                Start Over
              </button>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-200 sm:left-8" />
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <RoadmapStepCard key={step.id} step={step} index={idx} />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-2xl bg-navy-950 p-8 text-center">
              <h3 className="text-xl font-bold text-white">Ready to plan your finances?</h3>
              <p className="mt-2 text-sm text-slate-400">
                Now that you know your steps, calculate exactly how much financial proof you need
                for your IND visa and compare living costs across student cities.
              </p>
              <a href="#/calculator" className="btn-accent mt-5">
                Open the Cost & IND Calculator
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RoadmapStepCard({ step, index }: { step: RoadmapStep; index: number }) {
  const phaseColor = phaseColors[step.phase] || 'navy';
  const isDutch = phaseColor === 'dutch';

  return (
    <div className="relative pl-16 sm:pl-20">
      {/* Node */}
      <div
        className={`absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-md sm:h-16 sm:w-16 ${
          isDutch ? 'bg-dutch-500' : 'bg-navy-800'
        }`}
      >
        <span className="text-lg font-extrabold text-white sm:text-xl">{index + 1}</span>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span
              className={`badge ${
                isDutch ? 'bg-dutch-50 text-dutch-700' : 'bg-navy-50 text-navy-700'
              }`}
            >
              {step.phase}
            </span>
            <h3 className="mt-2 text-lg font-bold text-navy-900">{step.title}</h3>
          </div>
          <div className="flex flex-col gap-1 text-right text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {step.timeline}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {step.duration}
            </span>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>

        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Key tasks</h4>
          <ul className="mt-2 space-y-2">
            {step.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-dutch-500" />
                {task}
              </li>
            ))}
          </ul>
        </div>

        {step.warning && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-dutch-200 bg-dutch-50 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-dutch-600" />
            <p className="text-sm text-dutch-800">{step.warning}</p>
          </div>
        )}

        {step.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {step.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-700 transition-colors hover:border-navy-400 hover:bg-navy-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
