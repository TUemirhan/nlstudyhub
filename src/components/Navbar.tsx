import { GraduationCap, Moon, Sun, LogOut } from 'lucide-react';
import { useRouter } from '@/router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export function Navbar() {
  const { navigate } = useRouter();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => navigate({ name: 'home' })}
            className="flex items-center gap-2 text-navy-900 dark:text-white font-bold text-lg"
          >
            <GraduationCap className="h-6 w-6 text-dutch-500" />
            NLStudyHub
          </button>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            
            {/* ✅ THEME TOGGLE — ALWAYS VISIBLE */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-slate-600" />
              ) : (
                <Sun className="h-5 w-5 text-amber-400" />
              )}
            </button>

            {/* If Logged In */}
            {user ? (
              <>
                <nav className="hidden md:flex items-center gap-6 text-sm">
                  <button onClick={() => navigate({ name: 'dashboard' })} className="text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white">
                    Dashboard
                  </button>
                  <button onClick={() => navigate({ name: 'roadmap' })} className="text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white">
                    Roadmap
                  </button>
                  <button onClick={() => navigate({ name: 'programs' })} className="text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white">
                    Programs
                  </button>
                  <button onClick={() => navigate({ name: 'scholarships' })} className="text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white">
                    Scholarships
                  </button>
                  <button onClick={() => navigate({ name: 'calculator' })} className="text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white">
                    Calculator
                  </button>
                </nav>

                <button
                  onClick={() => signOut()}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 inline mr-1" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}
                className="px-4 py-2 bg-dutch-500 text-white rounded-lg font-medium hover:bg-dutch-600 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}