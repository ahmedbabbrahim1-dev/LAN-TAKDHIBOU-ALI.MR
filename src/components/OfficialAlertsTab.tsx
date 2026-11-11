import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  Pill,
} from 'lucide-react';
import { OFFICIAL_MAURITANIAN_ALERTS } from '../data/alerts';

export const OfficialAlertsTab: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('alert-1');

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-[#121214] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">التنبيهات الصحية والأخبار الرسمية</h2>
            <p className="text-xs text-neutral-400">
              بيانات وتحذيرات صادرة عن وزارة الصحة والجهات الرسمية بموريتانيا
            </p>
          </div>
        </div>
      </div>

      {/* Guide on spotting counterfeit medicines */}
      <div className="bg-gradient-to-br from-neutral-900 to-[#121214] border border-neutral-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-extrabold text-white">
            كيف تتأكد من سلامة الدواء في موريتانيا؟
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-neutral-800 space-y-1">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-bold text-neutral-200">الشراء من الصيدليات فقط</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              تجنب نهائياً شراء أي مستحضر من الباعة المتجولين أو محلات البقالة أو العيادات غير المرخصة.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-neutral-800 space-y-1">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-bold text-neutral-200">تاريخ الصلاحية والتغليف</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              تحقق من طباعة تاريخ الصلاحية ورقم التشغيلة (Lot) بوضوح ودون أي آثار كشط أو طمس.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-neutral-800 space-y-1">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-bold text-neutral-200">استشارة الصيدلي المناوب</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              اطلب من الصيدلي شرح طريقة الاستخدام، ولا تتناول وصفات الأعشاب المجهولة التي تروج على واتساب.
            </p>
          </div>
        </div>
      </div>

      {/* Official Alerts Accordion */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 px-1">
          سجل التنبيهات والبلاغات ({OFFICIAL_MAURITANIAN_ALERTS.length})
        </h3>

        {OFFICIAL_MAURITANIAN_ALERTS.map((alert) => {
          const isExpanded = expandedId === alert.id;

          return (
            <div
              key={alert.id}
              className="bg-[#121214] border border-neutral-800 rounded-2xl overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-right cursor-pointer hover:bg-neutral-900/60 transition"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        alert.severity === 'high'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                          : alert.severity === 'medium'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                      }`}
                    >
                      {alert.category}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      {alert.source} • {alert.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                </div>

                <div className="p-1 rounded-lg bg-neutral-900 text-neutral-400">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-5 sm:px-5 pt-1 border-t border-neutral-800/80 space-y-3 text-xs leading-relaxed">
                  <p className="text-neutral-300 bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800">
                    {alert.summary}
                  </p>
                  <p className="text-neutral-400 whitespace-pre-line px-1">
                    {alert.details}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
