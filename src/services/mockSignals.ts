import type { Vehicle, VehicleSignals } from '@/types/vehicle';

export const MOCK_VEHICLE: Vehicle = {
  vin: 'VOLT1EV001234',
  model: 'VOLT EV-1',
  variant: 'L5 Passenger',
  regNumber: 'RJ14EV0042',
  ownerName: 'Ramesh Kumar',
  dealerName: 'Jaipur EV Motors',
  tcuStatus: 'ONLINE',
  lastSeen: new Date(Date.now() - 2 * 60 * 1000),
};

export const MOCK_SIGNALS: VehicleSignals = {
  soc: 68,
  soh: 94,
  estimatedRange: 87,
  batteryVoltage: 51.4,
  packTempMin: 28.2,
  packTempMax: 33.7,
  packTempMean: 31.1,
  odometer: 12847,
  speed: 0,
  driveMode: 'ECO',
  ignitionState: 'OFF',
  chargingState: 'NOT_CHARGING',
  plugStatus: 'UNPLUGGED',
  aux12vVoltage: 12.6,
  immobilizationStatus: 'ACTIVE',
  batteryFault: false,
  mcuTempCutoff: false,
  motorTempWarning: false,
  vcuLowSOC: false,
  thermalRunaway: false,
  batteryOverVoltage: false,
  batteryUnderVoltage: false,
  deepDischarge: false,
  cellImbalance: false,
  whPerKm: 42.3,
  chargeSessionsLast30Days: 22,
  totalDistanceLast30Days: 1847,
  mcuTemp: 42,
  motorTemp: 38,
  chargingRateKw: 4.2,
  timeToFullMinutes: 72,
  chargeLimit: 90,
};

export const MOCK_VEHICLE_2: Vehicle = {
  vin: 'VOLT1EV005678',
  model: 'VOLT EV-1',
  variant: 'L5 Cargo',
  regNumber: 'RJ14EV0099',
  ownerName: 'Ramesh Kumar',
  dealerName: 'Jaipur EV Motors',
  tcuStatus: 'ONLINE',
  lastSeen: new Date(Date.now() - 15 * 60 * 1000),
};

export const MOCK_SIGNALS_2: VehicleSignals = {
  ...MOCK_SIGNALS,
  soc: 45,
  estimatedRange: 58,
  odometer: 8421,
};

export const POWERTRAIN_FAULTS = [
  { id: 'SIG-001', name: 'MCU Temp Cutoff', active: false },
  { id: 'SIG-003', name: 'Motor Temp Warning', active: false },
  { id: 'SIG-013', name: 'VCU Low SOC Fault', active: false },
  { id: 'SIG-020', name: 'MCU OverCurrent Fault', active: false },
  { id: 'SIG-022', name: 'MCU FOC Fault', active: false },
];

export const BMS_FAULTS = [
  { id: 'SIG-029', name: 'Thermal Runaway', active: false },
  { id: 'SIG-025', name: 'Over Voltage', active: false },
  { id: 'SIG-038', name: 'Under Voltage', active: false },
  { id: 'SIG-027', name: 'Deep Discharge', active: false },
  { id: 'SIG-028', name: 'Cell Imbalance', active: false },
];
