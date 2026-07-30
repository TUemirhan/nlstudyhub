import { useState } from 'react';
import { GraduationCap, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from '@/router';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';

export function Navbar() {
  const { route, navigate } = useRouter();
  const { user, profile, signOut, isLoading } = useAuth();
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
    console.log('Profile clicked, navigating...'); // Debug
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container-page">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => navigate({ name: 'home' })}
              className="flex items-center gap-2 text-navy-900 hover:opacity-80 transition-opacity"
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
                      ? 'bg-navy-50 text-navy-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {isLoading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-900 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-dutch-100 text-dutch-700">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="max-w-[100px] truncate">{profile?.fullName || user.email?.split('@')[0]}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-medium text-navy-900 truncate">{user.email}</p>
                      </div>
                      
                      {/* FIXED: Profile Button */}
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="h-4 w-4" /> My Profile
                      </button>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="rounded-lg bg-navy-950 px-4 py-2 text-sm font-medium text-white hover:bg-navy-900 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="container-page py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate({ name: link.name as any });
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    isActive(link.name) ? 'bg-navy-50 text-navy-900' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              
              <div className="pt-2 border-t border-slate-100 mt-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate({ name: 'dashboard' });
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-navy-900 hover:bg-slate-50"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
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