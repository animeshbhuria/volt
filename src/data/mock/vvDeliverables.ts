import { VvDeliverable } from '../../types/specifications';

export const mockVvDeliverables: VvDeliverable[] = [
  {
    "type": "Type",
    "area": "Area / Deliverable",
    "description": "Description",
    "owner": "Owner",
    "output": "Acceptance / Output"
  },
  {
    "type": "V&V",
    "area": "Unit testing",
    "description": "UI logic, form validation and role-based screen visibility.",
    "owner": "QA+Mobile",
    "output": "Unit test report."
  },
  {
    "type": "V&V",
    "area": "Integration testing",
    "description": "API contracts, OTP, pairing, telemetry ingestion and document upload.",
    "owner": "QA+Backend",
    "output": "Integration test report."
  },
  {
    "type": "V&V",
    "area": "Security testing",
    "description": "SAST, DAST, penetration test, OWASP checks.",
    "owner": "Security",
    "output": "No high/critical open issues."
  },
  {
    "type": "V&V",
    "area": "Role-based access testing",
    "description": "Validate VOLT, Dealer, Financier and Customer access boundaries.",
    "owner": "QA+Security",
    "output": "Unauthorized access blocked."
  },
  {
    "type": "V&V",
    "area": "Remote command testing",
    "description": "OTP, approval workflow, command trace and failure handling.",
    "owner": "QA+TCU",
    "output": "Command lifecycle report."
  },
  {
    "type": "V&V",
    "area": "Immobilization workflow testing",
    "description": "Request, approval, rejection, execution, revoke and audit log.",
    "owner": "QA+VOLT Mobility",
    "output": "No direct command bypass."
  },
  {
    "type": "V&V",
    "area": "Field testing",
    "description": "Low network, roaming, sleep mode, TCU offline, delayed telemetry.",
    "owner": "QA+Field",
    "output": "Field validation report."
  },
  {
    "type": "V&V",
    "area": "Vehicle signal testing",
    "description": "Live signals, SOC, charging state, fault summary, GPS and ignition status.",
    "owner": "Engineering+QA",
    "output": "Signal mapping report."
  },
  {
    "type": "V&V",
    "area": "Usability testing",
    "description": "Non-technical user flows for service booking, support and documents.",
    "owner": "UX+QA",
    "output": "Task completion within target taps."
  },
  {
    "type": "V&V",
    "area": "Store compliance",
    "description": "Google Play and Apple App Store review guideline validation.",
    "owner": "Mobile",
    "output": "Store-ready build."
  },
  {
    "type": "Deliverable",
    "area": "Android App",
    "description": "Role-based Android mobile application.",
    "owner": "Mobile",
    "output": "Release APK/AAB."
  },
  {
    "type": "Deliverable",
    "area": "iOS App",
    "description": "Role-based iOS application.",
    "owner": "Mobile",
    "output": "TestFlight/App Store build."
  },
  {
    "type": "Deliverable",
    "area": "Backend APIs",
    "description": "Authentication, vehicle data, pairing, service, documents, alerts and commands.",
    "owner": "Backend",
    "output": "OpenAPI documentation."
  },
  {
    "type": "Deliverable",
    "area": "Admin Console",
    "description": "VOLT admin console for users, vehicles, dealers, financiers and permissions.",
    "owner": "Backend+Web",
    "output": "Admin portal access."
  },
  {
    "type": "Deliverable",
    "area": "Device Registry",
    "description": "Vehicle, TCU, battery, controller and VIN mapping service.",
    "owner": "Backend+TCU",
    "output": "Registry records."
  },
  {
    "type": "Deliverable",
    "area": "Pairing Service",
    "description": "VIN, QR, OTP and optional BLE-based pairing workflow.",
    "owner": "Backend+Mobile",
    "output": "Pairing test report."
  },
  {
    "type": "Deliverable",
    "area": "Role Management Module",
    "description": "Access control for VOLT, Dealer, Financier and Customer.",
    "owner": "Backend",
    "output": "RBAC test report."
  },
  {
    "type": "Deliverable",
    "area": "Immobilization Workflow Module",
    "description": "Request, approval, execution, de-immobilization and audit trail.",
    "owner": "Backend+TCU",
    "output": "Workflow test report."
  },
  {
    "type": "Deliverable",
    "area": "Service Module",
    "description": "Ticket, appointment, job card, warranty and service history.",
    "owner": "Backend+Dealer",
    "output": "Service test report."
  },
  {
    "type": "Deliverable",
    "area": "Document Module",
    "description": "RC, insurance, invoice, warranty, finance and service document handling.",
    "owner": "Backend",
    "output": "Document access report."
  },
  {
    "type": "Deliverable",
    "area": "User Manuals",
    "description": "Role-wise user manuals and in-app help.",
    "owner": "Product",
    "output": "Manuals approved."
  },
  {
    "type": "Deliverable",
    "area": "Test Reports",
    "description": "Unit, integration, field, security and VAPT reports.",
    "owner": "QA+Security",
    "output": "Reports attached to release."
  }
];
