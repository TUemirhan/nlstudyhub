import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy-900 text-white p-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <Download className="h-5 w-5" />
        <div>
          <p className="font-bold text-sm">Add NLStudyHub to Home Screen</p>
          <p className="text-xs text-slate-300">Get deadline alerts and offline access</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleInstall} className="px-4 py-2 bg-dutch-500 rounded-lg text-sm font-bold">
          Install
        </button>
        <button onClick={() => setShow(false)} className="p-2">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}