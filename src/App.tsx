import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { FactChecker } from './components/FactChecker';
import { PharmacyDirectory } from './components/PharmacyDirectory';
import { OfficialAlertsTab } from './components/OfficialAlertsTab';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FactCheckResult } from './types';
import { Newspaper, MapPin, ShieldAlert } from 'lucide-react';

export default function App() {
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'news' | 'pharmacy' | 'alerts'>('news');
  const [history, setHistory] = useState<FactCheckResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load user session and history on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('truth_user');
    if (savedUser) {
      setUserPhone(savedUser);
    }

    try {
      const savedHistory = localStorage.getItem('truth_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to parse history', e);
    }
  }, []);

  const handleLogin = (phone: string) => {
    localStorage.setItem('truth_user', phone);
    setUserPhone(phone);
  };

  const handleLogout = () => {
    localStorage.removeItem('truth_user');
    setUserPhone(null);
  };

  const handleSaveResult = (newResult: FactCheckResult) => {
    setHistory((prev) => {
      const updated = [newResult, ...prev.filter((item) => item.id !== newResult.id)].slice(0, 30);
      localStorage.setItem('truth_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem('truth_history');
    setHistory([]);
  };

  if (!userPhone) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        userPhone={userPhone}
        onLogout={handleLogout}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 pb-24">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#121214] border border-neutral-800 rounded-2xl mb-6 shadow-md">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'news'
                ? 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>📰 فحص الأخبار</span>
          </button>

          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'pharmacy'
                ? 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>📍 صيدليات الحراسة</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>🛡️ تنبيهات رسمية</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'news' && (
          <FactChecker onSaveResult={handleSaveResult} />
        )}

        {activeTab === 'pharmacy' && (
          <PharmacyDirectory />
        )}

        {activeTab === 'alerts' && (
          <OfficialAlertsTab />
        )}
      </main>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => {
          setActiveTab('news');
        }}
        onClearHistory={handleClearHistory}
      />

      {/* Mobile Sticky Quick Switcher */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800/80 p-2 sm:hidden z-30">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold ${
              activeTab === 'news' ? 'text-emerald-400' : 'text-neutral-500'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>فحص الأخبار</span>
          </button>

          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold ${
              activeTab === 'pharmacy' ? 'text-emerald-400' : 'text-neutral-500'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>صيدليات الحراسة</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold ${
              activeTab === 'alerts' ? 'text-emerald-400' : 'text-neutral-500'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>التنبيهات</span>
          </button>
        </div>
      </div>
    </div>
  );
}
