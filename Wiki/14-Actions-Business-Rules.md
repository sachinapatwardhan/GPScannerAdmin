# Actions, Business Rules & Validations

This page documents all significant controller actions across the GPScannerAdmin system, together with the business rules and validation logic applied at each step. Validation is primarily enforced client-side (AngularJS form validation) with additional server-side enforcement via the REST API.

---

## Cross-Cutting Rules (Applied System-Wide)

### Role-Based Access Control (RBAC)
| Check | Meaning |
|-------|---------|
| `$rootScope.FlgAddedAccess` | User may create new records in this module |
| `$rootScope.FlgModifiedAccess` | User may edit existing records |
| `$rootScope.FlgDeletedAccess` | User may delete records |
| `$rootScope.CheckPageRights()` | Called on every module init; redirects if user lacks access |

### App Scoping
- Every list/create/update operation includes `idApp` (from `$rootScope.appId` or `$cookieStore`).
- **Super Admin** can set `idApp` to any value.
- **Non-Super Admin** has `idApp` fixed to their own app — they cannot view or modify data for other tenants.

### Deletion Pattern
- All delete actions require a confirmation dialog (`$mdDialog.confirm`) before the API call is made.
- Most deletes are soft-deletes on the server side.

### DataTable Pagination
- All list views use server-side DataTables with a default page size of 25.
- `search` parameter is passed with every DataTable request for server-side keyword filtering.
- `CountryList` and `UserCountry` cookies are sent for row-level country-based security.

---

## 1. Authentication

### `Login(o, form, isLogout)`
**Business Rules:**
- Credentials sent to `GET account/loginNew?username=&password=&appId=`.
- If **RememberMe** is checked, `username` and `password` are stored as plain-text cookies — note this is a security trade-off for UX.
- Response `UserRoles` determines redirect destination:
  - `Distributor` → `/DistributorTrackers`
  - `Sales Agent` → `/SalesDashboard`
  - All others → `/Dashboard`
- `DistributorId` overrides `UserId` when the user is a Distributor Sub-User.
- All session data (`token`, `UserId`, `UserRoles`, etc.) is stored in `$cookieStore` and `localStorage`.

**Validations:**
- Form must be valid (`$scope.loginForm.$valid`) before submission.
- Both username and password fields are required (HTML `required`).

---

## 2. User Management

### `CreateUser(o)`
**Business Rules:**
- `createddate` is set to `new Date()` on new records.
- `modifieddate` is updated on every edit.
- At least one `roleId` must be selected.
- If an image is attached, it is cropped via `CropImageToFile()` before upload to `POST user/uploadImage`.
- `idApp` is fixed to the admin's own app for non-Super Admin users.

**Validations:**
- Email is required and must be a valid email format (HTML `type="email"`).
- Phone number is required (format varies by app).
- At least one role must be selected.
- Profile image size and format constraints enforced server-side on upload.

### `ChangeUserStatus(UserId)`
**Business Rules:**
- Toggles `IsActive` between `0` and `1` via `GET user/changeUserStatus?UserId=`.
- No confirmation dialog — status flip is immediate.

### `SetSuspendStatus(id, flg)`
**Business Rules:**
- `flg=1` suspends the user; `flg=0` reinstates.
- Suspended users cannot log in.

### `ResetPassword(ev, id)`
**Business Rules:**
- Opens a dialog; admin enters the new password.
- Submits to `GET user/changeUserPassword?id=&password=`.
- No old-password verification required (admin override).

---

## 3. Customer Management

### `CreateCustomer(o)`
**Business Rules:**
- `setUsernameValue(email)` auto-copies the email value into the `username` field.
- Customers cannot be deleted if they have active devices (enforced server-side).
- `idApp` is fixed for non-Super Admin; Super Admin can choose any app.

**Validations:**
- Email required and unique (enforced server-side).
- Password and `confirmpassword` must match.
- Password minimum length enforced (server-side).
- Country field is required.
- Phone number format validation.

### `DeleteCustomer(id)`
**Business Rules:**
- Confirmation dialog required.
- Blocked server-side if customer has associated active vehicles.

---

## 4. Vehicle Management

### `CreateVehicleDetails(o)`
**Business Rules:**
- `deviceid` is derived from the last characters of the IMEI (`GetDeviceId(IMEI)`).
- Customer is selected via email autocomplete; `iduser` is populated from the selection result — it cannot be typed manually.
- IMEI lookup (`GET PetDevice/GetGPSDeviceById?IMEI=`) pre-fills device fields if the hardware record exists; blank results do not block submission.
- `renewaldate` and `HandshakDatetime` are nullable — form can be saved without them.
- Submitted via `GET bike/SaveVehicle` (all parameters in query string — URL length limits apply for large payloads).

**Validations:**
- `flgValidation` flag must be `true` before form submission.
- Vehicle type (`idType`) is required.
- Customer (`iduser`) must be selected via autocomplete.
- IMEI format validation.

### `UpdateExpiryDate()`
**Business Rules:**
- Directly updates the renewal/expiry date without recreating the vehicle record.
- Submits to `GET vehicles/UpdateExpiryDate?idVehicle=&expiryDate=`.

### `DeleteVehicle(id)`
**Business Rules:**
- Confirmation dialog required.
- Soft-delete on server side.

---

## 5. GPS Device (Tracker) Management

### `CreateTracker(o)` / `SaveGPSDevice`
**Business Rules:**
- For the **Tracking** app, device `Type` is auto-set to `'MT05'`.
- SIM endpoint differs based on `AppName`: `sim/GetAllSIMInfoForTrackingApp` for the Tracking app, `sim/GetAllSIMInfo` for others.
- Sales Agent assignment is required.

**Validations:**
- IMEI is required.
- SIM card selection is required.
- App assignment is required.
- Sales Agent selection is required.

### `UpdateStatus(id, status)`
**Business Rules:**
- Toggles device between active (`1`) and inactive (`0`).
- Inactive devices stop receiving GPS data on the server.

---

## 6. SIM Card Management

### `SaveSIM(o)`
**Business Rules:**
- `Status` defaults to `'-1'`.
- Telecom company must be selected.
- `SpoilDate` tracks the SIM expiry — separate from the device subscription.

**Validations:**
- `SerialNum` and `PhoneNum` are required.
- `idTelCo` required.

---

## 7. Licence Management

### `AssignLicence()` / `SaveLicence(o)`
**Business Rules:**
- Expiry date is auto-calculated from `LicenceRenewalType`:
  - **Yearly** → current date + 12 months
  - **Quarterly** → current date + 3 months
  - **Monthly** → current date + 1 month
- User must be found via autocomplete before a licence can be assigned.
- A device must be selected before assignment.
- Duplicate (`LicenceNo`) is rejected server-side.
- A device must be unassigned before being reassigned to another licence.
- Licence cannot be assigned to an inactive user.

**Validations:**
- `LicenceNo` is required and must be unique.
- Device selection is required.
- User selection is required.
- `LicenceRenewalType` is required (dropdown `required`).
- `LicenceType` is required.

### `renewal(id)`
**Business Rules:**
- Resets expiry date based on stored `LicenceRenewalType`.
- Blocked for licences with a past expiry date that has not been renewed (enforced server-side).

---

## 8. Device Assignment (to Sales Agents)

### `assignDevice(i)`
**Business Rules:**
- A device can belong to only one agent at a time — assigning it to a new agent automatically releases it from the previous assignment (server-side logic).
- The checkbox is disabled (`isDisabled = true`) while the API call is in progress to prevent duplicate submissions.
- Sales Agents can only be assigned devices within their app context.

**Validations:**
- An agent must be selected before any checkbox can be checked; the checkbox column is rendered as disabled until an agent is chosen.

---

## 9. Order Service (Subscription)

### `SaveOrderServiceNew` / `CreateOrderService`
**Business Rules:**
- `OrderTotal` is the sum of `RenewPrice` values for all selected devices.
- Pricing is loaded per-customer and per-app via `GET billing/GetPriceByApp`.
- Device list is scoped to the selected customer and app.
- Start date and end date are required; `StartDate ≤ EndDate` enforced server-side.
- Vehicle type is required.

**Validations:**
- Customer selection required.
- Device selection required.
- Vehicle type required.
- Start date ≤ End date (server-side).
- Payment amount > 0 on `MakeStatusPaid` (server-side).

### `MakeStatusPaid(orderId, amount)`
**Business Rules:**
- Transitions order status from **Pending** → **Paid**.
- Uses GET method — relies on JWT header for authentication (no CSRF protection).
- A failed receipt upload does not roll back the order record.

### `RenewOrderService(id)`
**Business Rules:**
- Creates a new renewal record linked to the original order.
- End date is extended based on the original subscription plan.

### `UpdateOrderServiceDates(orderId, startDate, endDate)`
**Business Rules:**
- Admin can manually adjust service dates for an existing order.
- `StartDate ≤ EndDate` enforced.

### `SendPaymentLink(orderId, email, appId)`
**Business Rules:**
- Sends an email to the customer with a self-service payment link.
- Does not change order status; order remains Pending until `MakeStatusPaid` is called.

**Order Status Transitions:**
```
[Created] → Pending
Pending   → Paid       (via MakeStatusPaid)
Pending   → Void       (cancellation)
Paid      → Completed  (after service delivery confirmed)
Paid      → Void       (refund / cancellation)
```

---

## 10. Wallet Transactions

### `CreateWallet(o)` / `Savewallettransaction`
**Business Rules:**
- `Amount` must be a positive numeric value (`min="1"` enforced by HTML).
- `Type` is either `'Credit'` (top-up/refund) or `'Debit'` (payment).
- `PaymentType` can be `'Offline'` or `'Online'`.
- Country is set from user session context (`$cookieStore.get('UserCountry')`).
- Receipt/proof image upload is optional but stored if provided.
- `OrderNumber` must be unique (server-side enforcement).

**Validations:**
- `DeviceId` is required (dropdown `required`).
- `Amount > 0` (HTML `min="1"`).
- `Type` required (dropdown).

### `ChangeStatus(id)` / `ApproveTransaction`
**Business Rules:**
- Sets `IsPaymentSuccess = 1`; wallet balance is credited.
- Irreversible once approved (void must be used to cancel).

### `ChangeStatusVoid(id)` / `VoidTransaction`
**Business Rules:**
- Cancels/voids the transaction.
- Voiding after approval should be blocked server-side (state machine enforcement).
- Balance is not credited/debited once voided.

### `RenewOrderService(id)` / `RenewTransaction`
**Business Rules:**
- Uses the wallet balance to pay for a device subscription renewal.
- Server must verify sufficient balance before processing.

---

## 11. Renewal Management

### `SaveOrderServiceRenew`
**Business Rules:**
- At least one device must be selected for renewal (client-side check).
- User must be identified before loading the expiry device list.
- Email notification (`POST billing/SendEmailNotification`) can be sent independently of creating the renewal order.
- Cascaded filtering: Distributor → Sales Agent → Customer → Device (each level filters the next).

**Validations:**
- User selection required.
- At least one device selected.
- Plan/renewal type required.

---

## 12. Product Management

### `CreateProductPanel(form, model, saveandcontinue)`
**Business Rules:**
- Returns a product ID on creation; used in **Save & Continue** to subsequently add images, attributes, and combinations.
- Special price requires both start and end dates; `SpecialPriceStartDate < SpecialPriceEndDate` (server-side).
- Stock quantities must be ≥ 0.
- `BackorderModeId` controls behaviour when stock hits zero.

**Validations:**
- Name and SKU are required.
- Price ≥ 0.
- Special price date range: start < end.
- Stock quantity ≥ 0.

### `CreateProductAttribute(model)` / `SaveProductAttributeMapping`
**Business Rules:**
- Attributes are global; mappings link an attribute to a specific product.
- `IsRequired` flag makes customer attribute selection mandatory on the storefront.

### `CreateProductAttributeCombination`
**Business Rules:**
- Combination is serialised as `AttributesXml` in the format `<Attributes><ProductAttribute id="…"><ProductAttributeValue><Value>…</Value></ProductAttributeValue></ProductAttribute></Attributes>`.
- Each combination can have its own SKU, stock quantity, and price.
- A tier price entry is created alongside the combination.

### `PublishAllProduct()`
**Business Rules:**
- Batch operation — publishes all products matching the current search filters.
- `Published = true` makes the product visible on the storefront.

---

## 13. OTA Device Configuration (Vehicle Monitor)

### `savesetting()` → `SendCommandToDevice`
**Business Rules:**
- At least one device must be in `$scope.DeviceList` (client-side check: `DeviceList.length > 0`).
- Partial updates are supported — null/empty fields are ignored by device firmware.
- Command is sent immediately with no confirmation dialog.
- Super Admin passes `idApp = ''` to load all devices.

**Validations:**
- At least one device must be selected before the Save button is enabled.

---

## 14. Alarm Management

### `GetAllAlarm(IsUpdate)` / `ExportAlarm`
**Business Rules:**
- Fence alarms (codes `66` and `6`) append `FenceName` to the alarm label.
- Date fields use epoch timestamp × 1000 for JavaScript Date conversion.
- Export includes `TimeZone` and `CurrentOffset` parameters for timezone-correct timestamps.

---

## 15. API Access Management

### `CreateApiAccess(o)` / `SaveAccessClient`
**Business Rules:**
- `IsActive` defaults to `1` (active) on create.
- `FlgModifiedAccess` must be true for edit/add operations.
- `FlgDeletedAccess` must be true for delete operations.

### `UpdateStatus(id)`
**Business Rules:**
- Toggles `IsActive` between `0` and `1`.
- No confirmation dialog.

---

## 16. Country / State / City Management

### `CreateCountry(o)` / `SaveCountry`
**Business Rules:**
- `CreatedDate` is set on new records.
- `ModifyDate` is updated on every subsequent edit.
- `Seq` controls the display sort order (default `0`).

**Validations:**
- `Code`, `Country`, and `ShortName` are required.

### `DeleteCountry(id)`
**Business Rules:**
- Confirmation dialog required.
- Server-side referential integrity prevents deletion if country is referenced by users, vehicles, or other entities.

---

## 17. App Version / Settings

### `SaveAppVersion(o)` / `SaveAppVesionInfo` *(endpoint name as in codebase)*
**Business Rules:**
- Separate iOS and Android version fields with corresponding download URLs.
- `UpdateAppText` is the message shown in-app when a new version is available.

**Validations:**
- `Name` (app identifier) required.
- `AndroidVersion` and `IOSVersion` required.
- `AndroidURL` and `IOSURL` must be valid URLs (server-side).

---

## 18. Device Renew Price

### `SaveDevcieRenewPrice(o)` *(endpoint name as in codebase)*
**Business Rules:**
- A price entry is scoped to one Sales Agent (`IdUser`) and one Device Type (`Type`) within an app.
- Duplicate `(IdUser, Type)` combinations within the same app are rejected (server-side).
- Price must be a positive numeric value.
- This price is used when calculating `OrderTotal` in the Order Service workflow.

**Validations:**
- Agent selection required.
- Device type required.
- Price > 0 (numeric input with `min` constraint).

---

## 19. Transfer Device

### `TransferDevice(deviceId, newUserId)`
**Business Rules:**
- Only devices with a valid device ID can be transferred.
- Sales Agents can only transfer devices that are currently assigned to them.
- Transfer reassigns the device to the new user and updates the vehicle record.

**Validations:**
- Target user must be selected before transfer.
- Device must be currently unassigned or assigned to the requesting Sales Agent.

---

## 20. Shared Vehicle

### `ShareVehicle(vehicleId, userId, startDate, endDate)`
**Business Rules:**
- A vehicle can be shared with another user for a defined date range.
- `StartDate ≤ EndDate` enforced.
- Sharing can be deactivated by setting `IsActive = 0`.

**Validations:**
- Target user required.
- `StartDate` required.
- `EndDate ≥ StartDate`.

---

## Summary of Validation Patterns

| Pattern | Where Used |
|---------|-----------|
| HTML `required` attribute | All form fields marked as mandatory |
| AngularJS `$valid` form gate | Prevents submission if any required field is empty or invalid |
| `flgValidation` boolean flag | Vehicle form — additional custom validation gate |
| Autocomplete-required fields | Customer (vehicle owner), User (licence), Sales Agent (device assignment) — cannot be typed, must be selected from search results |
| Date range: `start ≤ end` | OrderService dates, SpecialPrice dates, SharedVehicle dates |
| Amount `> 0` / `≥ 0` | Wallet transaction amount, product price, stock quantity |
| Unique field constraints | Email (User/Customer), LicenceNo, OrderNumber — enforced server-side |
| Confirmation dialog (`$mdDialog.confirm`) | All delete operations, status changes requiring acknowledgement |
| Role/permission flag checks | `FlgAddedAccess`, `FlgModifiedAccess`, `FlgDeletedAccess` — UI hides buttons; server enforces too |
| App scoping | `idApp` fixed for non-Super Admin; Super Admin can freely select |
| Checkbox disabled during API call | Device assignment — prevents double-submission |
| Soft-delete pattern | Vehicles, GPS Devices — `IsDelete = 1` rather than physical removal |
