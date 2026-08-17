import { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Globe2, Calendar, Building2, Wallet, UserPlus, Map, ChevronDown, Sun, Moon, Menu, X } from 'lucide-react';
import { useRouter } from '@/router';
import { useAuth } from '@/contexts/AuthContext';

// Amsterdam canal background
const heroBg = 'https://images.pexels.com/photos/6152717/pexels-photo-6152717.jpeg?auto=compress&cs=tinysrgb&w=1920';

export function LandingPage() {
  const { navigate } = useRouter();
  const { user, isLoading, isGoogleRedirect, signIn, signUp, signInWithGoogle } = useAuth();

  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleOpenAuth = () => { setIsSignUp(true); setShowAuth(true); };
    window.addEventListener('openAuthModal', handleOpenAuth);
    return () => window.removeEventListener('openAuthModal', handleOpenAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFeaturesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) { root.classList.add('dark'); } else { root.classList.remove('dark'); }
  }, [isDark]);

  useEffect(() => {
  if (user && !isLoading && !isGoogleRedirect) {
    setShowAuth(false);
    navigate({ name: 'dashboard' });
  }
}, [user, isLoading, isGoogleRedirect]);

  const getNextDeadline = (month: number, day: number) => {
    const now = new Date();
    let target = new Date(now.getFullYear(), month - 1, day, 23, 59, 59);
    if (target.getTime() < now.getTime()) {
      target = new Date(now.getFullYear() + 1, month - 1, day, 23, 59, 59);
    }
    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return {
      days: days > 0 ? days : 0,
      date: target.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  };

  const numerusFixus = getNextDeadline(1, 15);
  const housing = getNextDeadline(3, 1);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password, {
          fullName: fullName || email.split('@')[0], nationality: 'non-eu', targetDegree: 'master'
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
      }
      setShowAuth(false);
      navigate({ name: 'dashboard' });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
  setLoading(true);
  setError('');
  try {
    const { error, message } = await signInWithGoogle();
    if (error) {
      setError(message || 'Google sign-in failed');
      setLoading(false);
    }
    // If no error, the page will redirect to Google
    // and come back — result handled in AuthContext useEffect
  } catch (err: any) {
    setError('Google sign-in failed. Please try again.');
    setLoading(false);
  }
};

  const featuresList = [
    { icon: Globe2, title: 'Personalized Immigration Roadmap', desc: 'Step-by-step visa guidance tailored to your nationality (EU vs Non-EU).' },
    { icon: Wallet, title: 'IND Financial Calculator', desc: 'Calculate exact proof of funds needed and compare living costs across 14 Dutch cities.' },
    { icon: Building2, title: 'University Program Finder', desc: 'Browse 2,000+ English-taught programs with real deadlines.' },
    { icon: Calendar, title: 'Deadline Alerts', desc: 'Never miss Numerus Fixus (Jan 15), scholarship deadlines, or housing windows.' }
  ];

  const steps = [
    {
      step: '01',
      icon: UserPlus,
      title: 'Create Free Account',
      desc: 'Tell us your nationality and target degree — takes 30 seconds.',
      color: 'blue',
      bg: 'from-blue-500/10 to-blue-600/5',
      darkBg: 'dark:from-blue-500/10 dark:to-blue-600/5',
      border: 'border-blue-200 dark:border-blue-800/50',
      hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500/60',
      glow: 'hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30',
      accentBg: 'bg-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-500',
      shine: 'via-blue-400/30',
    },
    {
      step: '02',
      icon: Map,
      title: 'Get Your Roadmap',
      desc: 'Receive a personalized visa and application timeline instantly.',
      color: 'orange',
      bg: 'from-orange-500/10 to-orange-600/5',
      darkBg: 'dark:from-orange-500/10 dark:to-orange-600/5',
      border: 'border-orange-200 dark:border-orange-800/50',
      hoverBorder: 'hover:border-orange-400 dark:hover:border-orange-500/60',
      glow: 'hover:shadow-orange-500/20 dark:hover:shadow-orange-500/30',
      accentBg: 'bg-orange-500',
      iconBg: 'bg-orange-100 dark:bg-orange-900/40',
      iconColor: 'text-orange-600 dark:text-orange-400',
      badge: 'bg-orange-500',
      shine: 'via-orange-400/30',
    },
    {
      step: '03',
      icon: CheckCircle2,
      title: 'Track Progress',
      desc: 'Mark steps complete and get deadline reminders before key dates.',
      color: 'emerald',
      bg: 'from-emerald-500/10 to-emerald-600/5',
      darkBg: 'dark:from-emerald-500/10 dark:to-emerald-600/5',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500/60',
      glow: 'hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/30',
      accentBg: 'bg-emerald-500',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-500',
      shine: 'via-emerald-400/30',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* ─── Top Navigation Bar ─────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="container-page mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center gap-2 group">
              <div className="bg-dutch-500 text-white p-1.5 rounded-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-xl text-navy-900 dark:text-white tracking-tight">NLStudyHub</span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-expanded={showFeaturesDropdown}
                >
                  Features
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${showFeaturesDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showFeaturesDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {featuresList.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <button key={idx} onClick={() => { setShowFeaturesDropdown(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
                          className="w-full px-5 py-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                          <div className="h-10 w-10 bg-dutch-100 dark:bg-dutch-900/40 rounded-xl flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-dutch-600 dark:text-dutch-400" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-navy-900 dark:text-white">{feature.title}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{feature.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                How It Works
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setIsDark(!isDark)} aria-label="Toggle background theme"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title={isDark ? 'Switch to light background' : 'Switch to dark background'}>
                {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
              <button onClick={() => { setIsSignUp(false); setShowAuth(true); }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Sign In
              </button>
              <button onClick={() => { setIsSignUp(true); setShowAuth(true); }}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-dutch-500 hover:bg-dutch-600 transition-all shadow-lg shadow-dutch-500/25">
                Get Started
              </button>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-700 dark:text-white" aria-label="Toggle menu">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden pb-6 pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => { setMobileOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">Features</button>
              <button onClick={() => { setMobileOpen(false); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">How It Works</button>
              <div className="pt-3 flex items-center gap-3 border-t border-slate-200 dark:border-slate-800">
                <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button onClick={() => { setIsSignUp(false); setShowAuth(true); setMobileOpen(false); }}
                  className="flex-1 text-sm font-semibold text-left px-3 py-2 text-slate-700 dark:text-white">Sign In</button>
                <button onClick={() => { setIsSignUp(true); setShowAuth(true); setMobileOpen(false); }}
                  className="flex-1 text-sm font-bold text-center px-3 py-2 bg-dutch-500 hover:bg-dutch-600 text-white rounded-xl shadow-lg shadow-dutch-500/25 transition-all">Get Started</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Amsterdam canals" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-950/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
        </div>
        <div className="container-page relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-dutch-400 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-dutch-500 animate-pulse" />
              Built exclusively for international students
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Your complete roadmap to{' '}<span className="text-dutch-400">studying in the Netherlands</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Navigate visas, IND financial proof, English-taught programs, and deadlines with confidence. Join 10,000+ students who found their path to Dutch universities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setShowAuth(true)}
                className="w-full sm:w-auto px-8 py-4 bg-dutch-500 text-white rounded-xl font-bold text-lg hover:bg-dutch-600 transition-all shadow-lg shadow-dutch-500/25 flex items-center justify-center gap-2">
                Create Free Roadmap <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm">
                See How It Works
              </button>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 text-left">
                <p className="text-red-400 text-sm font-medium mb-1">Numerus Fixus Deadline</p>
                <p className="text-3xl font-bold text-white">{numerusFixus.days} days</p>
                <p className="text-slate-400 text-xs">Until {numerusFixus.date}</p>
              </div>
              <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4 text-left">
                <p className="text-amber-400 text-sm font-medium mb-1">Housing Opens</p>
                <p className="text-3xl font-bold text-white">{housing.days} days</p>
                <p className="text-slate-400 text-xs">Until {housing.date}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">Everything you need in one place</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">From visa paperwork to university deadlines, we've mapped out every step of your journey.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {featuresList.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-dutch-300 dark:hover:border-dutch-700 hover:shadow-xl transition-all">
                  <div className="h-12 w-12 bg-dutch-100 dark:bg-dutch-900/30 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-dutch-600 dark:text-dutch-400" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── How It Works (Enhanced) ─────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
        <div className="container-page max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">
              Get your roadmap in 3 minutes
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Three simple steps to your personalized study plan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
        

            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`
                    group relative z-10
                    bg-gradient-to-br ${item.bg} ${item.darkBg}
                    border-2 ${item.border} ${item.hoverBorder}
                    rounded-3xl p-8 pb-10
                    hover:shadow-2xl ${item.glow}
                    hover:-translate-y-2
                    transition-all duration-300 ease-out
                    overflow-hidden
                  `}
                >
                  {/* Shine sweep overlay */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    transition-opacity duration-500
                    pointer-events-none
                    bg-gradient-to-r from-transparent ${item.shine} to-transparent
                    -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]
                    transition-transform duration-700 ease-in-out
                  `} />

                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${item.accentBg} rounded-t-3xl`} />

                  {/* Step badge */}
                  <div className={`
                    ${item.badge} text-white px-4 py-1.5 rounded-full text-xs font-bold
                    shadow-lg mb-6 inline-flex items-center gap-1.5
                    group-hover:scale-105 transition-transform duration-300
                  `}>
                    <span className="opacity-70">STEP</span> {item.step}
                  </div>

                  {/* Icon container */}
                  <div className={`
                    h-20 w-20 ${item.iconBg} rounded-2xl flex items-center justify-center mb-6
                    group-hover:scale-110 group-hover:rotate-3
                    transition-all duration-300 ease-out
                    shadow-sm
                  `}>
                    <Icon className={`h-10 w-10 ${item.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3 group-hover:tracking-wide transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {item.desc}
                  </p>

                  {/* Bottom glow dot */}
                  <div className={`
                    absolute -bottom-4 left-1/2 -translate-x-1/2
                    w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20
                    transition-opacity duration-500
                    ${item.accentBg}
                  `} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Auth Modal ─────────────────────────────────────────── */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
            <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">✕</button>
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-6 text-center">
              {isSignUp ? 'Create Free Account' : 'Sign In'}
            </h3>
            {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg px-3">{error}</p>}
            <button onClick={handleGoogleAuth} disabled={loading}
              className="w-full py-3 border border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center gap-2 mb-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-white font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-600"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or email</span></div>
            </div>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dutch-500 transition-all"
                  required={isSignUp} />
              )}
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dutch-500 transition-all"
                required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dutch-500 transition-all"
                required minLength={6} />
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-navy-900 dark:bg-white dark:text-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 dark:hover:bg-slate-100 transition-all disabled:opacity-70">
                {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-dutch-600 dark:text-dutch-400 font-semibold hover:underline">
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}