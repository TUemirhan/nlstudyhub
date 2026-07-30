import { useState } from 'react';
import { GraduationCap, Menu, X, User, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import { useRouter } from '@/router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AuthModal } from './AuthModal';

export function Navbar() {
  const { route, navigate } = useRouter();
  const { user, profile, signOut, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (name: string) => {
    if (name === 'programs' && route.name === 'program-detail') return true;
    return route.name === name;
  };

  const navLinks = [
    { name: 'roadmap', label: 'Roadmap' },
    { name: 'programs', label: 'Programs' },
    { name: 'scholarships', label: 'Scholarships' },
    { name: 'calculator', label: 'Calculator' },
    { name: 'about', label: 'About' },
  ] as const;

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    navigate({ name: 'dashboard' });
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate({ name: 'home' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 transition-colors">
        <div className="container-page">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => navigate({ name: 'home' })}
              className="flex items-center gap-2 text-navy-900 dark:text-white hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-950">
                <GraduationCap className="h-5 w-5 text-dutch-400" />
              </div>
              <span className="hidden font-bold text-lg sm:inline-block">NLStudyHub</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => navigate({ name: link.name as any })}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.name)
                      ? 'bg-navy-50 dark:bg-navy-900 text-navy-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-navy-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Auth Section + Theme Toggle */}
            <div className="hidden md:flex items-center gap-2">
              {/* THEME TOGGLE BUTTON - DESKTOP */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-slate-600" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-400" />
                )}
              </button>

              {isLoading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-navy-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-dutch-100 text-dutch-700">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="max-w-[100px] truncate">{profile?.fullName || user.email?.split('@')[0]}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                        <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <User className="h-4 w-4" /> My Profile
                      </button>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="rounded-lg bg-navy-950 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="container-page py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate({ name: link.name as any });
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    isActive(link.name) 
                      ? 'bg-navy-50 dark:bg-navy-900 text-navy-900 dark:text-white' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              
              {/* THEME TOGGLE - MOBILE */}
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                {theme === 'light' ? (
                  <><Moon className="h-4 w-4" /> Dark Mode</>
                ) : (
                  <><Sun className="h-4 w-4 text-amber-400" /> Light Mode</>
                )}
              </button>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate({ name: 'dashboard' });
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-navy-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-lg bg-navy-950 px-3 py-2 text-sm font-medium text-white"
                  >
                    Sign In / Sign Up
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}