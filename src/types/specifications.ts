export interface Requirement {
  id: string;
  type: string;
  category: string;
  requirement: string;
  priority: string;
  dependencies: string;
  dataNeeded: string;
  verification: string;
  acceptanceCriteria: string;
  owner: string;
  status: string;
  release: string;
  risk: string;
  regulatory: string;
  notes: string;
}

export interface Signal {
  id: string;
  name: string;
  description: string;
  unit: string;
  dataType: string;
  signed: string;
  factor: number;
  offset: number;
  min: number;
  max: number;
  ecu: string;
  bus: string;
  messageName: string;
  canId: string;
  startBit?: number;
  length?: number;
  features?: string[];
  notes: string;
}

export interface CanMessage {
  id: string;
  name: string;
  txEcu: string;
  bus: string;
  dlc: string | number;
  cycleTime: string;
  aliveCounter: string;
  crc: string;
  description: string;
  signals: string[];
  notes: string;
}

export interface RoleAccess {
  feature: string;
  oem: string;
  dealer: string;
  financier: string;
  customer: string;
  notes: string;
}

export interface ArchitectureCompliance {
  section: string;
  item: string;
  description: string;
  owner: string;
  remarks: string;
}

export interface VvDeliverable {
  type: string;
  area: string;
  description: string;
  owner: string;
  output: string;
}
