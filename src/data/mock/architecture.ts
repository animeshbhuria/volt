import { ArchitectureCompliance } from '../../types/specifications';

export const mockArchitecture: ArchitectureCompliance[] = [
  {
    "section": "Section",
    "item": "Item",
    "description": "Requirement / Description",
    "owner": "Owner",
    "remarks": "Acceptance / Remarks"
  },
  {
    "section": "Data Flow",
    "item": "TCU → Cloud → App",
    "description": "Preferred for live telemetry, remote commands, alerts and monitoring.",
    "owner": "Backend+TCU",
    "remarks": "Supports VOLT, Dealer, Financier and Customer views."
  },
  {
    "section": "Data Flow",
    "item": "BLE Phone ↔ Vehicle",
    "description": "Local pairing/diagnostic option only.",
    "owner": "Mobile+TCU",
    "remarks": "Secure challenge-response required."
  },
  {
    "section": "Data Flow",
    "item": "Hybrid BLE + Cloud",
    "description": "BLE for pairing + cloud for telemetry/analytics/remote monitoring.",
    "owner": "Architecture",
    "remarks": "Recommended model."
  },
  {
    "section": "Protocol",
    "item": "Vehicle internal",
    "description": "CAN/LIN communication.",
    "owner": "Vehicle Electronics",
    "remarks": "Already vehicle architecture dependent."
  },
  {
    "section": "Protocol",
    "item": "TCU to Cloud",
    "description": "MQTT/HTTPS.",
    "owner": "Backend+TCU",
    "remarks": "TLS and device authentication required."
  },
  {
    "section": "Protocol",
    "item": "App to Cloud",
    "description": "REST/GraphQL over HTTPS.",
    "owner": "Mobile+Backend",
    "remarks": "TLS 1.2+ mandatory."
  },
  {
    "section": "Protocol",
    "item": "Local Pairing",
    "description": "BLE GATT with secure challenge-response.",
    "owner": "Mobile+TCU",
    "remarks": "No plain-text secrets."
  },
  {
    "section": "Key Signals",
    "item": "Vehicle identity",
    "description": "VIN, chassis no., registration no., model, variant.",
    "owner": "VOLT Mobility",
    "remarks": "Mandatory for onboarding."
  },
  {
    "section": "Key Signals",
    "item": "Movement/status",
    "description": "Odometer, speed optional, ignition, GPS, online/offline.",
    "owner": "TCU+Backend",
    "remarks": "Timestamped with freshness."
  },
  {
    "section": "Key Signals",
    "item": "EV battery",
    "description": "SOC, SOH optional, voltage, current, temperature summary.",
    "owner": "BMS+TCU",
    "remarks": "Role-wise visibility."
  },
  {
    "section": "Key Signals",
    "item": "Charging",
    "description": "Charging state, plug status, charger type, charging fault.",
    "owner": "BMS/Charger",
    "remarks": "Customer + OEM primary."
  },
  {
    "section": "Key Signals",
    "item": "Faults/service",
    "description": "Fault category, severity, service due counter.",
    "owner": "Backend",
    "remarks": "No raw confidential codes unless planned."
  },
  {
    "section": "Compliance",
    "item": "Mobile security",
    "description": "OWASP MASVS / mobile security best practices.",
    "owner": "Security",
    "remarks": "No high/critical VAPT findings."
  },
  {
    "section": "Compliance",
    "item": "Backend security",
    "description": "ISO 27001-aligned controls.",
    "owner": "IT/Security",
    "remarks": "Controls mapped before launch."
  },
  {
    "section": "Compliance",
    "item": "Automotive cyber",
    "description": "ISO 21434-aligned principles for telematics/remote commands.",
    "owner": "Security+Engineering",
    "remarks": "Threat analysis for commands."
  },
  {
    "section": "Compliance",
    "item": "Privacy",
    "description": "India DPDP Act considerations and company legal policy.",
    "owner": "Legal+IT",
    "remarks": "Consent, minimization, access controls."
  },
  {
    "section": "Compliance",
    "item": "Remote immobilization",
    "description": "Legal, contractual, financier and internal policy approval required.",
    "owner": "Legal+VOLT Mobility",
    "remarks": "No direct execution without approved workflow."
  },
  {
    "section": "Logging",
    "item": "Crash analytics",
    "description": "Privacy-safe app crash analytics.",
    "owner": "Mobile",
    "remarks": "No sensitive data in logs."
  },
  {
    "section": "Logging",
    "item": "Command trace",
    "description": "Command requested → approved → sent → delivered → acknowledged/failed.",
    "owner": "Backend+TCU",
    "remarks": "Correlation ID required."
  },
  {
    "section": "Logging",
    "item": "Immobilization audit",
    "description": "Requester, approver, executor, VIN, reason, timestamp and status.",
    "owner": "VOLT Mobility",
    "remarks": "Mandatory audit trail."
  },
  {
    "section": "Logging",
    "item": "Pairing audit",
    "description": "VIN, user, dealer, OTP/QR status and timestamp.",
    "owner": "Backend",
    "remarks": "Fraud prevention."
  },
  {
    "section": "Acceptance",
    "item": "Pairing",
    "description": "Pairing success rate ≥98% in controlled pilot.",
    "owner": "QA",
    "remarks": "Controlled pilot metric."
  },
  {
    "section": "Acceptance",
    "item": "Remote command",
    "description": "Remote command success ≥95% when vehicle online.",
    "owner": "QA+TCU",
    "remarks": "If command feature enabled."
  },
  {
    "section": "Acceptance",
    "item": "Critical alerts",
    "description": "Critical alerts delivered within 30 seconds when network available.",
    "owner": "QA+Backend",
    "remarks": "Push pipeline validation."
  },
  {
    "section": "Acceptance",
    "item": "Security",
    "description": "No high/critical vulnerabilities after VAPT.",
    "owner": "Security",
    "remarks": "Production gate."
  }
];
