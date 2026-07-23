import { RoleAccess } from '../../types/specifications';

export const mockRoleAccess: RoleAccess[] = [
  {
    "feature": "Feature",
    "oem": "VOLT Mobility",
    "dealer": "Dealer",
    "financier": "Financier",
    "customer": "End User / Customer",
    "notes": "Notes / Control"
  },
  {
    "feature": "Login & Onboarding",
    "oem": "Full admin; create/manage users and approve dealer/financier onboarding",
    "dealer": "Dealer login approved by VOLT; manage dealer users",
    "financier": "Financier login approved by VOLT; manage branch users",
    "customer": "OTP login; customer profile and consent",
    "notes": "Backend RBAC mandatory"
  },
  {
    "feature": "Vehicle Pairing",
    "oem": "Add/map/unpair vehicle; map Dealer/Financier/Customer",
    "dealer": "Pair customer at delivery; link financier",
    "financier": "View mapped financed vehicles; verify portfolio mapping",
    "customer": "Pair own vehicle using VIN/OTP/QR/BLE optional",
    "notes": "Ownership verification mandatory"
  },
  {
    "feature": "Dashboard (Home)",
    "oem": "Fleet ecosystem dashboard with alerts and health summary",
    "dealer": "Dealer-linked vehicles, service cases and appointments",
    "financier": "Financed portfolio, default risk and immobilization status",
    "customer": "Own vehicle summary, SOC, range, documents and support",
    "notes": "Role-specific quick actions"
  },
  {
    "feature": "Live Vehicle Status",
    "oem": "Full technical status incl. BMS/MCU/TCU/faults/location",
    "dealer": "Limited health view for dealer vehicles",
    "financier": "Limited active/inactive, last status, immobilization, risk alerts",
    "customer": "Own live status: SOC/range/charging/warnings",
    "notes": "Data freshness visible"
  },
  {
    "feature": "Trips & Analytics",
    "oem": "Detailed analytics for drivability and product improvement",
    "dealer": "Usage summary for service support",
    "financier": "Limited utilization and inactive-days view",
    "customer": "Own trips, usage pattern and running cost",
    "notes": "Export as per permissions"
  },
  {
    "feature": "Charging/Swapping EV",
    "oem": "Charging behavior, faults, temperature, SOC trend",
    "dealer": "Charging issue support and ticket creation",
    "financier": "Limited last charged/SOC/inactivity status",
    "customer": "SOC, charging status, TTF, history and stations if integrated",
    "notes": "Partner API dependent"
  },
  {
    "feature": "Service & Maintenance",
    "oem": "Monitor service cases, warranty, repeat failures, dealer performance",
    "dealer": "Create appointments/job cards; update and close complaints",
    "financier": "Limited downtime/service status view",
    "customer": "Raise service request, book slot, track job card",
    "notes": "SLA and service MIS"
  },
  {
    "feature": "Alerts & Notifications",
    "oem": "All critical alerts and immobilization/service alerts",
    "dealer": "Dealer-linked service/fault alerts",
    "financier": "Default risk, tamper, TCU disconnect, immobilization alerts",
    "customer": "Own vehicle alerts, service/insurance reminders",
    "notes": "Critical alerts cannot be disabled"
  },
  {
    "feature": "Documents & Warranty",
    "oem": "Manage warranty, vehicle docs and service records",
    "dealer": "Upload/verify delivery, KYC, invoice, service documents",
    "financier": "Access loan/RC/insurance/hypothecation docs for portfolio",
    "customer": "View RC, insurance, warranty, invoice, manuals",
    "notes": "Document access restricted by role"
  },
  {
    "feature": "Support & RSA",
    "oem": "Assign/escalate/close tickets and monitor SLA",
    "dealer": "Manage complaints, assign service advisor, update status",
    "financier": "Raise finance/immobilization related support requests",
    "customer": "Raise complaint/RSA with location and photos",
    "notes": "Location sharing after consent"
  },
  {
    "feature": "Settings & Privacy",
    "oem": "System permissions, workflow, notification and privacy configuration",
    "dealer": "Dealer profile, branch users, notification settings",
    "financier": "Organization/branch users, portfolio access, notifications",
    "customer": "Profile, language, consent, notification preferences",
    "notes": "Audit config changes"
  },
  {
    "feature": "Remote Immobilization",
    "oem": "Approve/execute after workflow and legal/policy approval",
    "dealer": "Escalate only; no execution",
    "financier": "Raise immobilization/de-immobilization request",
    "customer": "No immobilization access",
    "notes": "Strong auth + full audit log"
  }
];
