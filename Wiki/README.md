# GPScannerAdmin — Module & Controller Documentation

This Wiki documents every AngularJS module and controller in the **GPScannerAdmin** web application — a multi-tenant GPS fleet-tracking admin portal.

---

## Table of Contents

| # | Document | Modules Covered |
|---|----------|----------------|
| 1 | [Authentication](./01-Authentication.md) | Login, Register, Forgot Password, Change Password |
| 2 | [Dashboard](./02-Dashboard.md) | Dashboard, Sales Dashboard |
| 3 | [Fleet Management](./03-Fleet-Management.md) | Vehicles, Trackers, VehicleMonitor |
| 4 | [GPS & Telemetry](./04-GPS-Telemetry.md) | GPS Data, HandShake, Alarm, CanBus, Driving Behavior |
| 5 | [Customer & User Management](./05-Customer-User-Management.md) | Customer, User, Roles, UserPermission |
| 6 | [Device & SIM Management](./06-Device-SIM-Management.md) | SIM, AssignDevice, TransferDevice, AssignLicence |
| 7 | [Distributor Hierarchy](./07-Distributor-Hierarchy.md) | AssignDistributor, AssignRetailer, AssignAgentRetailer, DistributorTrackers |
| 8 | [Financial Modules](./08-Financial-Modules.md) | OrderService, Wallet, WalletTransaction, RenewManagement |
| 9 | [System Configuration](./09-System-Configuration.md) | AppInfo, Module, MainSetting, EmailSetting, EmailTemplate |
| 10 | [Audit, Warranty & Sharing](./10-Audit-Warranty-Sharing.md) | AuditLog, AuditLogLicense, WarrantyDevice, WarrantySIM, SharedVehicle |
| 11 | [Cross-Cutting Concerns & API Reference](./11-Cross-Cutting-API-Reference.md) | RBAC, Navigation, Common Patterns, Full API Endpoint Index |
| 12 | [System Workflows](./12-System-Workflows.md) | Authentication, Device Onboarding, Assignment, Licensing, Subscriptions, Tracking, Alarms, Payments |
| 13 | [Data Entities](./13-Data-Entities.md) | User, Vehicle, GPS Device, SIM, Licence, OrderService, Wallet, Alarm, Product, and all supporting entities |
| 14 | [Actions, Business Rules & Validations](./14-Actions-Business-Rules.md) | All controller actions with business rules, validation logic, and status transitions |

---

## Application Overview

**GPScannerAdmin** is an AngularJS (1.x) Material-Design admin portal for managing GPS tracking hardware, subscriptions, and users across multiple tenant applications (identified by `appId`).

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | AngularJS 1.x (`angular.module`) |
| UI Library | Angular Material (`$mdDialog`, `$mdToast`) |
| Data Tables | `angular-datatables` (`DTOptionsBuilder`, server-side) |
| Real-time | Socket.IO (live GPS map) |
| Map | Leaflet.js with `MovingMarker` plugin |
| HTTP | `$http` service (JWT Bearer token) |
| Auth Storage | `$cookieStore` + `localStorage` |

### Multi-Tenancy Model

- Each deployment instance is identified by an **`appId`** resolved at boot from `appinfo/GetAppInfoByAdmin` or `appinfo/GetAppInfoByName`.
- `localStorage` holds `appId`, `appName`, and `Logo` for the current session.
- Super Admin can switch between all tenant apps; other roles are automatically scoped.

### Role Hierarchy

```
Super Admin
  └── Admin
        ├── Distributor
        │     └── Distributor Sub User
        ├── Sales Agent
        └── Retailer
```

- Roles are stored in `$cookieStore` as `UserRoles`.
- The `MenuSet()` function in `index.run.js` builds the sidebar navigation based on role.
- `CheckPageRights(ModuleName, callback)` enforces page-level access before any DataTable or form is rendered.
