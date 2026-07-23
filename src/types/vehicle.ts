export type DriveMode = 'ECO' | 'NORMAL' | 'SPORT';
export type ChargingState = 'NOT_CHARGING' | 'CHARGING' | 'COMPLETE' | 'FAULT';
export type PlugStatus = 'UNPLUGGED' | 'PLUGGED';
export type IgnitionState = 'OFF' | 'ON' | 'ACC';
export type ImmobilizationStatus = 'ACTIVE' | 'IMMOBILIZED' | 'PENDING';
export type TcuStatus = 'ONLINE' | 'OFFLINE' | 'FAULT';

export interface Vehicle {
  vin: string;
  model: string;
  variant: string;
  regNumber: string;
  ownerName: string;
  dealerName: string;
  tcuStatus: TcuStatus;
  lastSeen: Date;
}

export interface VehicleSignals {
  soc: number;
  soh: number;
  estimatedRange: number;
  batteryVoltage: number;
  packTempMin: number;
  packTempMax: number;
  packTempMean: number;
  odometer: number;
  speed: number;
  driveMode: DriveMode;
  ignitionState: IgnitionState;
  chargingState: ChargingState;
  plugStatus: PlugStatus;
  aux12vVoltage: number;
  immobilizationStatus: ImmobilizationStatus;
  batteryFault: boolean;
  mcuTempCutoff: boolean;
  motorTempWarning: boolean;
  vcuLowSOC: boolean;
  thermalRunaway: boolean;
  batteryOverVoltage: boolean;
  batteryUnderVoltage: boolean;
  deepDischarge: boolean;
  cellImbalance: boolean;
  whPerKm: number;
  chargeSessionsLast30Days: number;
  totalDistanceLast30Days: number;
  mcuTemp?: number;
  motorTemp?: number;
  chargingRateKw?: number;
  timeToFullMinutes?: number;
  chargeLimit?: number;
}

export interface VehicleStatus {
  vehicle: Vehicle;
  signals: VehicleSignals;
  lastUpdated: Date;
}

export type CommandType = 'LOCK' | 'UNLOCK' | 'FIND_VEHICLE' | 'IMMOBILIZE' | 'CHARGE_LIMIT';
export type CommandStatus = 'QUEUED' | 'SENT' | 'ACKNOWLEDGED' | 'FAILED' | 'REVOKED';

export interface CommandResult {
  commandId: string;
  command: CommandType;
  status: CommandStatus;
  reason?: string;
  timestamps: Partial<Record<CommandStatus, Date>>;
}

export interface Trip {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  distance: number;
  energyUsed: number;
  costEstimate: number;
  avgSpeed: number;
  efficiency: number;
}

export interface ChargeSession {
  id: string;
  date: string;
  duration: string;
  energyAdded: number;
  startSoc: number;
  endSoc: number;
  location: string;
  chargerType: string;
}

export interface ServiceJob {
  id: string;
  date: string;
  dealer: string;
  advisor?: string;
  serviceType: string;
  kmAtService: number;
  status: 'Received' | 'In Progress' | 'Ready' | 'Delivered' | 'Closed';
  description?: string;
  issueSummary?: string;
}

export interface ServiceRequestPayload {
  dealerId: string;
  date: string;
  serviceType: 'Routine' | 'Complaint' | 'Warranty';
  description: string;
  vin: string;
}

export interface Document {
  id: string;
  type: string;
  name: string;
  expiryDate?: string;
  url?: string;
}

export interface SupportTicket {
  id: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  description: string;
  lastUpdate: Date;
}

export interface ImmobilizationRequest {
  id: string;
  vin: string;
  customer: string;
  requester: string;
  reason: string;
  evidence: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Executed';
  submittedAt: Date;
}

export interface DealerVehicle {
  vin: string;
  customerName: string;
  soc: number;
  lastSeen: string;
  status: 'Online' | 'Offline' | 'Fault' | 'In Service';
}
