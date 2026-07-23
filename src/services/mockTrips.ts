import type { Trip } from '@/types/vehicle';

export const MOCK_TRIPS: Trip[] = [
  { id: 'T001', date: '2025-01-15', startTime: '07:42', endTime: '09:18', distance: 23.4, energyUsed: 0.98, costEstimate: 11.76, avgSpeed: 24, efficiency: 41.9 },
  { id: 'T002', date: '2025-01-15', startTime: '14:05', endTime: '15:33', distance: 31.2, energyUsed: 1.33, costEstimate: 15.96, avgSpeed: 22, efficiency: 42.6 },
  { id: 'T003', date: '2025-01-16', startTime: '08:15', endTime: '10:04', distance: 28.8, energyUsed: 1.22, costEstimate: 14.64, avgSpeed: 23, efficiency: 42.4 },
  { id: 'T004', date: '2025-01-16', startTime: '17:30', endTime: '18:45', distance: 19.1, energyUsed: 0.81, costEstimate: 9.72, avgSpeed: 25, efficiency: 42.4 },
  { id: 'T005', date: '2025-01-17', startTime: '06:55', endTime: '08:20', distance: 26.5, energyUsed: 1.12, costEstimate: 13.44, avgSpeed: 24, efficiency: 42.3 },
  { id: 'T006', date: '2025-01-17', startTime: '13:10', endTime: '14:55', distance: 34.7, energyUsed: 1.47, costEstimate: 17.64, avgSpeed: 22, efficiency: 42.4 },
  { id: 'T007', date: '2025-01-18', startTime: '09:00', endTime: '10:30', distance: 22.0, energyUsed: 0.93, costEstimate: 11.16, avgSpeed: 23, efficiency: 42.3 },
  { id: 'T008', date: '2025-01-18', startTime: '15:20', endTime: '16:40', distance: 18.6, energyUsed: 0.79, costEstimate: 9.48, avgSpeed: 24, efficiency: 42.5 },
  { id: 'T009', date: '2025-01-19', startTime: '07:30', endTime: '09:05', distance: 29.3, energyUsed: 1.24, costEstimate: 14.88, avgSpeed: 23, efficiency: 42.3 },
  { id: 'T010', date: '2025-01-19', startTime: '12:45', endTime: '14:10', distance: 21.8, energyUsed: 0.92, costEstimate: 11.04, avgSpeed: 24, efficiency: 42.2 },
  { id: 'T011', date: '2025-01-20', startTime: '08:00', endTime: '09:35', distance: 27.1, energyUsed: 1.15, costEstimate: 13.80, avgSpeed: 23, efficiency: 42.4 },
  { id: 'T012', date: '2025-01-20', startTime: '16:00', endTime: '17:25', distance: 20.4, energyUsed: 0.86, costEstimate: 10.32, avgSpeed: 24, efficiency: 42.2 },
  { id: 'T013', date: '2025-01-21', startTime: '07:15', endTime: '08:50', distance: 25.9, energyUsed: 1.10, costEstimate: 13.20, avgSpeed: 23, efficiency: 42.5 },
  { id: 'T014', date: '2025-01-21', startTime: '14:30', endTime: '15:55', distance: 22.7, energyUsed: 0.96, costEstimate: 11.52, avgSpeed: 24, efficiency: 42.3 },
  { id: 'T015', date: '2025-01-22', startTime: '08:45', endTime: '10:15', distance: 30.5, energyUsed: 1.29, costEstimate: 15.48, avgSpeed: 23, efficiency: 42.3 },
];

export function getEfficiencyTrend(range: '7d' | '30d' | '90d'): { date: string; value: number }[] {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const data: { date: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      value: 40 + Math.random() * 5,
    });
  }
  return data;
}

export function getSocHistory(range: '7d' | '30d' | '90d'): { date: string; value: number }[] {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 14;
  const data: { date: string; value: number }[] = [];
  let soc = 55;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    soc = Math.min(95, Math.max(15, soc + (Math.random() - 0.45) * 12));
    data.push({
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      value: Math.round(soc),
    });
  }
  return data;
}

export function getLastTrip(): Trip {
  return MOCK_TRIPS[MOCK_TRIPS.length - 1];
}

export function formatTripDuration(startTime: string, endTime: string): string {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const MOCK_APPOINTMENT_SLOTS = [
  '09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM',
];

export interface OtaUpdate {
  id: string;
  version: string;
  releaseDate: string;
  status: 'Installed' | 'Available' | 'Downloading' | 'Pending';
  description: string;
  sizeMb: number;
}

export const MOCK_OTA_UPDATES: OtaUpdate[] = [
  {
    id: 'OTA-2.4.1',
    version: 'v2.4.1',
    releaseDate: '2025-01-10',
    status: 'Installed',
    description: 'BMS thermal management improvements, charging curve optimization.',
    sizeMb: 48,
  },
  {
    id: 'OTA-2.5.0',
    version: 'v2.5.0',
    releaseDate: '2025-01-18',
    status: 'Available',
    description: 'VCU drive mode tuning, cluster UI refresh, security patches.',
    sizeMb: 62,
  },
];
