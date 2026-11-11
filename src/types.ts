export type VerdictType =
  | 'صحيح ومؤكد'
  | 'مضلل أو مجتزأ'
  | 'زائف وباطل'
  | 'شائعة طبية خطيرة'
  | 'غير مؤكد ويحتاج مزيد من التحقق'
  | 'قيد التدقيق';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface FactCheckResult {
  id: string;
  claim: string;
  timestamp: number;
  verdict: string;
  score: number;
  badgeColor: 'green' | 'red' | 'yellow' | 'blue';
  oneLine: string;
  analysis: string;
  medicalAlert?: string;
  advice: string;
  mauritaniaContext?: string;
  sources: GroundingSource[];
  imageUrl?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  phoneRaw: string;
  isNightDuty: boolean;
  open24h: boolean;
  lat: number;
  lon: number;
  dutySchedule: string;
  distance?: number | null;
}

export interface EmergencyService {
  name: string;
  number: string;
  desc: string;
}

export interface OfficialAlert {
  id: string;
  title: string;
  source: string;
  date: string;
  category: 'دواء' | 'صحة عامة' | 'أخبار رسمية' | 'شائعة متداولة';
  severity: 'high' | 'medium' | 'info';
  summary: string;
  details: string;
}
