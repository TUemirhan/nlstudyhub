import { useState } from 'react';
import { User, Save, Mail, GraduationCap, Globe, ArrowLeft, Shield, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@/router';

export function ProfilePage() {
  const { user, profile, isLoading, updateProfile } = useAuth();
  const { navigate } = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: profile?.fullName || '',
    nationality: profile?.nationality || 'non-eu',
    targetDegree: profile?.targetDegree || 'master',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 dark:text-slate-500">Loading profile...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white">Not signed in</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const result = await updateProfile({
      fullName: form.fullName,
      nationality: form.nationality as 'eu' | 'non-eu',
      targetDegree: form.targetDegree as 'bachelor' | 'master',
    });
    if (result.error) {
      setMessage('Failed to save changes.');
    } else {
      setMessage('Profile updated successfully.');
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <section className="bg-navy-950 border-b border-slate-800 py-12">
        <div className="container-page">
          <button
            onClick={() => navigate({ name: 'dashboard' })}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-dutch-500 to-amber-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-xl shadow-dutch-500/20">
              {profile.fullName?.[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Profile</h1>
              <p className="text-slate-400 mt-1">Manage your account information and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page py-10 max-w-2xl mx-auto">
        <div className="grid gap-6">
          {/* Account Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-extrabold text-navy-900 dark:text-white">Account Details</h2>
            </div>

            <div className="space-y-5">
              {/* Email (read-only) */}
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email</label>
                <div className="flex items-center gap-2 mt-1.5 text-slate-900 dark:text-white font-medium">
                  <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  {user.email}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Managed by Google / Firebase Authentication.</p>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  disabled={!editing}
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dutch-500/40
                    ${editing ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-navy-900 dark:text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-default'}
                  `}
                />
              </div>

              {/* Nationality */}
              <div>
                <label htmlFor="nationality" className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nationality Status</label>
                <select
                  id="nationality"
                  disabled={!editing}
                  value={form.nationality}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value as 'eu' | 'non-eu' })}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dutch-500/40
                    ${editing ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-navy-900 dark:text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-default'}
                  `}
                >
                  <option value="eu">EU / EEA</option>
                  <option value="non-eu">Non-EU</option>
                </select>
              </div>

              {/* Target Degree */}
              <div>
                <label htmlFor="targetDegree" className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Target Degree</label>
                <select
                  id="targetDegree"
                  disabled={!editing}
                  value={form.targetDegree}
                  onChange={(e) => setForm({ ...form, targetDegree: e.target.value as 'bachelor' | 'master' })}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-dutch-500/40
                    ${editing ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-navy-900 dark:text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-default'}
                  `}
                >
                  <option value="bachelor">Bachelor's</option>
                  <option value="master">Master's</option>
                </select>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-semibold ${message.includes('Failed') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'}`}>
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              {editing ? (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        fullName: profile.fullName,
                        nationality: profile.nationality,
                        targetDegree: profile.targetDegree,
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl text-sm font-extrabold text-white bg-navy-900 dark:bg-white dark:text-navy-900 hover:bg-navy-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-navy-900/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-extrabold text-white bg-dutch-500 hover:bg-dutch-600 transition-all shadow-lg shadow-dutch-500/25 flex items-center gap-2"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <Lock className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-amber-900 dark:text-amber-200">Security Note</h3>
              <p className="text-sm text-amber-800/80 dark:text-amber-200/80 mt-1 leading-relaxed">
                Your password is managed securely by Firebase Authentication and is never stored in our database. If you need to change it, use the "Forgot Password" option on the sign-in screen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}