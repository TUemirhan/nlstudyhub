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

  // ─── Handle Google redirect result on page load ─────────
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const u = result.user;
          const profileDoc = await getDoc(doc(db, 'profiles', u.uid));

          if (!profileDoc.exists()) {
            const profileData: Profile = {
              id: u.uid,
              email: u.email!,
              fullName: u.displayName || 'Student',
              nationality: 'non-eu',
              targetDegree: 'master',
              createdAt: new Date().toISOString(),
              emailVerified: true,
              photoURL: u.photoURL || undefined,
            };
            await setDoc(doc(db, 'profiles', u.uid), profileData);
            setProfile(profileData);
          } else {
            setProfile(profileDoc.data() as Profile);
          }
        }
      } catch (err: any) {
        console.error('Redirect result error:', err.code, err.message);
      }
    };

    handleRedirectResult();
  }, []);

  // ─── Listen for auth state changes ─────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
          if (profileDoc.exists()) {
            setProfile(profileDoc.data() as Profile);
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  // ─── Google Sign In (FIXED: redirect instead of popup) ─
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });

      // This redirects the entire page to Google
      // The result is handled by getRedirectResult() in useEffect above
      await signInWithRedirect(auth, provider);

      // Page will navigate away — this return won't be reached
      // unless the redirect fails immediately
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