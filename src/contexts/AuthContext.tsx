import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,        // Add this
  signInWithPopup,           // Add this
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
  signInWithGoogle: () => Promise<{ error: AuthError | null; message?: string }>;  // Add this
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null; message?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple rate limiter
const loginAttempts: Map<string, number[]> = new Map();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as Profile);
        }
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // EMAIL SIGN UP
  const signUp = async (email: string, password: string, userData: { fullName: string; nationality: NationalityStatus; targetDegree: DegreeLevel }) => {
    try {
      if (password.length < 8) {
        return { 
          error: { code: 'auth/weak-password', message: 'Password must be at least 8 characters' } as AuthError,
          message: 'Password must be at least 8 characters'
        };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: userData.fullName });

      const profileData: Profile = {
        id: user.uid,
        email: user.email!,
        fullName: userData.fullName,
        nationality: userData.nationality,
        targetDegree: userData.targetDegree,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      };

      await setDoc(doc(db, 'profiles', user.uid), profileData);
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

  // EMAIL SIGN IN
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

  // GOOGLE SIGN IN - NEW!
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user already has a profile
      const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
      
      if (!profileDoc.exists()) {
        // New user - create profile
        const profileData: Profile = {
          id: user.uid,
          email: user.email!,
          fullName: user.displayName || 'Student',
          nationality: 'non-eu', // Default, user can update later
          targetDegree: 'master', // Default, user can update later
          createdAt: new Date().toISOString(),
          emailVerified: true, // Google emails are verified
          photoURL: user.photoURL || undefined,
        };
        
        await setDoc(doc(db, 'profiles', user.uid), profileData);
        setProfile(profileData);
      } else {
        // Existing user - just set profile
        setProfile(profileDoc.data() as Profile);
      }
      
      return { error: null, message: 'Successfully signed in with Google!' };
    } catch (error: any) {
      const errorMessages: Record<string, string> = {
        'auth/popup-closed-by-user': 'Sign-in cancelled. Please try again.',
        'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site.',
        'auth/account-exists-with-different-credential': 'An account already exists with this email.',
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
      signInWithGoogle,  // Add to provider
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