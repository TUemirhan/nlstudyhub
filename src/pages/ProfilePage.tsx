import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Globe, GraduationCap, LogOut } from 'lucide-react';
import { useRouter } from '@/router';

export function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const { navigate } = useRouter();

  const handleSignOut = async () => {
    await signOut();
    navigate({ name: 'home' });
  };

  if (!user) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold text-navy-900">Please sign in</h1>
        <p className="mt-2 text-slate-600">You need to be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <section className="bg-navy-950 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="mt-2 text-slate-300">Manage your preferences and saved items</p>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="mx-auto max-w-3xl">
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-dutch-100 flex items-center justify-center text-dutch-600">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900">{profile?.fullName || 'Student'}</h2>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {user.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Status
                </p>
                <p className="mt-1 font-medium text-navy-900">
                  {profile?.nationality === 'eu' ? 'EU/EEA Citizen' : 'Non-EU/EEA Citizen'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> Target Degree
                </p>
                <p className="mt-1 font-medium text-navy-900 capitalize">
                  {profile?.targetDegree}'s Degree
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-navy-900 mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => navigate({ name: 'roadmap' })}
                  className="px-4 py-2 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800"
                >
                  View My Roadmap
                </button>
                <button 
                  onClick={() => navigate({ name: 'calculator' })}
                  className="px-4 py-2 bg-white border border-slate-200 text-navy-900 text-sm font-medium rounded-lg hover:bg-slate-50"
                >
                  Cost Calculator
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-red-600 text-sm font-medium hover:text-red-700"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}