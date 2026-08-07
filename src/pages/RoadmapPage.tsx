import { useState, useEffect } from 'react';
import { MapPin, Check, Globe, GraduationCap, BookOpen, Wallet, Calendar, Home, ArrowRight, ArrowLeft, FileText, Plane, CreditCard, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@/router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

type RoadmapData = {
  nationality: 'eu' | 'non-eu' | null;
  degree: 'bachelor' | 'master' | null;
  field: string | null;
  hasEnglishTest: boolean | null;
  budget: 'scholarship-needed' | 'self-funded' | 'partial' | null;
  intake: 'sept-2025' | 'sept-2026' | 'feb-2026' | null;
  housing: 'university' | 'private' | 'undecided' | null;
  createdAt?: string;
  updatedAt?: string;
  completedSteps?: string[];
};

const steps = [
  { id: 'basic', title: 'Basic Info' },
  { id: 'academic', title: 'Academic' },
  { id: 'financial', title: 'Financial' },
  { id: 'logistics', title: 'Logistics' },
];

export function RoadmapPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const { navigate } = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState<RoadmapData>({
    nationality: profile?.nationality || null,
    degree: profile?.targetDegree || null,
    field: null,
    hasEnglishTest: null,
    budget: null,
    intake: null,
    housing: null,
  });

  // Load existing roadmap
  useEffect(() => {
    if (!user) return;
    
    const loadRoadmap = async () => {
      try {
        const roadmapDoc = await getDoc(doc(db, 'roadmaps', user.uid));
        if (roadmapDoc.exists()) {
          const roadmapData = roadmapDoc.data() as RoadmapData;
          setData(roadmapData);
          if (roadmapData.nationality && roadmapData.degree) {
            setShowResults(true);
          }
        }
      } catch (error) {
        console.error('Error loading roadmap:', error);
      }
    };

    loadRoadmap();
  }, [user, profile]);

  // AUTH WALL: Show loading or login required
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-dutch-500" />
          <p className="text-slate-600 dark:text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 animate-fade-in transition-colors">
        <div className="text-center max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="h-16 w-16 bg-navy-100 dark:bg-navy-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-navy-600 dark:text-navy-400" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-3">
            Sign in Required
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Create a free account to generate your personalized study roadmap, track your progress, and get deadline alerts.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate({ name: 'home' })}
              className="w-full py-3 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-colors"
            >
              Sign In / Create Account
            </button>
            <button 
              onClick={() => navigate({ name: 'home' })}
              className="w-full py-3 bg-white border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Go back home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const updateData = (key: keyof RoadmapData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.nationality && data.degree;
      case 1: return data.field && data.hasEnglishTest !== null;
      case 2: return data.budget !== null;
      case 3: return data.intake && data.housing;
      default: return true;
    }
  };

  const generateRoadmap = async () => {
    if (!user) return;

    try {
      const roadmapData: RoadmapData = {
        ...data,
        nationality: data.nationality!,
        degree: data.degree!,
        field: data.field!,
        hasEnglishTest: data.hasEnglishTest!,
        budget: data.budget!,
        intake: data.intake!,
        housing: data.housing!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedSteps: [],
      };

      await setDoc(doc(db, 'roadmaps', user.uid), roadmapData);
      setShowResults(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error saving roadmap:', error);
      alert('Failed to save roadmap. Please try again.');
    }
  };

  const resetRoadmap = () => {
    setShowResults(false);
    setCurrentStep(0);
    setData({
      nationality: profile?.nationality || null,
      degree: profile?.targetDegree || null,
      field: null,
      hasEnglishTest: null,
      budget: null,
      intake: null,
      housing: null,
    });
  };

  if (showResults) {
    return <RoadmapResults data={data} onReset={resetRoadmap} />;
  }

  return (
    <div className="animate-fade-in pb-20">
      <section className="bg-navy-950 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-white">Immigration & Study Roadmap</h1>
            <p className="mt-4 text-lg text-slate-300">
              Answer a few questions to get your personalized step-by-step guide.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="mx-auto max-w-3xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    idx <= currentStep ? 'bg-dutch-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-full h-1 mx-2 ${idx < currentStep ? 'bg-dutch-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6 transition-colors">
            {currentStep === 0 && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2 transition-colors">
                    <Globe className="h-5 w-5 text-dutch-500" /> Nationality Status
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <button
                      onClick={() => updateData('nationality', 'eu')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.nationality === 'eu' ? 'border-dutch-500 bg-dutch-50 dark:bg-dutch-900/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-navy-900 dark:text-white">EU / EEA Citizen</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">No visa required. Register for BSN.</div>
                    </button>
                    <button
                      onClick={() => updateData('nationality', 'non-eu')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.nationality === 'non-eu' ? 'border-dutch-500 bg-dutch-50 dark:bg-dutch-900/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-navy-900 dark:text-white">Non-EU / Non-EEA</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Requires MVV visa and VVR permit.</div>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2 transition-colors">
                    <GraduationCap className="h-5 w-5 text-dutch-500" /> Degree Level
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <button
                      onClick={() => updateData('degree', 'bachelor')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.degree === 'bachelor' ? 'border-dutch-500 bg-dutch-50 dark:bg-dutch-900/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-navy-900 dark:text-white">Bachelor's</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">3-4 years. May include matching.</div>
                    </button>
                    <button
                      onClick={() => updateData('degree', 'master')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.degree === 'master' ? 'border-dutch-500 bg-dutch-50 dark:bg-dutch-900/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-navy-900 dark:text-white">Master's</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">1-2 years. Direct admission.</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2 transition-colors">
                    <BookOpen className="h-5 w-5 text-dutch-500" /> Field of Study
                  </h2>
                  <select
                    value={data.field || ''}
                    onChange={(e) => updateData('field', e.target.value)}
                    className="w-full mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-navy-900 dark:text-white"
                  >
                    <option value="">Select your field</option>
                    <option value="engineering">Engineering & Technology</option>
                    <option value="business">Business & Economics</option>
                    <option value="computer-science">Computer Science & IT</option>
                    <option value="life-sciences">Life Sciences & Medicine</option>
                    <option value="social-sciences">Social Sciences</option>
                    <option value="arts">Arts & Humanities</option>
                    <option value="law">Law & International Relations</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white transition-colors">English Proficiency</h2>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <button
                      onClick={() => updateData('hasEnglishTest', true)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.hasEnglishTest === true ? 'border-dutch-500 bg-dutch-50 dark:bg-dutch-900/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-navy-900 dark:text-white">Yes, I have it</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">IELTS 6.5+ or TOEFL 90+</div>
                    </button>
                    <button
                      onClick={() => updateData('hasEnglishTest', false)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.hasEnglishTest === false ? 'border-dutch-500 bg-dutch-50 dark:bg-dutch-900/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-navy-900 dark:text-white">Not yet</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Need to schedule test</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2 transition-colors">
                  <Wallet className="h-5 w-5 text-dutch-500" /> Financial Situation
                </h2>
                <div className="space-y-3 mt-4">
                  {[
                    { key: 'scholarship-needed', label: 'Need Full Scholarship', desc: 'Looking for full funding', color: 'red' },
                    { key: 'partial', label: 'Partial Support Needed', desc: 'Can cover some costs', color: 'amber' },
                    { key: 'self-funded', label: 'Self-Funded', desc: 'Can cover all costs', color: 'green' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => updateData('budget', option.key as any)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                        data.budget === option.key ? 'border-dutch-500 bg-dutch-50 dark:bg-dutch-900/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full bg-${option.color}-100 dark:bg-${option.color}-900/30 flex items-center justify-center text-${option.color}-600 dark:text-${option.color}-400`}>
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900 dark:text-white">{option.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2 transition-colors">
                    <Calendar className="h-5 w-5 text-dutch-500" /> Intended Intake
                  </h2>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { key: 'sept-2025', label: 'September 2025', desc: 'Main intake' },
                      { key: 'feb-2026', label: 'February 2026', desc: 'Limited programs' },
                      { key: 'sept-2026', label: 'September 2026', desc: 'Planning ahead' },
                    ].map((intake) => (
                      <button
                        key={intake.key}
                        onClick={() => updateData('intake', intake.key as any)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          data.intake === intake.key ? 'border-dutch-500 bg-dutch-50 dark:bg-dutch-900/20' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-navy-900 dark:text-white">{intake.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{intake.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2 transition-colors">
                    <Home className="h-5 w-5 text-dutch-500" /> Housing Preference
                  </h2>
                  <div className="space-y-3 mt-4">
                    {[
                      { key: 'university', label: 'University Housing', desc: 'Guaranteed first year (apply early!)' },
                      { key: 'private', label: 'Private Market', desc: 'More options but competitive' },
                      { key: 'undecided', label: 'Undecided', desc: 'Need guidance' },
                    ].map((h) => (
                      <button
                        key={h.key}
                        onClick={() => updateData('housing', h.key as any)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          data.housing === h.key ? 'border-dutch-500 bg-dutch-50 dark:bg-dutch-900/20' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-navy-900 dark:text-white">{h.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{h.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white disabled:opacity-0"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 disabled:opacity-50"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={generateRoadmap}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2 bg-dutch-500 text-white text-sm font-medium rounded-lg hover:bg-dutch-600 disabled:opacity-50"
              >
                Generate My Roadmap <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Results Component
function RoadmapResults({ data, onReset }: { data: RoadmapData; onReset: () => void }) {
  const steps = generateSteps(data);
  
  return (
    <div className="animate-fade-in">
      <section className="bg-navy-950 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-white">Your Personalized Roadmap</h1>
            <p className="mt-4 text-lg text-slate-300">
              Based on your {data.nationality === 'eu' ? 'EU' : 'Non-EU'} status and {data.degree}'s degree goals.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 flex gap-4 transition-colors">
                <div className="h-10 w-10 rounded-full bg-dutch-500 text-white flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="h-5 w-5 text-dutch-500" />
                    <h3 className="font-bold text-navy-900 dark:text-white transition-colors">{step.title}</h3>
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full ml-auto transition-colors">
                      {step.timeline}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 transition-colors">{step.description}</p>
                  
                  {step.warning && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200 mb-3 transition-colors">
                      ⚠️ {step.warning}
                    </div>
                  )}
                  
                  <ul className="space-y-2">
                    {step.tasks.map((task, tidx) => (
                      <li key={tidx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-dutch-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300 transition-colors">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={onReset}
              className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Create New Roadmap
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors"
            >
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateSteps(data: RoadmapData) {
  const steps: Array<{
    title: string;
    description: string;
    timeline: string;
    icon: any;
    warning?: string;
    tasks: string[];
  }> = [];

  steps.push({
    title: 'Research & Shortlist Universities',
    description: `Find ${data.degree} programs in ${data.field} that match your profile.`,
    timeline: 'Now - 6 months before',
    icon: FileText,
    tasks: [
      'Check admission requirements on Studielink',
      'Verify your diploma is equivalent to Dutch VWO/HBO',
      'Note application deadlines (Jan 15 for Numerus Fixus)',
    ],
  });

  if (data.hasEnglishTest === false) {
    steps.push({
      title: 'Take English Proficiency Test',
      description: 'Most programs require IELTS 6.5+ or TOEFL 90+.',
      timeline: '6-8 months before intake',
      icon: FileText,
      warning: 'Test dates fill up quickly in peak season!',
      tasks: [
        'Register for IELTS/TOEFL at nearest test center',
        'Allow 2 weeks for results',
        'Send scores directly to universities via test center',
      ],
    });
  }

  if (data.nationality === 'non-eu') {
    steps.push({
      title: 'Prepare Financial Proof',
      description: 'IND requires €1,350/month in your bank account.',
      timeline: '3-4 months before visa application',
      icon: CreditCard,
      warning: 'Funds must be available for full 12 months!',
      tasks: [
        'Calculate total needed: €16,200+ for living costs',
        'Add tuition fees (€8,000-€20,000/year)',
        'Get bank statements certified and translated',
        'Apply for NL Scholarship if eligible',
      ],
    });
  }

  steps.push({
    title: 'Submit Applications via Studielink',
    description: data.degree === 'bachelor' ? 'Bachelor applications use centralized system.' : 'Master applications may be direct to university.',
    timeline: data.intake === 'sept-2025' ? 'Before Jan 15, 2025' : 'Check specific deadlines',
    icon: FileText,
    warning: data.degree === 'bachelor' ? 'Numerus Fixus programs have strict Jan 15 deadline!' : undefined,
    tasks: [
      'Create Studielink account',
      'Pay application fees (€75-€100)',
      'Upload transcripts, CV, motivation letter',
      'Request reference letters from professors',
    ],
  });

  if (data.nationality === 'non-eu') {
    steps.push({
      title: 'Apply for Entry Visa (MVV) & Residence Permit',
      description: 'Your university sponsors your application.',
      timeline: '3 months before departure',
      icon: Plane,
      tasks: [
        'University applies to IND on your behalf',
        'Pay IND fees (€192 for MVV, €174 for VVR)',
        'Submit biometric data at Dutch embassy',
        'Wait 4-8 weeks for decision',
      ],
    });
  }

  steps.push({
    title: 'Secure Housing',
    description: data.housing === 'university' ? 'Apply for university housing immediately upon admission.' : 'Start searching private market 3-4 months ahead.',
    timeline: 'Immediately after admission',
    icon: Home,
    warning: 'Amsterdam/Utrecht have severe housing shortages!',
    tasks: [
      data.housing === 'university' ? 'Apply via university housing office' : 'Check Kamernet, Pararius, Facebook groups',
      'Budget €400-€800/month for rent',
      'Sign contract and pay deposit (usually 2 months)',
      'Arrange utilities if private housing',
    ],
  });

  steps.push({
    title: 'Arrival & Registration',
    description: 'Complete mandatory registrations within days of arrival.',
    timeline: 'First week in Netherlands',
    icon: MapPin,
    tasks: [
      'Register with municipality (GBA) for BSN number',
      'Open Dutch bank account (required for salary/refunds)',
      'Get health insurance (mandatory for non-EU, recommended for EU)',
      'Pick up residence permit at IND office (non-EU)',
      'Attend university orientation week',
    ],
  });

  return steps;
}