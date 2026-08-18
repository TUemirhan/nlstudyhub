import { RouterProvider, useRouter } from '@/router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { ProgramsPage } from '@/pages/ProgramsPage';
import { ProgramDetailPage } from '@/pages/ProgramDetailPage';
import { ScholarshipsPage } from '@/pages/ScholarshipsPage';
import { AboutPage } from '@/pages/AboutPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { TermsPage } from '@/pages/TermsPage';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { ProfilePage } from '@/pages/ProfilePage';
function AppContent() {
  const { route, navigate } = useRouter();
  const { user, isLoading } = useAuth();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error('Global error:', e.error);
      setError(e.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 max-w-lg">
          <h1 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-mono break-all">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-navy-900 text-white rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-dutch-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <Navbar />
      <main className="flex-1">
        {route.name === 'home' && (
          user ? <DashboardPage /> : <LandingPage />
        )}
        {route.name === 'roadmap' && <RoadmapPage />}
        {route.name === 'calculator' && <CalculatorPage />}
        {route.name === 'programs' && <ProgramsPage />}
        {route.name === 'program-detail' && <ProgramDetailPage programId={route.id} />}
        {route.name === 'scholarships' && <ScholarshipsPage />}
        {route.name === 'dashboard' && <DashboardPage />}
        {route.name === 'profile' && <ProfilePage />}
        {route.name === 'about' && <AboutPage />}
        {route.name === 'privacy' && <PrivacyPage />}
        {route.name === 'terms' && <TermsPage />}
        
        {/* Fallback for unknown routes */}
        {route.name !== 'home' && route.name !== 'roadmap' && route.name !== 'calculator' && 
         route.name !== 'programs' && route.name !== 'program-detail' && route.name !== 'scholarships' && 
         route.name !== 'dashboard' && route.name !== 'profile' && route.name !== 'about' && 
         route.name !== 'privacy' && route.name !== 'terms' && (
          <div className="container-page py-20 text-center">
            <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Page not found</h1>
            <button 
              onClick={() => navigate({ name: 'home' })} 
              className="mt-4 px-6 py-2 bg-navy-900 text-white rounded-lg"
            >
              Go Home
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </RouterProvider>
    </ThemeProvider>
  );
}