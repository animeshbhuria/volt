import type { Role } from '@/constants/auth';

export type AlertCategory = 'critical' | 'service' | 'documents' | 'trips' | 'info';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  severity: AlertSeverity;
  timestamp: Date;
  read: boolean;
  dismissible: boolean;
  vin?: string;
  roles: Role[];
}
