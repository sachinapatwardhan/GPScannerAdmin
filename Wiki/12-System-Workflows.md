# System Workflows

This page describes the major end-to-end workflows in the GPScannerAdmin system, derived from the AngularJS controllers and API endpoints.

---

## 1. User Authentication Workflow

**Actors:** Any user (Admin, Super Admin, Distributor, Sales Agent, Customer)

**Steps:**
1. User navigates to `/login`.
2. `LoginController.init()` pre-fills credentials from cookies if **RememberMe** was set on a previous session.
3. User submits credentials → `GET account/loginNew?username=&password=&appId=`.
4. On success, the response provides: `UserId`, `DistributorId`, `UserRoles`, `UserCountry`, `CountryList`, `UserImage`, `token`, `Amount`.
5. Token and user context are stored in `$cookieStore` and `localStorage`.
6. Controller reads `UserRoles` and redirects:
   - **Distributor** → `/DistributorTrackers`
   - **Sales Agent** → `/SalesDashboard`
   - **All others** → `/Dashboard`
7. On logout, cookies are cleared and `FlagLogout` is set.

**Key data stored in session:**
`UserId`, `DistributorId`, `UserRoles`, `UserCountry`, `RolewiseCountryList`, `token`, `isLogin`, `AppName`, `appId`

---

## 2. GPS Device Registration & Onboarding Workflow

**Actors:** Admin, Super Admin

**Steps:**
1. Navigate to **Trackers** module (`TrackersController`).
2. Fill in the new device form: IMEI, SIM card, Telco provider, App, Sales Agent, country.
3. Submit → `POST PetDevice/SaveGPSDevice`.
4. Device appears in the Trackers list with status set to active.
5. Admin then navigates to **Vehicles** module to link the device to a customer:
   a. Search for customer by email (autocomplete → `GET user/GetUserByEmail`).
   b. Enter the IMEI → `GET PetDevice/GetGPSDeviceById?IMEI=` pre-populates device fields.
   c. Fill vehicle name, type, renewal date, configuration parameters.
   d. Submit → `GET bike/SaveVehicle`.
6. Device is now registered and linked to a customer account.

---

## 3. Device Assignment to Sales Agent Workflow

**Actors:** Super Admin

**Steps:**
1. Navigate to **Assign Device** module (`AssignDeviceController`).
2. Select the target app.
3. Search for a Sales Agent using the autocomplete (`GET admin/getAutocompleteSalesAgentNew`).
4. The DataTable shows all GPS devices (`GET admin/getAllGpsDevicesNew`); each row has an **Assign** checkbox.
5. Check devices to assign to the selected agent → `POST admin/assignDevice` for each toggle.
6. Unchecking a device unassigns it from the agent.

**Constraints:**
- A device can be assigned to only one agent at a time.
- Checkboxes are disabled while an API call is in progress to prevent double-submission.
- Bulk assignment can also be done via Excel import (template: `GET admin/downloadAssignDeviceExcelTemplate`).

---

## 4. Licence Assignment & Renewal Workflow

**Actors:** Admin, Super Admin

**Steps:**

#### Assign New Licence
1. Navigate to **Assign Licence** module (`AssignLicenceController`).
2. Select User via autocomplete (`GET user/GetUserByName`).
3. Select the target device using `GET licence/GetLicenceByDeviceId`.
4. Choose **Renewal Type**: Yearly / Quarterly / Monthly.
   - System auto-calculates expiry date: +12 / +3 / +1 month(s) from today.
5. Enter Licence Number (must be unique) and Licence Type (app-configured).
6. Submit → `POST licence/SaveLicence`.

#### Renew Existing Licence
1. In the Licence list, click **Renew** on an expiring row.
2. `GET licence/RenewLicence?id=` resets the expiry date based on the stored Renewal Type.

---

## 5. Subscription Order (Order Service) Workflow

**Actors:** Admin, Super Admin, Sales Agent

**Steps:**

#### Create New Subscription
1. Navigate to **Order Service** module (`OrderServiceController`).
2. Select app type → customer list loads (`GET orderservice/GetAllCustomer?idApp=`).
3. Select customer → device list loads (`GET orderservice/GetAllDeviceId`) and pricing loads (`GET billing/GetPriceByApp`).
4. Select device(s), plan (Monthly / Quarterly / Yearly), vehicle type, country, start/end dates.
5. `OrderTotal` is auto-calculated from the selected devices' renewal prices.
6. Submit → `POST billing/SaveOrderServiceNew`.

#### Upload Payment Receipt
1. After order creation, open the **Upload Receipt** dialog.
2. Select image file → `POST billing/uploadImage` (multipart).

#### Mark as Paid
1. Click **Mark Paid** → confirmation prompt → `GET billing/MakeStatusPaid?orderId=&amount=`.

#### Send Payment Link
1. Click **Send Payment Link** → `GET billing/SendPaymentLink?orderId=&email=&appId=` → email sent to customer.

#### Adjust Service Dates
1. Click **Edit Dates** → adjust start/end dates → `GET orderservice/UpdateOrderServiceDates?orderId=&startDate=&endDate=`.

**Order Status State Machine:**
```
New Order Created
      │
      ▼
   Pending ──────────────────► Void
      │
      ▼
    Paid ──────────────────► Void
      │
      ▼
  Completed
```

---

## 6. Renewal Management (Batch Renewal) Workflow

**Actors:** Admin, Super Admin, Sales Agent, Distributor

**Steps:**
1. Navigate to **Renew Management** module (`RenewManagementController`).
2. Filter by Distributor, Sales Agent, Country, and Date range.
3. Locate the target customer from the list.
4. Click to expand → expiring device list loads (`GET billing/GetAllVehicleExpirebyUser?idUser=`).
5. Optionally send a reminder email: `POST billing/SendEmailNotification`.
6. Select devices and renewal plan → submit → `POST billing/SaveOrderServiceRenew`.

---

## 7. Wallet Top-Up & Payment Workflow

**Actors:** Admin, Super Admin

**Steps:**

#### Top-Up Wallet
1. Navigate to **Wallet Transaction** module (`WalletTransactionController`).
2. Select device ID, enter top-up amount, set payment type (Offline/Online).
3. Upload proof of payment receipt (optional).
4. Submit → `POST WalletTransaction/Savewallettransaction` + `POST WalletTransaction/uploadImage`.

#### Approve Top-Up
1. In the transaction list, click **Approve** → `GET WalletTransaction/ApproveTransaction?id=`.
2. Wallet balance is credited.

#### Use Wallet for Renewal
1. Click **Renew** on an approved top-up → `GET WalletTransaction/RenewTransaction?id=`.
2. Server deducts balance and creates a subscription renewal.

#### Void Transaction
1. Click **Void** → `GET WalletTransaction/VoidTransaction?id=`.
2. Transaction is cancelled and balance is not credited.

---

## 8. Real-Time Vehicle Tracking Workflow

**Actors:** Admin, Super Admin (Dashboard)

**Steps:**
1. `DashboardController.init()` loads vehicle list and initialises a Leaflet map.
2. For each device, a Socket.io listener is registered: `socket.on('{deviceId}BikeDeviceStatus', callback)`.
3. When a GPS event arrives over the socket:
   - `Latitude`, `Longitude`, `Speed`, `IsEngine`, `Direction`, `Date` are updated in memory.
   - The Leaflet map marker is updated to the new position.
   - Marker icon changes based on status: **Online** (green car), **Offline** (grey car), **Active** (blue car).
4. Admin can click a marker to view device details.
5. Dashboard counts (Today, This Week, This Month, This Year, All-Time) are loaded from `GET dashboard/GetDashboardData`.

**Icon Mapping:**
| Status | Icon (Standard) | Icon (Tracking App) |
|--------|-----------------|---------------------|
| Online | `icon-map-car-on2.png` | `locate-live.png` |
| Offline | `icon-map-car--off2.png` | `locate-disconnect.png` |
| Active | `icon-map-car-active2.png` | `locate-active.png` |

---

## 9. GPS Alarm Processing Workflow

**Actors:** Admin, Super Admin

**Steps:**
1. GPS hardware sends alarm events with a numeric alarm code.
2. Navigate to **Alarm** module (`AlarmController`).
3. DataTable loads alarm history from `GET gpsdata/GetAllAlarmNew` (server-side paginated).
4. Each alarm code is mapped to a human-readable label (see §3 of Alarm codes below).
5. **Fence alarms** (codes 66 and 6) additionally display the `FenceName`.
6. Admin can filter by DeviceId, date range, alarm code, and keyword.
7. Export available via `GET gpsdata/ExportAlarm`.

**Alarm Code Mappings:**
| Code | Description |
|------|-------------|
| 01 | SOS alarm |
| 02 | Line broken alarm |
| 03 | Door open alarm |
| 04 | Engine on alarm |
| 05 | Original triggering alarm |
| 10 | Low battery alarm |
| 11 | Over speed alarm |
| 12 | Movement alarm |
| 13 | Geo-fence alarm |
| 30 | Vibration alarm |
| 50 | External power cut alarm |
| 52 | Veer report |
| 60 | Fatigue driving alarm |
| 66 | Fence OUT |
| 6 | Fence IN |
| 71 | Crash alarm / Harsh Brake / Acceleration alarm |
| 81 | Fuel loss alarm |

---

## 10. Product Management Workflow

**Actors:** Admin, Super Admin

**Steps:**

#### Create Product
1. Navigate to **Product** module (`ProductController`).
2. Fill in basic details: Name, SKU, Description, Brand.
3. Fill in pricing: Regular Price, Old Price, Product Cost; optionally Special Price with date range.
4. Fill in inventory: Stock Quantity, Min Stock Quantity, Backorder Mode.
5. Fill in shipping: Weight, Dimensions, IsFreeShipping, ShipSeparately.
6. Submit → `POST product/CreateProductPanel` → returns new product ID.
7. **Save & Continue** flow:
   a. Add product images → `POST productPictureMapping/CreateProductPictureMapping`.
   b. Add product attributes → `POST productAttributeMapping/CreateProductAttributeMapping`.
   c. Add attribute combinations (variants) → `POST productAttributeCombination/CreateProductAttributeCombination`.

#### Publish / Unpublish
1. Select products using filters (Name, Category, Manufacturer, Store, Vendor, SKU, ProductType, Published status).
2. **Publish All** → `GET product/PublishAllProduct?params` (batch operation).

#### Import / Export
- Download template: `GET product/DownloadExcelTemplate`.
- Bulk import: `POST product/ImportProductFromExcel` (multipart).
- Export unpublished: `GET product/ExportUnpublishedProduct`.

---

## 11. Customer & User Onboarding Workflow

**Actors:** Admin, Super Admin

**Steps:**

#### Create Customer
1. Navigate to **Customer** module (`CustomerController`).
2. Enter email — `setUsernameValue(email)` auto-populates the username field.
3. Fill in phone, country, gender, password and confirm password.
4. Select role(s).
5. Submit → `POST user/SaveCustomer`.
6. Customer can be assigned devices after creation via the **Vehicles** module.

#### Create Admin User
1. Navigate to **User** module (`UserController`).
2. Fill in email, phone, country, state, city, gender.
3. Select role(s).
4. Optionally upload a profile picture (cropped before upload → `POST user/uploadImage`).
5. Submit → `POST user/SaveUserNew`.

---

## 12. Distributor Hierarchy Setup Workflow

**Actors:** Super Admin

**Steps:**
1. Create a **Distributor** user via the User module.
2. Navigate to **Assign Distributor** (`AssignDistributorController`) → assign a Distributor to a country/app.
3. Navigate to **Assign Retailer** (`AssignRetailerController`) → assign Retailers under the Distributor.
4. Navigate to **Assign Agent Retailer** (`AssignAgentRetailerController`) → assign Sales Agents under the Retailer.
5. Sales Agents can now be assigned GPS devices (see Workflow 3) and manage renewals for their customers.

---

## 13. OTA Device Configuration Workflow

**Actors:** Admin, Super Admin

**Steps:**
1. Navigate to **Vehicle Monitor** module (`VehicleMonitorController`).
2. Use the chip autocomplete to select one or more target device IDs (`GET vehicles/GetAllVehicleDeviceId`).
3. Fill in any subset of configuration settings: MaxSpeed, SleepMode, GPRSInterval, GPRSStopInterval, Arm, OdoMeter, HeartbeatInterval, ACC.
4. Click **Save Settings** → `GET socketapi/SendCommandToDevice?objDevice[]=...&params`.
5. Server relays AT-commands to device(s) over Socket.IO.
6. On success, form resets.

**Note:** Partial updates are supported — unfilled fields are ignored by device firmware. There is no confirmation dialog.

---

## 14. Password Reset Workflow

**Actors:** Any user

**Steps:**

#### Self-Service via Login Page
1. Navigate to **Forgot Password** module (`ForgotpasswordController`).
2. Enter registered email.
3. Submit → server sends password reset email.

#### Admin Reset
1. In the **User** or **Customer** list, click **Reset Password** action.
2. `ResetPassword` dialog → enter new password → `GET user/changeUserPassword`.
