import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  type User,
  type AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
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
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; message?: string }>;
  signUp: (email: string, password: string, userData: { fullName: string; nationality: NationalityStatus; targetDegree: DegreeLevel }) => Promise<{ error: AuthError | null; message?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null; message?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple rate limiter (resets on page refresh, for persistent use localStorage)
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

  // Rate limiting check
  const checkRateLimit = (email: string): boolean => {
    const now = Date.now();
    const attempts = loginAttempts.get(email) || [];
    
    // Keep only last 5 minutes
    const recentAttempts = attempts.filter(time => now - time < 5 * 60 * 1000);
    
    if (recentAttempts.length >= 5) {
      return false; // Too many attempts
    }
    
    recentAttempts.push(now);
    loginAttempts.set(email, recentAttempts);
    return true;
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: { fullName: string; nationality: NationalityStatus; targetDegree: DegreeLevel }
  ) => {
    try {
      // 1. Validate password strength
      if (password.length < 8) {
        return { 
          error: { code: 'auth/weak-password', message: 'Password must be at least 8 characters' } as AuthError,
          message: 'Password must be at least 8 characters'
        };
      }

      // 2. Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Send verification email immediately
      await sendEmailVerification(user, {
        url: window.location.origin + '/dashboard', // Redirect after verification
        handleCodeInApp: true,
      });

      // 4. Update display name
      await updateProfile(user, { displayName: userData.fullName });

      // 5. Create profile in Firestore
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
      
      return { 
        error: null, 
        message: 'Account created! Please check your email to verify your account.' 
      };
    } catch (error: any) {
      // Map Firebase errors to friendly messages
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
      };
      
      return { 
        error: error as AuthError,
        message: errorMessages[error.code] || 'Failed to create account. Please try again.'
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Check rate limiting
    if (!checkRateLimit(email)) {
      return {
        error: { code: 'auth/too-many-requests', message: 'Too many attempts. Try again in 5 minutes.' } as AuthError,
        message: 'Too many failed attempts. Please try again in 5 minutes.'
      };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      const errorMessages: Record<string, string> = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
        'auth/user-disabled': 'This account has been disabled.',
      };
      
      return { 
        error: error as AuthError,
        message: errorMessages[error.code] || 'Login failed. Please check your credentials.'
      };
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
      return { 
        error: null,
        message: 'Password reset link sent to your email.'
      };
    } catch (error: any) {
      const errorMessages: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      
      return { 
        error: error as AuthError,
        message: errorMessages[error.code] || 'Failed to send reset email.'
      };
    }
  };

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      await updateDoc(doc(db, 'profiles', user.uid), updates);
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