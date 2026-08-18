import { useState } from 'react';
import { X, Mail, Lock, User, GraduationCap, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type NationalityStatus = 'eu' | 'non-eu';
type DegreeLevel = 'bachelor' | 'master';
type AuthMode = 'signin' | 'signup' | 'reset';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode ?? 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nationality, setNationality] = useState<NationalityStatus>('non-eu');
  const [degree, setDegree] = useState<DegreeLevel>('master');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();

  if (!isOpen) return null;

  const getErrorMessage = (code: string): string => {
    const errorMap: Record<string, string> = {
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    return errorMap[code] || 'An error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const { error, message } = await signIn(email, password);
        if (error) {
          setError(message || getErrorMessage(error.code));
          return;
        }
        onClose();
        window.location.hash = '#/dashboard';
      } else if (mode === 'signup') {
        const { error, message } = await signUp(email, password, {
          fullName,
          nationality,
          targetDegree: degree,
        });
        if (error) {
          setError(message || getErrorMessage(error.code));
          return;
        }
        onClose();
        window.location.hash = '#/dashboard';
      } else if (mode === 'reset') {
        const { error, message } = await resetPassword(email);
        if (error) {
          setError(message || getErrorMessage(error.code));
          return;
        }
        setSuccess(message || 'Password reset instructions sent to your email.');
        setMode('signin');
      }
    } catch (err: any) {
      console.error('Auth modal submit error:', err);
      setError(err.code ? getErrorMessage(err.code) : (err.message || 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-navy-950 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              {mode === 'signin' && 'Welcome back'}
              {mode === 'signup' && 'Create your account'}
              {mode === 'reset' && 'Reset password'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {mode === 'signin' && 'Sign in to save your progress'}
              {mode === 'signup' && 'Join NLStudyHub to track your Dutch study journey'}
              {mode === 'reset' && 'Enter your email to receive reset instructions'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-navy-900 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:border-dutch-500 focus:outline-none focus:ring-2 focus:ring-dutch-500/20"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy-900 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:border-dutch-500 focus:outline-none focus:ring-2 focus:ring-dutch-500/20"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-navy-900 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter your password'}
                  minLength={6}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:border-dutch-500 focus:outline-none focus:ring-2 focus:ring-dutch-500/20"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-navy-900 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Status
                </label>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value as NationalityStatus)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 focus:border-dutch-500 focus:outline-none focus:ring-2 focus:ring-dutch-500/20"
                >
                  <option value="non-eu">Non-EU/EEA</option>
                  <option value="eu">EU/EEA</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-navy-900 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> Degree
                </label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value as DegreeLevel)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 focus:border-dutch-500 focus:outline-none focus:ring-2 focus:ring-dutch-500/20"
                >
                  <option value="bachelor">Bachelor's</option>
                  <option value="master">Master's</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-dutch-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-dutch-600 focus:outline-none focus:ring-2 focus:ring-dutch-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </span>
            ) : mode === 'signin' ? (
              'Sign In'
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Send Reset Link'
            )}
          </button>

          <div className="flex flex-col gap-2 pt-2 text-center text-xs">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-slate-500 hover:text-navy-900 transition-colors"
                >
                  Forgot your password?
                </button>
                <div className="text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-semibold text-dutch-600 hover:text-dutch-700"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div className="text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="font-semibold text-dutch-600 hover:text-dutch-700"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-dutch-600 hover:text-dutch-700 font-semibold"
              >
                Back to sign in
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}