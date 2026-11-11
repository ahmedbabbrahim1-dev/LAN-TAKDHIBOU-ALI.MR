import React, { useState, useRef } from 'react';
import {
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Share2,
  Copy,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  X,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  FileText,
  Radio,
} from 'lucide-react';
import { FactCheckResult, GroundingSource } from '../types';
import { PRESET_TRENDING_CLAIMS } from '../data/alerts';

interface FactCheckerProps {
  onSaveResult: (result: FactCheckResult) => void;
}

export const FactChecker: React.FC<FactCheckerProps> = ({ onSaveResult }) => {
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingSteps = [
    'جاري الاتصال بمحرك التحقق الذكي...',
    'تحليل نص الادعاء واستخراج الكلمات المفتاحية...',
    'مقارنة الادعاء مع قواعد البيانات المعتمدة والبحث الحي...',
    'تقييم الأدلة الطبية والرسمية وصياغة الحكم النهائي...',
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePresetClick = (claim: string) => {
    setInputText(claim);
    setResult(null);
    setError(null);
  };

  const runFactCheck = async (textToSubmit?: string) => {
    const textQuery = textToSubmit !== undefined ? textToSubmit : inputText;

    if (!textQuery.trim() && !imagePreview) {
      setError('يرجى كتابة نص أو إرفاق صورة للبدء في الفحص');
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch('/api/fact-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textQuery.trim(),
          imageBase64: imagePreview || undefined,
          mimeType: imageFile?.type || 'image/jpeg',
        }),
      });

      clearInterval(stepInterval);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'فشل الفحص');
      }

      const resData = data.data;
      const formattedResult: FactCheckResult = {
        id: 'chk-' + Date.now(),
        claim: textQuery.trim() || 'فحص صورة/لقطة شاشة مرفقة',
        timestamp: Date.now(),
        verdict: resData.verdict,
        score: resData.score,
        badgeColor: resData.badgeColor,
        oneLine: resData.oneLine,
        analysis: resData.analysis,
        medicalAlert: resData.medicalAlert,
        advice: resData.advice,
        mauritaniaContext: resData.mauritaniaContext,
        sources: resData.sources || [],
        imageUrl: imagePreview || undefined,
      };

      setResult(formattedResult);
      onSaveResult(formattedResult);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      setError(
        err.message ||
          'تعذر إتمام الفحص. يرجى التحقق من اتصال الإنترنت والمحاولة مجدداً.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `🔍 *تقرير فحص حقيقة - منصة الحق (TRUTH.MR)*
📌 *الادعاء:* ${result.claim}
⚖️ *الحكم:* ${result.verdict} (مؤشر الدقة: ${result.score}%)
💡 *الخلاصة:* ${result.oneLine}
📝 *التحليل:* ${result.analysis.slice(0, 300)}...
👉 *النصيحة:* ${result.advice}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!result) return;
    const text = `🔍 *فحص عبر منصة الحق - TRUTH.MR* 🇲🇷
📌 *الادعاء المتداول:*
"${result.claim}"

⚖️ *النتيجة الرسمية:* ${result.verdict}
💡 *الخلاصة السريعة:* ${result.oneLine}
⚠️ *توجيه للمواطن:* ${result.advice}

تحقق من الشائعات دائماً وتوقف عن نشر الأخبار غير الموثوقة!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const getVerdictStyle = (verdict: string, color: string) => {
    if (color === 'green' || verdict.includes('صحيح')) {
      return {
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/50',
        text: 'text-emerald-400',
        bar: 'bg-emerald-500',
        icon: CheckCircle,
      };
    }
    if (color === 'red' || verdict.includes('زائف') || verdict.includes('خطيرة')) {
      return {
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/50',
        text: 'text-rose-400',
        bar: 'bg-rose-500',
        icon: XCircle,
      };
    }
    return {
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      bar: 'bg-amber-500',
      icon: HelpCircle,
    };
  };

  return (
    <div className="space-y-6">
      {/* Search & Input Box */}
      <div className="bg-[#121214] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">فحص الأخبار والشائعات الذكي</h2>
              <p className="text-xs text-neutral-400">الصق نصاً، رسالة واتساب، أو صورة لبيان رسمي أو علبة دواء</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            {inputText.length} حرف
          </span>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (error) setError(null);
            }}
            placeholder="مثال: الصق خبراً متداولاً، مثل: هل عصير الليمون والزنجبيل يعالج فيروس كورونا؟ أو هل تم تأجيل البكالوريا بموريتانيا؟"
            rows={4}
            className="w-full p-4 rounded-2xl bg-[#09090b] border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base leading-relaxed resize-none transition"
          />

          {/* Image Preview if uploaded */}
          {imagePreview && (
            <div className="relative rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-900 p-2 flex items-center gap-3">
              <img
                src={imagePreview}
                alt="معاينة الصورة"
                className="w-16 h-16 object-cover rounded-xl border border-neutral-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-200 truncate">
                  {imageFile?.name || 'صورة مرفقة للفحص'}
                </p>
                <p className="text-[11px] text-emerald-400">
                  سيتم قراءة النص وتحليله بالذكاء الاصطناعي
                </p>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Row: Image upload button & Submit */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>إرفاق صورة / لقطة شاشة</span>
            </button>

            <button
              type="button"
              disabled={loading || (!inputText.trim() && !imagePreview)}
              onClick={() => runFactCheck()}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#00ff88] hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-[#00ff88] text-black font-black text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري الفحص المباشر...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تحقق الآن عبر الذكاء الاصطناعي</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3.5 rounded-2xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Preset Trending Claims Chips */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80">
          <p className="text-[11px] font-bold text-neutral-400 mb-2 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400" />
            أمثلة لشائعات وأخبار متداولة بموريتانيا للتدقيق السريع:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_TRENDING_CLAIMS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handlePresetClick(item.label);
                  runFactCheck(item.label);
                }}
                className="text-xs bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-full transition text-right cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Steps Card */}
      {loading && (
        <div className="bg-[#121214] border border-neutral-800 rounded-3xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              جاري فحص الحقيقة والتدقيق...
            </h3>
            <p className="text-xs text-emerald-400 font-medium">
              {loadingSteps[loadingStep]}
            </p>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Verdict Result Card */}
      {result && !loading && (
        <div className="bg-[#141417] border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Header & Verdict Badge */}
          {(() => {
            const style = getVerdictStyle(result.verdict, result.badgeColor);
            const Icon = style.icon;

            return (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-neutral-400">
                      نتيجة فحص الذكاء الاصطناعي
                    </span>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border ${style.bg} ${style.border} ${style.text} font-black text-sm shadow-md`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{result.verdict}</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="bg-neutral-900/90 border border-neutral-800/80 p-3.5 rounded-2xl">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-neutral-400 font-medium">مؤشر المصداقية والموثوقية</span>
                    <span className={`font-mono font-bold ${style.text}`}>
                      {result.score}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${style.bar} transition-all duration-1000`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>

                {/* One line summary */}
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-white font-bold text-base leading-relaxed">
                  💡 {result.oneLine}
                </div>
              </div>
            );
          })()}

          {/* Medical Alert Callout (if any) */}
          {result.medicalAlert &&
            !result.medicalAlert.includes('لا يوجد خطر') && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60 space-y-1 text-rose-200">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>تنبيه صحي ودوائي مهم للمواطنين</span>
                </div>
                <p className="text-xs leading-relaxed text-rose-200/90">
                  {result.medicalAlert}
                </p>
              </div>
            )}

          {/* Analysis details */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              التحليل المفصل والأدلة الموثقة:
            </h4>
            <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 text-neutral-200 text-sm leading-relaxed whitespace-pre-line">
              {result.analysis}
            </div>
          </div>

          {/* Mauritania context if present */}
          {result.mauritaniaContext && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-200 leading-relaxed">
              <span className="font-bold block text-emerald-400 mb-1">🇲🇷 السياق المحلي الموريتاني:</span>
              {result.mauritaniaContext}
            </div>
          )}

          {/* Advice / Recommendation */}
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <span className="font-bold text-white block mb-1">🛡️ نصيحة وتوجيه:</span>
            {result.advice}
          </div>

          {/* Live Grounding Sources from Google Search */}
          {result.sources && result.sources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-400">المصادر والمراجع الرسمية:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-emerald-400 transition text-xs"
                  >
                    <span className="truncate max-w-[200px]">{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Share Actions */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة النتيجة في مجموعات الواتساب</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ التقرير</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
