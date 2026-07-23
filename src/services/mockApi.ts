import type { Role } from '@/constants/auth';
import type { Alert } from '@/types/alerts';
import { MOCK_ALERTS } from './mockAlerts';
import { MOCK_SIGNALS, MOCK_SIGNALS_2, MOCK_VEHICLE, MOCK_VEHICLE_2 } from './mockSignals';
import { getEfficiencyTrend, getSocHistory, getLastTrip, MOCK_APPOINTMENT_SLOTS, MOCK_OTA_UPDATES, MOCK_TRIPS } from './mockTrips';
import type {
  ChargeSession,
  CommandResult,
  CommandType,
  DealerVehicle,
  Document,
  ImmobilizationRequest,
  ServiceJob,
  ServiceRequestPayload,
  SupportTicket,
  Trip,
  VehicleStatus,
} from '@/types/vehicle';

let simulateFault = false;
let findVehiclePingsToday = 2;

export function setSimulateFault(value: boolean) {
  simulateFault = value;
}

export function getSimulateFault() {
  return simulateFault;
}

function delay(): Promise<void> {
  const ms = 300 + Math.random() * 600;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withDelay<T>(data: T): Promise<T> {
  await delay();
  if (simulateFault) {
    throw new Error('Simulated API fault — please retry.');
  }
  return data;
}

// TODO: replace with API call
export async function getVehicleStatus(vin: string): Promise<VehicleStatus> {
  const vehicle = vin === MOCK_VEHICLE_2.vin ? MOCK_VEHICLE_2 : MOCK_VEHICLE;
  const signals = vin === MOCK_VEHICLE_2.vin ? MOCK_SIGNALS_2 : MOCK_SIGNALS;
  return withDelay({
    vehicle: { ...vehicle, lastSeen: new Date(Date.now() - 2 * 60 * 1000) },
    signals: { ...signals },
    lastUpdated: new Date(),
  });
}

// TODO: replace with API call
export async function getLastTripSummary(vin: string): Promise<Trip> {
  void vin;
  return withDelay(getLastTrip());
}

// TODO: replace with API call
export async function getSocHistoryData(range: '7d' | '30d' | '90d') {
  return withDelay(getSocHistory(range));
}

// TODO: replace with API call
export async function getAppointmentSlots(dealerId: string): Promise<string[]> {
  void dealerId;
  return withDelay(MOCK_APPOINTMENT_SLOTS);
}

// TODO: replace with API call
export async function getOtaUpdates(vin: string) {
  void vin;
  return withDelay(MOCK_OTA_UPDATES);
}

// TODO: replace with API call
export async function getTripHistory(vin: string, range: '7d' | '30d' | '90d'): Promise<Trip[]> {
  void vin;
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const filtered = MOCK_TRIPS.filter((t) => new Date(t.date) >= cutoff);
  return withDelay(filtered.length > 0 ? filtered : MOCK_TRIPS);
}

// TODO: replace with API call
export async function getEfficiencyData(range: '7d' | '30d' | '90d') {
  return withDelay(getEfficiencyTrend(range));
}

// TODO: replace with API call
export async function getAlerts(userId: string, role: Role): Promise<Alert[]> {
  void userId;
  return withDelay(MOCK_ALERTS.filter((a) => a.roles.includes(role)));
}

// TODO: replace with API call
export async function sendRemoteCommand(
  command: CommandType,
  vin: string,
  _authToken: string,
): Promise<CommandResult> {
  void vin;
  void _authToken;
  await delay();

  const commandId = `CMD-${Date.now()}`;
  const result: CommandResult = {
    commandId,
    command,
    status: 'QUEUED',
    timestamps: { QUEUED: new Date() },
  };

  return new Promise((resolve, reject) => {
    if (simulateFault) {
      reject(new Error('Command failed to queue.'));
      return;
    }

    setTimeout(() => {
      result.status = 'SENT';
      result.timestamps.SENT = new Date();
    }, 1500);

    setTimeout(() => {
      result.status = 'ACKNOWLEDGED';
      result.timestamps.ACKNOWLEDGED = new Date();
      resolve(result);
    }, 2500);
  });
}

// TODO: replace with API call
export async function submitServiceRequest(data: ServiceRequestPayload): Promise<{ ticketId: string }> {
  void data;
  return withDelay({ ticketId: 'TKT-2025-00847' });
}

// TODO: replace with API call
export async function getDocuments(vin: string, role: Role): Promise<Document[]> {
  void vin;
  void role;
  return withDelay([
    { id: 'D1', type: 'RC', name: 'Registration Certificate', expiryDate: '2028-06-15' },
    { id: 'D2', type: 'Insurance', name: 'HDFC ERGO Policy', expiryDate: '2026-02-10' },
    { id: 'D3', type: 'Warranty', name: 'VOLT EV Warranty', expiryDate: '2027-01-15' },
    { id: 'D4', type: 'Invoice', name: 'Purchase Invoice' },
    { id: 'D5', type: 'Service', name: 'Service Record — Jan 2025' },
    { id: 'D6', type: 'PUC', name: 'PUC Certificate', expiryDate: '2026-08-20' },
    { id: 'D7', type: 'Finance', name: 'Loan Agreement' },
  ]);
}

// TODO: replace with API call
export async function getChargeHistory(vin: string): Promise<ChargeSession[]> {
  void vin;
  return withDelay([
    { id: 'C1', date: '2025-01-20', duration: '2h 15m', energyAdded: 18.4, startSoc: 22, endSoc: 88, location: 'Home Charger', chargerType: 'AC Type-1' },
    { id: 'C2', date: '2025-01-18', duration: '1h 45m', energyAdded: 14.2, startSoc: 35, endSoc: 78, location: 'Jaipur EV Hub', chargerType: 'AC Type-2' },
    { id: 'C3', date: '2025-01-15', duration: '3h 10m', energyAdded: 22.1, startSoc: 15, endSoc: 95, location: 'Home Charger', chargerType: 'AC Type-1' },
    { id: 'C4', date: '2025-01-12', duration: '1h 20m', energyAdded: 10.5, startSoc: 48, endSoc: 72, location: 'Mansarovar Station', chargerType: 'AC Type-1' },
  ]);
}

// TODO: replace with API call
export async function getServiceJobs(vin: string): Promise<ServiceJob[]> {
  void vin;
  return withDelay([
    {
      id: 'JC-2024-0892',
      date: '2024-12-10',
      dealer: 'Jaipur EV Motors',
      advisor: 'Suresh Patel',
      serviceType: 'Routine',
      kmAtService: 11200,
      status: 'Closed',
      description: 'Oil check, brake inspection, software update.',
    },
    {
      id: 'JC-2025-0012',
      date: '2025-01-08',
      dealer: 'Jaipur EV Motors',
      advisor: 'Priya Sharma',
      serviceType: 'Complaint',
      kmAtService: 12650,
      status: 'In Progress',
      issueSummary: 'Intermittent charging issue',
      description: 'Customer reports slow charging at home.',
    },
  ]);
}

// TODO: replace with API call
export async function getSupportTickets(): Promise<SupportTicket[]> {
  return withDelay([
    {
      id: 'TKT-2025-00791',
      category: 'Charging Issue',
      status: 'In Progress',
      description: 'Home charger not reaching full SOC.',
      lastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'TKT-2024-05623',
      category: 'Service Complaint',
      status: 'Resolved',
      description: 'Delayed service appointment.',
      lastUpdate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  ]);
}

// TODO: replace with API call
export async function getDealerVehicles(): Promise<DealerVehicle[]> {
  return withDelay([
    { vin: 'VOLT1EV001234', customerName: 'Ramesh Kumar', soc: 68, lastSeen: '2 min ago', status: 'Online' },
    { vin: 'VOLT1EV005678', customerName: 'Suresh Meena', soc: 45, lastSeen: '15 min ago', status: 'Online' },
    { vin: 'VOLT1EV009912', customerName: 'Amit Jain', soc: 12, lastSeen: '1 hr ago', status: 'Fault' },
    { vin: 'VOLT1EV007821', customerName: 'Priya Sharma', soc: 0, lastSeen: '12 days ago', status: 'Offline' },
    { vin: 'VOLT1EV003456', customerName: 'Vikram Singh', soc: 82, lastSeen: '5 min ago', status: 'In Service' },
  ]);
}

// TODO: replace with API call
export async function getImmobilizationRequests(): Promise<ImmobilizationRequest[]> {
  return withDelay([
    {
      id: 'IMR-2025-003',
      vin: 'VOLT1EV007821',
      customer: 'Priya Sharma',
      requester: 'Rajasthan Finance Ltd',
      reason: 'Payment Default — 3 months overdue',
      evidence: 'Loan account #LA-78921 in default since Oct 2024.',
      status: 'Under Review',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'IMR-2025-002',
      vin: 'VOLT1EV004455',
      customer: 'Deepak Verma',
      requester: 'Rajasthan Finance Ltd',
      reason: 'Approved Recovery',
      evidence: 'Court order #RC-2024-112 issued for vehicle recovery.',
      status: 'Submitted',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ]);
}

export function getFindVehiclePingCount() {
  return { used: findVehiclePingsToday, limit: 3 };
}

export function incrementFindVehiclePing() {
  findVehiclePingsToday = Math.min(findVehiclePingsToday + 1, 3);
}

export const MOCK_DEALERS = [
  { id: 'D042', name: 'Jaipur EV Motors', location: 'Tonk Road, Jaipur' },
  { id: 'D015', name: 'Pink City Auto', location: 'Malviya Nagar, Jaipur' },
  { id: 'D028', name: 'Rajasthan EV Centre', location: 'Ajmer Road, Jaipur' },
];
