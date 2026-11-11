import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Pharmacy } from '../types';

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  userLocation: { lat: number; lon: number } | null;
  selectedPharmacy: Pharmacy | null;
  onSelectPharmacy: (p: Pharmacy) => void;
}

export const PharmacyMap: React.FC<PharmacyMapProps> = ({
  pharmacies,
  userLocation,
  selectedPharmacy,
  onSelectPharmacy,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center: Nouakchott (Capital of Mauritania)
    const initialLat = userLocation ? userLocation.lat : 18.0865;
    const initialLon = userLocation ? userLocation.lon : -15.9654;
    const initialZoom = userLocation ? 13 : 12;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: initialZoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when pharmacies or userLocation change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Custom icon generator
    const createCustomIcon = (isNight: boolean, isSelected: boolean) => {
      const bgColor = isNight ? '#00ff88' : '#38bdf8';
      const textColor = '#000000';
      const border = isSelected ? '3px solid #ffffff' : '2px solid #000000';
      const scale = isSelected ? 'scale(1.2)' : 'scale(1)';

      return L.divIcon({
        className: 'custom-pharmacy-pin',
        html: `
          <div style="
            background: ${bgColor};
            color: ${textColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 16px;
            border: ${border};
            transform: ${scale};
            box-shadow: 0 4px 14px rgba(0,0,0,0.5);
            transition: all 0.2s ease;
          ">
            ${isNight ? '🌙' : '💊'}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });
    };

    // Add user marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="
            background: #ef4444;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 12px #ef4444;
            animation: pulse-glow 2s infinite;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
        .bindPopup('<b style="color:#ef4444;">📍 موقعك الحالي</b>')
        .addTo(markersGroup);
    }

    // Add pharmacy markers
    pharmacies.forEach((p) => {
      const isSelected = selectedPharmacy?.id === p.id;
      const marker = L.marker([p.lat, p.lon], {
        icon: createCustomIcon(p.isNightDuty, isSelected),
      });

      const popupHtml = `
        <div style="min-width: 190px; text-align: right; direction: rtl; font-family: 'Tajawal', sans-serif;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #fff;">${p.name}</h4>
          <p style="margin: 0 0 4px 0; font-size: 11px; color: #9ca3af;">📍 ${p.address}</p>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; background: ${p.isNightDuty ? '#059669' : '#374151'}; color: #fff; margin-bottom: 8px;">
            ${p.isNightDuty ? '🌙 صيدلية حراسة ليلية (24/24)' : '☀️ دوام اعتيادي'}
          </div>
          ${p.distance !== null && p.distance !== undefined ? `<p style="margin: 0 0 8px 0; font-size: 11px; color: #10b981; font-weight: 700;">المسافة: حوالي ${p.distance} كم</p>` : ''}
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <a href="tel:${p.phoneRaw}" style="flex: 1; text-align: center; background: #00ff88; color: #000; text-decoration: none; padding: 6px 10px; border-radius: 8px; font-weight: 800; font-size: 11px; display: block;">
              📞 اتصال
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #27272a; color: #fff; text-decoration: none; padding: 6px 10px; border-radius: 8px; font-weight: 700; font-size: 11px; display: block;">
              🗺️ الملاحة
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        onSelectPharmacy(p);
      });

      marker.addTo(markersGroup);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [pharmacies, userLocation, selectedPharmacy, onSelectPharmacy]);

  // Center map on selected pharmacy or user
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedPharmacy) {
      map.setView([selectedPharmacy.lat, selectedPharmacy.lon], 15, {
        animate: true,
      });
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lon], 13, {
        animate: true,
      });
    }
  }, [selectedPharmacy, userLocation]);

  return (
    <div className="relative w-full h-72 sm:h-84 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-950">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800 text-[11px] font-semibold text-neutral-300 shadow-md">
        <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse"></span>
        <span>أخضر: صيدلية حراسة 24/24</span>
      </div>
    </div>
  );
};
