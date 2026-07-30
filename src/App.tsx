import { RouterProvider } from '@/router';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { ProgramsPage } from '@/pages/ProgramsPage';
import { ProgramDetailPage } from '@/pages/ProgramDetailPage';
import { ScholarshipsPage } from '@/pages/ScholarshipsPage';
import { AboutPage } from '@/pages/AboutPage';
import { useRouter } from '@/router';

function AppContent() {
  const { route } = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {route.name === 'home' && <HomePage />}
        {route.name === 'roadmap' && <RoadmapPage />}
        {route.name === 'calculator' && <CalculatorPage />}
        {route.name === 'programs' && <ProgramsPage />}
        {route.name === 'program-detail' && <ProgramDetailPage id={route.id} />}
        {route.name === 'scholarships' && <ScholarshipsPage />}
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
    <RouterProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RouterProvider>
  );
}