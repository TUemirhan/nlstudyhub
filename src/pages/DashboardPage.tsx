import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@/router';
import { 
  LogOut, MapPin, GraduationCap, Globe, 
  TrendingUp, Clock, CheckCircle2, ChevronRight,
  BookOpen, Wallet, Home, Award,
  Bell, Flame, Star,
  Calculator, FileText, Send, Trash2
} from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/firebase/config';

// ... (keep existing interfaces: RoadmapData, DashboardStats) ...

// Mock saved items data - in real app, fetch from Firestore
const MOCK_SAVED_ITEMS = [
  { id: '1', type: 'scholarship', name: 'NL Scholarship', detail: '€5,000', deadline: 'May 1' },
  { id: '2', type: 'program', name: 'TU Delft - MSc Computer Science', detail: '€20,000/year', deadline: 'Dec 1' },
];

export function DashboardPage() {
  const { user, profile, signOut } = useAuth();
  const { navigate } = useRouter();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [stats, setStats] = useState<any>({ deadlineDays: 45 });
  const [loading, setLoading] = useState(true);
  const [activeRoadmapStep, setActiveRoadmapStep] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState(MOCK_SAVED_ITEMS);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Load roadmap and completed steps
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const roadmapDoc = await getDoc(doc(db, 'roadmaps', user.uid));
        if (roadmapDoc.exists()) {
          const data = roadmapDoc.data();
          setRoadmap(data);
          setCompletedSteps(data.completedSteps || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Toggle step completion
  const toggleStepComplete = async (stepId: string) => {
    if (!user) return;
    
    const isCompleted = completedSteps.includes(stepId);
    const newCompletedSteps = isCompleted 
      ? completedSteps.filter(id => id !== stepId)
      : [...completedSteps, stepId];
    
    setCompletedSteps(newCompletedSteps);
    
    try {
      await updateDoc(doc(db, 'roadmaps', user.uid), {
        completedSteps: isCompleted ? arrayRemove(stepId) : arrayUnion(stepId),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating step:', error);
      // Revert on error
      setCompletedSteps(completedSteps);
    }
  };

  // Delete saved item
  const deleteSavedItem = async (itemId: string) => {
    // Optimistic update
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
    
    // In real app, also delete from Firestore:
    // await deleteDoc(doc(db, 'saved_items', itemId));
  };

  // Generate steps with IDs
  const generateStepsWithIds = () => {
    if (!roadmap) return [];
    return [
      { id: 'research', title: 'Research & Shortlist', icon: BookOpen },
      { id: 'english', title: roadmap.hasEnglishTest ? 'Verify English Test' : 'Take English Test', icon: FileText },
      { id: 'finance', title: 'Financial Preparation', icon: Wallet },
      { id: 'apply', title: 'Submit Applications', icon: Send },
      ...(roadmap.nationality === 'non-eu' ? [{ id: 'visa', title: 'Apply for Entry Visa (MVV)', icon: MapPin }] : []),
      { id: 'housing', title: 'Secure Housing', icon: Home },
    ];
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ name: 'home' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-dutch-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-navy-900">Please sign in</h2>
          <button onClick={() => navigate({ name: 'home' })} className="mt-4 px-6 py-2 bg-navy-900 text-white rounded-lg">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const steps = generateStepsWithIds();
  const overallProgress = Math.round((completedSteps.length / (steps.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white pb-32 overflow-hidden">
        <div className="container-page pt-8 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 text-dutch-400 text-sm font-medium mb-2">
                <Flame className="h-4 w-4" />
                <span>Welcome back, {profile?.fullName?.split(' ')[0] || 'Student'}!</span>
              </div>
              <h1 className="text-4xl font-bold">Your Dashboard</h1>
              <p className="text-slate-400 mt-2">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={handleSignOut} className="p-3 rounded-xl bg-white/10 hover:bg-white/20">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Globe} label="Status" value={profile?.nationality === 'eu' ? "EU/EEA" : "Non-EU"} color="text-dutch-400" />
            <StatCard icon={GraduationCap} label="Degree" value={profile?.targetDegree === 'master' ? "Master's" : "Bachelor's"} color="text-blue-400" />
            <StatCard icon={TrendingUp} label="Progress" value={`${overallProgress}%`} color="text-green-400" highlight />
            <StatCard icon={Clock} label="Deadline" value={`${stats.deadlineDays} days`} alert color="text-red-400" />
          </div>
        </div>
      </div>

      <div className="container-page -mt-24 relative z-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-navy-900">Your Progress</h2>
                  <p className="text-sm text-slate-500 mt-1">Complete these steps to stay on track</p>
                </div>
                <span className="text-3xl font-bold text-dutch-600">{overallProgress}%</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-dutch-500 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
              </div>
            </div>

            {/* Roadmap Steps - INTERACTIVE */}
            {roadmap ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-dutch-100 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-dutch-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-navy-900">Your Study Roadmap</h2>
                        <p className="text-sm text-slate-500">
                          {roadmap.degree === 'master' ? "Master's" : "Bachelor's"} in {roadmap.field} • {roadmap.intake}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => navigate({ name: 'roadmap' })} className="text-sm text-dutch-600 font-medium">
                      Edit →
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {steps.map((step, idx) => {
                      const isCompleted = completedSteps.includes(step.id);
                      const isExpanded = activeRoadmapStep === step.id;
                      
                      return (
                        <div 
                          key={step.id}
                          className={`group rounded-xl border-2 transition-all ${
                            isCompleted 
                              ? 'border-green-200 bg-green-50/30' 
                              : isExpanded 
                                ? 'border-dutch-300 bg-dutch-50/20 shadow-md' 
                                : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div 
                            className="p-4 flex items-start gap-4 cursor-pointer"
                            onClick={() => setActiveRoadmapStep(isExpanded ? null : step.id)}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStepComplete(step.id);
                              }}
                              className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                                isCompleted 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-slate-200 text-slate-500 hover:bg-dutch-500 hover:text-white'
                              }`}
                            >
                              {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                            </button>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`font-semibold ${isCompleted ? 'text-slate-500 line-through' : 'text-navy-900'}`}>
                                  {step.title}
                                </h3>
                                <ChevronRight className={`h-5 w-5 text-slate-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </div>
                              <p className="text-sm text-slate-500 mt-1">Step {idx + 1} of {steps.length}</p>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="px-4 pb-4 animate-fade-in">
                              <div className="pl-14 space-y-3">
                                <p className="text-sm text-slate-600">
                                  Detailed guidance for this step will appear here. Complete this step to track your progress toward studying in the Netherlands.
                                </p>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => toggleStepComplete(step.id)}
                                    className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                                      isCompleted 
                                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                                        : 'bg-navy-900 text-white hover:bg-navy-800'
                                    }`}
                                  >
                                    {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                                  </button>
                                  <button className="text-sm px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">
                                    View Resources
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-dutch-500 to-orange-500 rounded-2xl shadow-lg p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Create Your Roadmap</h2>
                <p className="text-dutch-100 mb-6">Get a personalized step-by-step guide.</p>
                <button onClick={() => navigate({ name: 'roadmap' })} className="px-6 py-3 bg-white text-dutch-600 rounded-xl font-bold">
                  Start Building
                </button>
              </div>
            )}

            {/* Saved Items - WITH WORKING DELETE */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  Saved Items
                </h2>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {savedItems.length} items
                </span>
              </div>
              
              {savedItems.length > 0 ? (
                <div className="space-y-3">
                  {savedItems.map((item) => (
                    <div key={item.id} className="p-4 border border-slate-200 rounded-xl hover:border-dutch-300 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          item.type === 'scholarship' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                        <button 
                          onClick={() => deleteSavedItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <h4 className="font-semibold text-navy-900 group-hover:text-dutch-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">{item.detail} • Deadline: {item.deadline}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>No saved items yet</p>
                  <button 
                    onClick={() => navigate({ name: 'scholarships' })}
                    className="mt-2 text-sm text-dutch-600 font-medium"
                  >
                    Browse Scholarships
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Tools */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="font-bold text-navy-900 mb-4">Quick Tools</h3>
              <div className="space-y-2">
                <ToolButton icon={Calculator} title="Cost Calculator" desc="IND requirements" color="bg-blue-50 text-blue-600" onClick={() => navigate({ name: 'calculator' })} />
                <ToolButton icon={BookOpen} title="Find Programs" desc="2,000+ courses" color="bg-purple-50 text-purple-600" onClick={() => navigate({ name: 'programs' })} />
                <ToolButton icon={Award} title="Scholarships" desc="€5k - €30k available" color="bg-green-50 text-green-600" onClick={() => navigate({ name: 'scholarships' })} badge={savedItems.length} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                Critical Deadlines
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <p className="font-medium text-navy-900 text-sm">Numerus Fixus</p>
                  <p className="text-xs text-red-600 font-semibold">{stats.deadlineDays} days left</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components (keep existing StatCard, ToolButton, etc.)
function StatCard({ icon: Icon, label, value, alert, highlight }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
      <Icon className={`h-6 w-6 mb-2 ${alert ? 'text-red-400' : 'text-dutch-400'}`} />
      <p className="text-slate-400 text-xs uppercase font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold ${alert ? 'text-red-400' : 'text-white'} ${highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-dutch-200' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function ToolButton({ icon: Icon, title, desc, color, onClick, badge }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all group text-left">
      <div className={`h-12 w-12 ${color} rounded-xl flex items-center justify-center shadow-sm`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-navy-900">{title}</p>
          {badge > 0 && <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{badge}</span>}
        </div>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-dutch-500" />
    </button>
  );
}