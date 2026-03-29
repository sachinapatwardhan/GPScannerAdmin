# Data Entities

This page describes all major data entities (models) used in the GPScannerAdmin system, their fields, validation constraints, and relationships. Information is derived from controller `$scope` model initialisation blocks and API interactions.

---

## 1. User

**Module:** `User`, `Customer`  
**API resource prefix:** `/user/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `email` | string | Unique email address; used as login identifier |
| `username` | string | Auto-derived from email on customer creation |
| `phone` | string | Contact phone number |
| `password` | string | Hashed password (write-only) |
| `confirmpassword` | string | Confirmation — must match `password` on create |
| `roleId` | string/int | FK → Role; at least one role required |
| `userId` | string | Internal user reference |
| `country` | string | Country code/name |
| `state` | string | State within country |
| `city` | string | City within state |
| `gender` | string | Optional |
| `image` | string | Profile image URL |
| `IsMobileVerify` | boolean | Whether SMS verification has been completed |
| `idApp` | int | FK → AppInfo; scopes user to an application |
| `Amount` | decimal | Wallet/credit balance |
| `createdby` | string | Creator username (`'Admin'` default) |
| `createddate` | date | Record creation timestamp |
| `modifiedby` | string | Last modifier username |
| `modifieddate` | date | Last modification timestamp |

**Status field:** `IsActive` — `0` = Inactive/Suspended, `1` = Active

**Relationships:**
- Belongs to one `AppInfo`
- Has many `Roles` (many-to-many)
- Has many `Vehicles` (as customer)
- Has many `OrderService` records
- Has many `WalletTransaction` records

---

## 2. Vehicle

**Module:** `Vehicles`  
**API resource prefix:** `/vehicles/`, `/bike/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `iduser` | string | FK → User (owner/customer) |
| `Name` | string | Vehicle name/label |
| `deviceid` | string | Device identifier string |
| `IMEI` | string | Hardware IMEI number |
| `DeviceType` | string | Device model type |
| `idType` | int | FK → VehicleType |
| `AppName` | string | Application context name |
| `renewaldate` | date | Licence/subscription renewal date |
| `HandshakDatetime` | date | Last successful GPS handshake timestamp |
| `MaxSpeed` | int | Speed limit (km/h) for over-speed alarm |
| `BatteryPercentage` | int | Current battery level |
| `IsACC` | int | Accessory/ignition detection: `0`=off, `1`=on |
| `SleepMode` | int | Sleep mode flag: `0`=off, `1`=on |
| `IsOnline` | int/boolean | Online status: `0`/`false`=Offline, `1`/`true`=Online |
| `GPRSInterval` | int | GPRS reporting interval in seconds (default 10) |
| `GPRSStopInterval` | int | GPRS interval when stationary |
| `Arm` | int | Immobiliser armed state: `0`=disarmed, `1`=armed |
| `OdoMeter` | int | Odometer reading |
| `HeartbeatInterval` | int | Heartbeat interval in minutes (default 1) |
| `Relay` | int/null | Relay output state |
| `Siren` | int/null | Siren output state |
| `UserDefined` | string/null | Custom user-defined field |
| `DoorLock` | int/null | Door lock output state |
| `DoorUnlock` | int/null | Door unlock output state |
| `TimeZone` | string/null | Device timezone setting |
| `IsDelete` | int | Soft-delete flag: `0`=active, `1`=deleted |
| `idSalesAgent` | int/null | FK → User (sales agent) |

**Relationships:**
- Belongs to one `User` (customer)
- Has one `VehicleType`
- Has many `Alarm` records
- Has one active `Licence`
- Has many `OrderService` records

---

## 3. GPS Device (Tracker Hardware)

**Module:** `Trackers`  
**API resource prefix:** `/PetDevice/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `DeviceId` | string | Device identifier |
| `IMEI` | string | Hardware IMEI |
| `Company` | string | Hardware manufacturer (default `'Maark'`) |
| `Type` | string | Device model type (e.g., `'MT05'` for Tracking app) |
| `Version` | string | Firmware version |
| `CountryId` | int | FK → Country |
| `TelCoId` | int | FK → TelCo (telecom operator) |
| `SimNum` | string | Assigned SIM serial number |
| `idSalesAgent` | int | FK → User (sales agent) |
| `ExpiryDate` | date | Device/subscription expiry date |
| `idSim` | int | FK → SIM |
| `AppName` | string | Application context |
| `idApp` | int | FK → AppInfo |
| `Status` | string | Device status: `'-1'` default, `'0'`=inactive, `'1'`=active |
| `Remark` | string | Free-text notes |

**Relationships:**
- Belongs to one `SIM`
- Belongs to one `TelCo`
- Belongs to one `Country`
- Belongs to one `AppInfo`
- Linked to one `Vehicle` record

---

## 4. SIM Card

**Module:** `SIM`  
**API resource prefix:** `/sim/`

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `SerialNum` | string | SIM serial / ICCID |
| `PhoneNum` | string | SIM phone number |
| `idTelCo` | int | FK → TelCo |
| `Status` | string | `'-1'`=default, `'0'`=inactive, `'1'`=active |
| `idApp` | int | FK → AppInfo |
| `SpoilDate` | date | SIM expiry / spoil date |

**Relationships:**
- Belongs to one `TelCo`
- Belongs to one `AppInfo`
- Linked to one `GPS Device` (Tracker)

---

## 5. Licence

**Module:** `AssignLicence`  
**API resource prefix:** `/licence/`

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `IdUser` | string | FK → User |
| `LicenceNo` | string | Unique licence number |
| `DeviceId` | string | Associated device ID |
| `ExpiryDate` | date | Calculated from renewal type |
| `LicenceRenewalType` | string | `'Yearly'` / `'Quarterly'` / `'Monthly'` |
| `LicenceType` | string | App-configured type (e.g., `'Premium'`, `'Standard'`) |

**Renewal Type → Expiry Calculation:**
| Type | Duration |
|------|----------|
| Yearly | +12 months |
| Quarterly | +3 months |
| Monthly | +1 month |

**Relationships:**
- Belongs to one `User`
- Associated with one `Vehicle` / `GPS Device`

---

## 6. Order Service (Subscription)

**Module:** `OrderService`  
**API resource prefix:** `/billing/`, `/orderservice/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `PurchaseOrderNumber` | string | Unique order reference |
| `idUser` | int | FK → User (customer) |
| `idApp` | int | FK → AppInfo |
| `OrderTotal` | decimal | Sum of renewal prices for selected devices |
| `OrderNotes` | string | Free-text notes / remarks |
| `StartDate` | date | Subscription start date |
| `EndDate` | date | Subscription end date |
| `ImageUrl` | string | Payment receipt image path |
| `Terms` | string | Agreement / terms text |
| `idStatus` | int | FK → OrderServiceStatus |

**Status values (`tblorderservicestatus`):**
| Value | Label |
|-------|-------|
| 1 | Pending |
| 2 | Paid |
| 3 | Completed |
| 4 | Void |
| 5 | Expire |
| 6 | Approved |

**Relationships:**
- Belongs to one `User`
- Belongs to one `AppInfo`
- Has many line items (devices / vehicles)
- Has one `OrderServiceStatus`

---

## 7. Wallet Transaction

**Module:** `WalletTransaction`  
**API resource prefix:** `/WalletTransaction/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `idApp` | int | FK → AppInfo |
| `Amount` | decimal | Transaction amount (must be > 0) |
| `Type` | string | `'Credit'` (top-up) or `'Debit'` (payment) |
| `Remark` | string | Description / notes |
| `OrderNumber` | string | Unique order reference |
| `IsPaymentSuccess` | int | `0`=Pending/Failed, `1`=Successful |
| `PaymentType` | string | `'Offline'` / `'Online'` |
| `Country` | string | Transaction country (from user context) |
| `DeviceId` | string | Associated device ID (optional) |
| `ImageUrl` | string | Payment receipt image path |

**Relationships:**
- Belongs to one `AppInfo`
- Optionally associated with one `Vehicle`/`Device`

---

## 8. Alarm

**Module:** `Alarm`  
**API resource prefix:** `/gpsdata/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `DeviceId` | string | FK → Vehicle/Device |
| `AlarmCode` | string | Numeric alarm code (e.g., `'01'`, `'11'`) |
| `Latitude` | decimal | GPS latitude at time of alarm |
| `Longitude` | decimal | GPS longitude at time of alarm |
| `Date` | timestamp | Epoch timestamp (×1000 for JS Date) |
| `GPSPositioning` | string | GPS fix quality |
| `Status` | string | Alarm acknowledgement status |
| `CreatedDate` | date | Server-side creation timestamp |
| `FenceName` | string | Fence name (only for Fence IN/OUT alarms) |

**Relationships:**
- Belongs to one `Vehicle`

---

## 9. Product

**Module:** `Product`  
**API resource prefix:** `/product/`

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `ProductTypeId` | int | FK → ProductType |
| `Name` | string | Product display name |
| `Sku` | string | Stock-keeping unit code |
| `ShortDescription` | string | Brief HTML description |
| `FullDescription` | string | Full HTML description (CKEditor) |
| `AdminComment` | string | Internal admin notes |
| `VendorId` | int | FK → Vendor |
| `BrandId` | int | FK → Brand |
| `Price` | decimal | Regular selling price (default `0.0000`) |
| `OldPrice` | decimal | Crossed-out original price |
| `ProductCost` | decimal | Internal cost price |
| `SpecialPrice` | decimal/null | Promotional price |
| `SpecialPriceStartDateTimeUtc` | date/null | Special price start date |
| `SpecialPriceEndDateTimeUtc` | date/null | Special price end date |
| `Published` | boolean | Visibility on storefront |
| `Visibility` | int | Visibility level |
| `DisplayOrder` | int | Sort order |
| `StockQuantity` | int | Units in stock |
| `MinStockQuantity` | int | Minimum stock before alert |
| `BackorderModeId` | int | Backorder behaviour |
| `MetaKeywords` | string | SEO keywords |
| `MetaDescription` | string | SEO description |
| `MetaTitle` | string | SEO page title |
| `Weight` | decimal | Shipping weight |
| `Height` | decimal | Package height |
| `Width` | decimal | Package width |
| `Length` | decimal | Package length |
| `IsFreeShipping` | boolean | Free shipping flag |
| `ShipSeparately` | boolean | Ship as separate package |
| `DisableBuyButton` | boolean | Hide buy button |
| `DisableWishlistButton` | boolean | Hide wishlist button |
| `AvailableForPreOrder` | boolean | Allow pre-orders |
| `CreatedOnUtc` | date | Creation timestamp |
| `UpdatedOnUtc` | date | Last update timestamp |

**Relationships:**
- Belongs to one `ProductType`, `Vendor`, `Brand`
- Has many `Category` associations
- Has many `ProductPictureMapping` (images)
- Has many `ProductAttributeMapping` → `ProductAttributeValue`
- Has many `ProductAttributeCombination` (variants)
- Has many `TierPrice` entries

---

## 10. Product Attribute & Combination

**Module:** `Product`, `Attribute`

### Product Attribute
| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `Name` | string | Attribute name (e.g., `'Color'`, `'Size'`) |
| `Description` | string | Attribute description |

### Product Attribute Mapping (per product)
| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `ProductId` | int | FK → Product |
| `ProductAttributeId` | int | FK → ProductAttribute |
| `TextPrompt` | string | Label shown on storefront |
| `IsRequired` | boolean | Whether customer must choose this attribute |
| `AttributeControlTypeId` | int | UI control type (dropdown, radio, etc.) |
| `DisplayOrder` | int | Sort order |

### Product Attribute Combination (variant)
| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `ProductId` | int | FK → Product |
| `AttributesXml` | string | XML-encoded combination of attribute values |
| `StockQuantity` | int | Stock for this variant |
| `Sku` | string | Variant SKU |
| `Price` | decimal | Variant-specific price |

---

## 11. Country / State / City

**Module:** `Country`, `State`, `City`

### Country
| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `Code` | string | ISO country code |
| `Country` | string | Full country name |
| `ShortName` | string | Abbreviated name |
| `Seq` | int | Sort sequence (default `0`) |
| `CreatedBy` | string | Creator |
| `CreatedDate` | date | Creation timestamp |
| `ModifyDate` | date | Last modified timestamp |

### State
| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `State` | string | State/province name |
| `CountryId` | int | FK → Country |

### City
| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `City` | string | City name |
| `StateId` | int | FK → State |

---

## 12. App Info (Tenant Application)

**Module:** `AppInfo`  
**API resource prefix:** `/appinfo/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `AppName` | string | Application display name |
| `idApp` | int | Application identifier |
| `IsActive` | int | `0`=Inactive, `1`=Active |

**Role:** Central multi-tenancy anchor — virtually every entity has an `idApp` foreign key that scopes it to a specific tenant application.

---

## 13. Role

**Module:** `Roles`  
**API resource prefix:** `/role/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `RoleName` | string | Role display name |
| `Description` | string | Role description |

**Known roles used in routing logic:**
- `Super Admin` — all-apps access
- `Admin` — single-app access
- `Distributor` — redirected to `/DistributorTrackers`
- `Sales Agent` — redirected to `/SalesDashboard`
- `Customer` / `Owner` — end-user

**Relationships:**
- Has many `Country` associations (country-scoped roles)
- Has many `User` records (many-to-many)

---

## 14. VehicleType

**Module:** Referenced by `Vehicles`, `OrderService`  
**API resource prefix:** `/vehicletype/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `Name` | string | Vehicle type name (e.g., `'Car'`, `'Motorcycle'`) |
| `IsActive` | int | `0`=inactive, `1`=active |

---

## 15. TelCo (Telecom Operator)

**Module:** `TelCo`  
**API resource prefix:** `/telco/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `Name` | string | Telecom company name |
| `CountryId` | int | FK → Country |

**Relationships:**
- Has many `SIM` cards

---

## 16. Device Renew Price

**Module:** `DeviceRenewPrice`  
**API resource prefix:** `/devicerenewprice/`

| Field | Type | Description |
|-------|------|-------------|
| `Id` | int | Primary key |
| `IdUser` | int | FK → User (Sales Agent) |
| `Type` | string | Device type code |
| `Price` | decimal | Renewal price for this agent + device type |
| `idApp` | int | FK → AppInfo |

**Business rule:** Price must be positive; no duplicate `(IdUser, Type)` combination allowed within an app.

---

## 17. API Access (External API Client)

**Module:** `ApiAccess`  
**API resource prefix:** `/apiaccess/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `Name` | string | Client name |
| `Phone` | string | Contact phone |
| `Email` | string | Contact email |
| `AppName` | string | Associated application |
| `IsActive` | int | `0`=Inactive, `1`=Active |

---

## 18. Warranty — Device & SIM

**Module:** `WarrantyDevice`, `WarrantySIM`

### Warranty Device
| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `DeviceId` | string | FK → GPS Device |
| `WarrantyDate` | date | Warranty expiry date |
| `Remark` | string | Notes |

### Warranty SIM
| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `SimId` | int | FK → SIM |
| `WarrantyDate` | date | Warranty expiry date |
| `Remark` | string | Notes |

---

## 19. Audit Log

**Module:** `AuditLog`, `AuditLogLicense`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `UserId` | int | FK → User (who performed the action) |
| `Action` | string | Action description (e.g., `'Create'`, `'Update'`, `'Delete'`) |
| `EntityName` | string | Affected entity type |
| `EntityId` | int | Affected entity primary key |
| `Details` | string | Change details / diff |
| `CreatedDate` | date | Timestamp of the action |

---

## 20. Shared Vehicle

**Module:** `SharedVehicle`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `idVehicle` | int | FK → Vehicle |
| `idUser` | int | FK → User (shared-with) |
| `StartDate` | date | Sharing start date |
| `EndDate` | date | Sharing end date |
| `IsActive` | int | `0`=inactive, `1`=active |

---

## 21. App Settings (Version Management)

**Module:** `Setting`  
**API resource prefix:** `/appsetting/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `Name` | string | Application name |
| `AndroidVersion` | string | Current Android app version |
| `IOSVersion` | string | Current iOS app version |
| `AndroidURL` | string | Android download URL |
| `IOSURL` | string | iOS download URL |
| `UpdateAppText` | string | In-app update message shown to users |

---

## 22. Email Template

**Module:** `EmailTemplate`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `Name` | string | Template name/identifier |
| `Subject` | string | Email subject |
| `Body` | string | Email body (HTML, CKEditor) |
| `IsActive` | int | `0`=disabled, `1`=active |

---

## 23. Language / Mobile Language Resource

**Module:** `Language`, `MobileLanguageResource`

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Primary key |
| `LanguageCode` | string | ISO language code |
| `Name` | string | Language display name |
| `ResourceKey` | string | Translation key |
| `ResourceValue` | string | Translated string |

---

## Entity Relationship Summary

```
AppInfo (Tenant)
  ├── User / Customer
  │     ├── Vehicle ──► GPS Device (Tracker) ──► SIM ──► TelCo
  │     │                    └── Alarm records
  │     ├── Licence
  │     ├── OrderService (Subscription)
  │     └── WalletTransaction
  ├── Product ──► ProductAttribute ──► ProductAttributeCombination
  ├── SIM cards (inventory)
  ├── GPS Devices (hardware inventory)
  ├── DeviceRenewPrice (per Agent + DeviceType)
  └── EmailTemplate

Role ──► User (many-to-many)
Country ──► State ──► City
Country ──► Role (country-scoped roles)
VehicleType ──► Vehicle
Distributor ──► SalesAgent ──► Customer ──► Vehicle
```
