import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  setPersistence,          
  browserLocalPersistence, 
  getRedirectResult,
  type User,
  type AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

type NationalityStatus = 'eu' | 'non-eu';
type DegreeLevel = 'bachelor' | 'master';

interface Profile {
  id: string;
  email: string;
  fullName: string;
  nationality: NationalityStatus;
  targetDegree: DegreeLevel;
  createdAt: string;
  emailVerified: boolean;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isGoogleRedirect: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; message?: string }>;
  signUp: (email: string, password: string, userData: { fullName: string; nationality: NationalityStatus; targetDegree: DegreeLevel }) => Promise<{ error: AuthError | null; message?: string }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null; message?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null; message?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleRedirect, setIsGoogleRedirect] = useState(false);
  

  // Helper: ensure user profile exists in Firestore
  const ensureProfile = async (u: User): Promise<Profile> => {
    const profileDoc = await getDoc(doc(db, 'profiles', u.uid));
    if (profileDoc.exists()) {
      return profileDoc.data() as Profile;
    }
    // New user — create profile
    const profileData: Profile = {
      id: u.uid,
      email: u.email!,
      fullName: u.displayName || 'Student',
      nationality: 'non-eu',
      targetDegree: 'master',
      createdAt: new Date().toISOString(),
      emailVerified: u.emailVerified || true,
      photoURL: u.photoURL || undefined,
    };
    await setDoc(doc(db, 'profiles', u.uid), profileData);
    return profileData;
  };

  // ─── Combined auth initialization ──────────────────────
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      // Step 1: Process any Google redirect result FIRST
      

      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const p = await ensureProfile(result.user);
          setProfile(p);
          setUser(result.user);
          setIsGoogleRedirect(true);
        }
      } catch (err: any) {
        // auth/internal-error on first visit is normal — ignore it
        if (err.code !== 'auth/internal-error') {
          console.error('Redirect result error:', err.code, err.message);
        }
      }

      // Step 2: Set up auth state listener
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            const p = await ensureProfile(firebaseUser);
            setProfile(p);
          } catch (err) {
            console.error('Error fetching profile:', err);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      });
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // ─── Auto-navigate to dashboard after Google redirect ──
  useEffect(() => {
    if (isGoogleRedirect && user && !isLoading) {
      // Small delay to ensure everything is settled
      setTimeout(() => {
        window.location.hash = '#/dashboard';
      }, 100);
    }
  }, [isGoogleRedirect, user, isLoading]);

  // ─── Email Sign Up ─────────────────────────────────────
  const signUp = async (email: string, password: string, userData: { fullName: string; nationality: NationalityStatus; targetDegree: DegreeLevel }) => {
    try {
      if (password.length < 8) {
        return {
          error: { code: 'auth/weak-password', message: 'Password must be at least 8 characters' } as AuthError,
          message: 'Password must be at least 8 characters'
        };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: userData.fullName });

      const profileData: Profile = {
        id: newUser.uid,
        email: newUser.email!,
        fullName: userData.fullName,
        nationality: userData.nationality,
        targetDegree: userData.targetDegree,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      };

      await setDoc(doc(db, 'profiles', newUser.uid), profileData);
      setProfile(profileData);

      return { error: null, message: 'Account created! Please verify your email.' };
    } catch (error: any) {
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
      };
      return { error: error as AuthError, message: errorMessages[error.code] || 'Failed to create account.' };
    }
  };

  // ─── Email Sign In ─────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      const errorMessages: Record<string, string> = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      };
      return { error: error as AuthError, message: errorMessages[error.code] || 'Login failed.' };
    }
  };

  // ─── Google Sign In ────────────────────────────────────
  const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    // FIX: Use IndexedDB instead of cookies for auth persistence
    // This bypasses the browser's third-party cookie blocking
    await setPersistence(auth, browserLocalPersistence);
    
    await signInWithRedirect(auth, provider);
    return { error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    const errorMessages: Record<string, string> = {
      'auth/operation-not-allowed': 'Google sign-in is not enabled. Contact support.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return { error: error as AuthError, message: errorMessages[error.code] || 'Google sign-in failed.' };
  }
};

  const resendVerification = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user, {
        url: window.location.origin + '/dashboard',
      });
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/dashboard',
      });
      return { error: null, message: 'Password reset link sent to your email.' };
    } catch (error: any) {
      return { error: error as AuthError, message: 'Failed to send reset email.' };
    }
  };

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    try {
      await setDoc(doc(db, 'profiles', user.uid), updates, { merge: true });
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      isGoogleRedirect,
      signIn,
      signUp,
      signInWithGoogle,
      signOut: signOutUser,
      resetPassword,
      updateProfile: updateUserProfile,
      resendVerification,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};