import React from 'react';
import { X, Trash2, Clock, CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { FactCheckResult } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: FactCheckResult[];
  onSelectResult: (result: FactCheckResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#121214] h-full border-r border-neutral-800 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">سجل الفحوصات والتحقيقات</h3>
            <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded-full text-neutral-400 font-mono">
              {history.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Previous Checks */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs">
              لا توجد عمليات فحص سابقة حتى الآن.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor === 'green'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : item.badgeColor === 'red'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {item.verdict}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString('ar-MR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs font-semibold text-white line-clamp-2 leading-relaxed">
                  {item.claim}
                </p>

                <p className="text-[11px] text-neutral-400 line-clamp-1">
                  💡 {item.oneLine}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="p-4 border-t border-neutral-800">
            <button
              onClick={onClearHistory}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-red-950/40 border border-neutral-800 hover:border-red-900/40 text-neutral-400 hover:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح السجل بالكامل</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
