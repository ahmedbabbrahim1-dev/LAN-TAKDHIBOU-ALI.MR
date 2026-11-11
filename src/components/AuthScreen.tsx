import React, { useState } from 'react';
import { Shield, Sparkles, CheckCircle2, ArrowLeft, PhoneCall } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (phone: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.trim();
    if (!clean) {
      // Default placeholder if empty
      onLogin('+222 31 23 45 67');
      return;
    }
    if (clean.length < 8) {
      setError('يرجى كتابة رقم هاتف صحيح');
      return;
    }
    onLogin(clean.startsWith('+') ? clean : `+222 ${clean}`);
  };

  const handleQuickGuest = () => {
    onLogin('+222 45 00 00 00');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#040404]">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 items-center justify-center text-black font-black text-3xl shadow-xl shadow-emerald-500/20 mb-4 ring-2 ring-white/20">
            ح
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            الحَقّ
          </h1>
          <div className="inline-block px-3 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono tracking-widest text-emerald-400 font-bold mb-3">
            TRUTH.MR
          </div>
          <p className="text-sm text-neutral-400 max-w-xs mx-auto leading-relaxed">
            المنصة الموريتانية الأولى للتدقيق الذكي في الأخبار والشائعات ودليل صيدليات الحراسة
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#121214] border border-neutral-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">تسجيل الدخول السريع</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-2">
                رقم الهاتف (موريتانيا)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="+222 31 23 45 67"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-700/80 text-white font-mono text-base placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-1.5 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#00ff88] hover:bg-emerald-400 text-black font-black text-sm transition transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>دخول سريع للمنصة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickGuest}
              className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-bold text-xs transition cursor-pointer"
            >
              الدخول كزائر مباشرة (تخطي)
            </button>
          </form>

          {/* Feature Highlights */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>فحص فوري مدعوم بالذكاء الاصطناعي وبحث الويب الحي</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>كشف شائعات الأدوية والبيانات المفبركة على واتساب</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>خريطة صيدليات الحراسة الليلية بنواكشوط والمدن</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-neutral-600 mt-6">
          الحَقّ موريتانيا &copy; 2026 • مبادرة تقنية وطنية لمكافحة الشائعات والتضليل
        </p>
      </div>
    </div>
  );
};
