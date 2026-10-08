import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification } = useApp();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100',
    error: 'border-rose-500/40 bg-rose-950/90 text-rose-100',
    info: 'border-cyan-500/40 bg-cyan-950/90 text-cyan-100',
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in max-w-md w-[90%] pointer-events-none">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${borders[notification.type]}`}>
        {icons[notification.type]}
        <div className="text-sm font-semibold">{notification.message}</div>
      </div>
    </div>
  );
};
