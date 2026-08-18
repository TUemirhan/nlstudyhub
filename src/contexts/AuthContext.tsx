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
  signInWithPopup,
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

  // Helper: ensure user profile exists in Firestore
  const ensureProfile = async (u: User): Promise<Profile> => {
    const profileDoc = await getDoc(doc(db, 'profiles', u.uid));
    if (profileDoc.exists()) {
      return profileDoc.data() as Profile;
    }
    const profileData: Profile = {
      id: u.uid,
      email: u.email!,
      fullName: u.displayName || 'Student',
      nationality: 'non-eu',
      targetDegree: 'master',
      createdAt: new Date().toISOString(),
      emailVerified: u.emailVerified,
      photoURL: u.photoURL || undefined,
    };
    await setDoc(doc(db, 'profiles', u.uid), profileData);
    return profileData;
  };

  // ─── Auth state listener ────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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

    return () => unsubscribe();
  }, []);

  // ─── Email Sign Up ─────────────────────────────────────
  const signUp = async (email: string, password: string, userData: { fullName: string; nationality: NationalityStatus; targetDegree: DegreeLevel }) => {
    try {
      if (password.length < 6) {
        return {
          error: { code: 'auth/weak-password', message: 'Password must be at least 6 characters' } as AuthError,
          message: 'Password must be at least 6 characters',
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
      setUser(newUser);

      return { error: null, message: 'Account created! Please verify your email.' };
    } catch (error: any) {
      console.error('Sign up error:', error.code, error.message);
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
      };
      return { error: error as AuthError, message: errorMessages[error.code] || `Failed to create account: ${error.message}` };
    }
  };

  // ─── Email Sign In ─────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error.code, error.message);
      const errorMessages: Record<string, string> = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      };
      return { error: error as AuthError, message: errorMessages[error.code] || `Login failed: ${error.message}` };
    }
  };

  // ─── Google Sign In ────────────────────────────────────
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      const p = await ensureProfile(u);
      setProfile(p);
      setUser(u);

      return { error: null };
    } catch (error: any) {
      console.error('Google sign-in error:', error.code, error.message);
      const errorMessages: Record<string, string> = {
        'auth/popup-closed-by-user': 'Sign-in cancelled.',
        'auth/popup-blocked': 'Popup blocked. Please allow popups.',
        'auth/account-exists-with-different-credential': 'Account already exists with different sign-in method.',
        'auth/unauthorized-domain': 'This domain is not authorized for Google sign-in.',
      };
      return { error: error as AuthError, message: errorMessages[error.code] || `Google sign-in failed: ${error.message}` };
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
      console.error('Reset password error:', error.code, error.message);
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