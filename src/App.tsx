import { RouterProvider, useRouter } from '@/router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { ProgramsPage } from '@/pages/ProgramsPage';
import { ProgramDetailPage } from '@/pages/ProgramDetailPage';
import { ScholarshipsPage } from '@/pages/ScholarshipsPage';
import { AboutPage } from '@/pages/AboutPage';
import { DashboardPage } from '@/pages/DashboardPage'; // Only this one
import { useEffect, useState } from 'react';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { TermsPage } from '@/pages/TermsPage';
import { ThemeProvider } from '@/contexts/ThemeContext';

function AppContent() {
  const { route } = useRouter();
  const { isLoading } = useAuth();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => setError(e.error);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-xl font-bold text-red-600">Error</h1>
          <p className="text-sm text-slate-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-dutch-500 border-t-transparent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <Navbar />
      <main className="flex-1">
        {route.name === 'home' && <HomePage />}
        {route.name === 'roadmap' && <RoadmapPage />}
        {route.name === 'calculator' && <CalculatorPage />}
        {route.name === 'programs' && <ProgramsPage />}
        {route.name === 'program-detail' && <ProgramDetailPage programId={route.id} />}
        {route.name === 'scholarships' && <ScholarshipsPage />}
        {route.name === 'dashboard' && <DashboardPage />}
        {route.name === 'profile' && <DashboardPage />} {/* Redirect old profile links */}
        {route.name === 'about' && <AboutPage />}
        {route.name === 'privacy' && <PrivacyPage />}
        {route.name === 'terms' && <TermsPage />}
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