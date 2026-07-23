export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  language: 'en' | 'hi';
  notificationPrefs: {
    service: boolean;
    trips: boolean;
    documents: boolean;
    critical: boolean;
  };
  privacyConsents: {
    locationTracking: boolean;
    dataSharing: boolean;
    marketing: boolean;
  };
}
