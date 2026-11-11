import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Compass,
  Navigation,
  ExternalLink,
  ShieldAlert,
  PhoneCall,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { Pharmacy, EmergencyService } from '../types';
import { PharmacyMap } from './PharmacyMap';

export const PharmacyDirectory: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [nightOnly, setNightOnly] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  const fetchPharmacies = async (lat?: number, lon?: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (lat && lon) {
        params.append('lat', lat.toString());
        params.append('lon', lon.toString());
      }
      if (selectedDistrict !== 'all') {
        params.append('district', selectedDistrict);
      }
      if (nightOnly) {
        params.append('nightOnly', 'true');
      }

      const res = await fetch(`/api/pharmacies?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPharmacies(data.pharmacies);
        setEmergencyServices(data.emergencyServices || []);
      }
    } catch (err) {
      console.error('Failed to load pharmacies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies(userLocation?.lat, userLocation?.lon);
  }, [selectedDistrict, nightOnly]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('خاصية تحديد الموقع غير مدعومة في متصفحك.');
      return;
    }

    setLocating(true);
    setLocationStatus('📡 جاري الاتصال بالقمر الصناعي وتحديد موقعك الفعلي...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        setLocating(false);
        setLocationStatus(' تم تحديد موقعك بنجاح! تم ترتيب الصيدليات حسب الأقرب إليك.');
        fetchPharmacies(latitude, longitude);
      },
      (error) => {
        setLocating(false);
        let msg = 'يرجى تفعيل الـ GPS في هاتفك لتحديد موقعك بنجاح.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'تم رفض إذن تحديد الموقع. يمكنك تصفح القائمة يدوياً.';
        }
        setLocationStatus(msg);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const districts = [
    { id: 'all', label: 'كل المقاطعات' },
    { id: 'تفرغ زينة', label: 'تفرغ زينة' },
    { id: 'لكصر', label: 'لكصر' },
    { id: 'عرفات', label: 'عرفات' },
    { id: 'السبخة', label: 'السبخة' },
    { id: 'دار النعيم', label: 'دار النعيم' },
    { id: 'توجنين', label: 'توجنين' },
    { id: 'نواذيبو', label: 'نواذيبو' },
    { id: 'روصو', label: 'روصو' },
  ];

  const filteredList = pharmacies.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* GPS & Hero Header */}
      <div className="bg-[#121214] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <MapPin className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white">دليل صيدليات الحراسة الليلية</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              صيدليات المناوبة (Pharmacies de garde) المعتمدة في نواكشوط والمدن الرئيسية مفتوحة 24/24.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGetLocation}
            disabled={locating}
            className="py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shrink-0 shadow-lg"
          >
            <Compass className={`w-4 h-4 text-emerald-400 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'جاري تحديد موقعك...' : 'حدد موقعي على الخريطة'}</span>
          </button>
        </div>

        {locationStatus && (
          <div className="mt-4 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>{locationStatus}</span>
          </div>
        )}
      </div>

      {/* Interactive Map */}
      <PharmacyMap
        pharmacies={filteredList}
        userLocation={userLocation}
        selectedPharmacy={selectedPharmacy}
        onSelectPharmacy={(p) => setSelectedPharmacy(p)}
      />

      {/* Filters & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الصيدلية، الشارع، أو المقاطعة..."
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-[#121214] border border-neutral-800 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setNightOnly(!nightOnly)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              nightOnly
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
          >
            <span>🌙 صيدليات الحراسة الليلية فقط</span>
          </button>
        </div>

        {/* District Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {districts.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDistrict(d.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                selectedDistrict === d.id
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pharmacies List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-neutral-400">
            الصيدليات المتاحة ({filteredList.length})
          </h3>
          {userLocation && (
            <span className="text-[11px] text-emerald-400 font-medium">
              مرتبة حسب الأقرب إلى إحداثياتك
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-neutral-500 text-xs">
            جاري تحميل بيانات الصيدليات...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-10 bg-[#121214] border border-neutral-800 rounded-3xl p-6 text-neutral-400 text-xs">
            لم يتم العثور على صيدليات مطابقة لبحثك في هذه المقاطعة.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredList.map((pharmacy) => {
              const isSelected = selectedPharmacy?.id === pharmacy.id;

              return (
                <div
                  key={pharmacy.id}
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  className={`bg-[#121214] border rounded-2xl p-4 sm:p-5 transition cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-neutral-900/90 ring-1 ring-emerald-500/30'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-extrabold text-white">
                          {pharmacy.name}
                        </h4>
                        {pharmacy.isNightDuty && (
                          <span className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>🌙 حراسة ليلية</span>
                          </span>
                        )}
                        {pharmacy.distance !== null && pharmacy.distance !== undefined && (
                          <span className="bg-neutral-800 text-emerald-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md">
                            يبعد {pharmacy.distance} كم
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{pharmacy.district} • {pharmacy.address}</span>
                      </p>

                      <p className="text-[11px] text-neutral-500 flex items-center gap-1 pt-0.5">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{pharmacy.dutySchedule}</span>
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0">
                      <a
                        href={`tel:${pharmacy.phoneRaw}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-[#00ff88] hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>اتصال بالصيدلية</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs flex items-center gap-1 transition"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">مسار الخريطة</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Emergency Hotlines Mauritania */}
      <div className="bg-[#121214] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <h3 className="text-xs font-bold text-white">أرقام الطوارئ والإسعاف الوطنية (موريتانيا)</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {emergencyServices.map((srv, idx) => (
            <a
              key={idx}
              href={`tel:${srv.number.replace(/\s+/g, '')}`}
              className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-bold text-neutral-200">{srv.name}</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">{srv.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/80">
                <span className="text-sm font-mono font-black text-emerald-400" dir="ltr">
                  {srv.number}
                </span>
                <PhoneCall className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
