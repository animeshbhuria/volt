export type Role = 'CUSTOMER' | 'DEALER' | 'FINANCIER' | 'VOLT';

export interface MockUser {
  phone: string;
  role: Role;
  name: string;
  vehicleVin?: string;
  dealerId?: string;
  portfolioId?: string;
}

export const MOCK_USERS: Record<string, MockUser> = {
  '9876543210': {
    phone: '9876543210',
    role: 'CUSTOMER',
    name: 'Ramesh Kumar',
    vehicleVin: 'VOLT1EV001234',
  },
  '9988776655': {
    phone: '9988776655',
    role: 'DEALER',
    name: 'Jaipur EV Motors',
    dealerId: 'D042',
  },
  '9111222333': {
    phone: '9111222333',
    role: 'FINANCIER',
    name: 'Rajasthan Finance Ltd',
    portfolioId: 'FIN-012',
  },
  '9000000001': {
    phone: '9000000001',
    role: 'VOLT',
    name: 'Operations Team',
  },
};

export const MOCK_OTP = '1234';

export const ROLE_ROUTES: Record<Role, string> = {
  CUSTOMER: '/(customer)',
  DEALER: '/(dealer)',
  FINANCIER: '/(financier)',
  VOLT: '/(oem)',
};
