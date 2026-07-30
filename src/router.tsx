import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'roadmap' }
  | { name: 'dashboard' }
  | { name: 'calculator' }
  | { name: 'programs' }
  | { name: 'program-detail'; id: string }
  | { name: 'scholarships' }
  | { name: 'profile' }
  | { name: 'about' }
  | { name: 'privacy' }
  | { name: 'terms' };

interface RouterContextValue {
  route: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/');
  
  switch (parts[0]) {
    case '':
    case 'home':
      return { name: 'home' };
    case 'roadmap':
      return { name: 'roadmap' };
    case 'calculator':
      return { name: 'calculator' };
    case 'dashboard':
      return { name: 'dashboard' };
    case 'programs':
      if (parts[1]) return { name: 'program-detail', id: parts[1] };
      return { name: 'programs' };
    case 'scholarships':
      return { name: 'scholarships' };
    case 'profile':
      return { name: 'profile' };
    case 'about':
      return { name: 'about' };
    case 'privacy':
      return { name: 'privacy' };
    case 'terms':
      return { name: 'terms' };
    default:
      return { name: 'home' }; // Fixed: ensure always returns Route
  }
}

function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'roadmap':
      return '#/roadmap';
    case 'calculator':
      return '#/calculator';
    case 'dashboard':
      return '#/dashboard';
    case 'programs':
      return '#/programs';
    case 'program-detail':
      return `#/programs/${route.id}`;
    case 'scholarships':
      return '#/scholarships';
    case 'profile':
      return '#/profile';
    case 'about':
      return '#/about';
    case 'privacy':
      return '#/privacy';
    case 'terms':
      return '#/terms';
    default:
      return '#/'; // Fixed: exhaustive check ensures all cases handled
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const handler = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (next: Route) => {
    window.location.hash = routeToHash(next);
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}