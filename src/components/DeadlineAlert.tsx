import { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react'; // Removed AlertCircle
import { getRelevantDeadlines, getDaysUntil } from '@/data/deadlines'; // Removed getUrgencyColor
import { useAuth } from '@/contexts/AuthContext';

export function DeadlineAlert() {
  const { profile } = useAuth(); // Removed 'user' from destructuring
  const [showAlert, setShowAlert] = useState(true);
  const [upcoming, setUpcoming] = useState<any[]>([]);

  useEffect(() => {
    if (!profile) return;
    
    // Get real deadlines based on user profile
    const deadlines = getRelevantDeadlines(
      profile.nationality,
      profile.targetDegree,
      'sept-2025' // This would come from roadmap
    ).slice(0, 2); // Show top 2 most urgent
    
    setUpcoming(deadlines);
  }, [profile]);

  if (!showAlert || upcoming.length === 0) return null;

  const mostUrgent = upcoming[0];
  const daysLeft = getDaysUntil(mostUrgent.date);

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm w-full rounded-xl shadow-2xl border-l-4 z-50 animate-slide-up ${
      daysLeft < 7 ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${daysLeft < 7 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className={`font-bold text-sm ${daysLeft < 7 ? 'text-red-900' : 'text-amber-900'}`}>
                {mostUrgent.title}
              </h4>
              <p className={`text-xs mt-1 ${daysLeft < 7 ? 'text-red-700' : 'text-amber-700'}`}>
                {daysLeft <= 0 ? 'DUE TODAY!' : `${daysLeft} days remaining`}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowAlert(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-3 flex gap-2">
          <a 
            href={mostUrgent.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 text-center text-xs py-2 rounded-lg font-medium ${
              daysLeft < 7 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            Take Action
          </a>
          <button 
            onClick={() => {/* Snooze for 24h */}}
            className="px-3 py-2 text-xs text-slate-600 hover:bg-black/5 rounded-lg"
          >
            Snooze
          </button>
        </div>
      </div>
    </div>
  );
}