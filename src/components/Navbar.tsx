import React from 'react';
import { ShieldCheck, LogOut, Phone, History, Sparkles } from 'lucide-react';

interface NavbarProps {
  userPhone: string | null;
  onLogout: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  userPhone,
  onLogout,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            ح
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-white">الحَقّ</h1>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                TRUTH.MR
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              منصة تدقيق الحقائق وصيدليات الحراسة
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {historyCount > 0 && (
            <button
              onClick={onOpenHistory}
              title="سجل الفحوصات"
              className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition"
            >
              <History className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {historyCount}
              </span>
            </button>
          )}

          {userPhone ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-full text-xs text-neutral-300">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span dir="ltr" className="font-mono">{userPhone}</span>
              </div>
              <button
                onClick={onLogout}
                title="تسجيل الخروج"
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-900/50 transition flex items-center gap-1 text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full text-[11px] text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>مباشر</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
