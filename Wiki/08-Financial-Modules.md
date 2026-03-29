# Financial Modules

Covers: `OrderService` (OrderServiceController), `Wallet` (WalletController), `WalletTransaction` (WalletTransactionController), `RenewManagement` (RenewManagementController)

---

## 1. Order Service — `OrderServiceController`

### Module Purpose
Full lifecycle management of GPS device service subscriptions (orders). Handles initial order creation, renewals, payment marking, date adjustments, payment receipt uploads, and payment link generation.

### Business Workflow (Step-by-Step)

#### Create New Order
1. Select app → load customer list (`orderservice/GetAllCustomer?idApp=`).
2. Select customer (or use email autocomplete `user/GetUserByEmail`) → load their devices (`orderservice/GetAllDeviceId`) and pricing (`billing/GetPriceByApp`), and existing expiring vehicle list (`billing/GetAllVehicleExpirebyUser`).
3. Select device(s), plan, start/end dates, vehicle type, country.
4. Submit → `POST billing/SaveOrderServiceNew`.
5. Success → reload list.

#### Renew Existing Order
1. In DataTable → click Renew action on a row.
2. `GET orderservice/RenewOrderService?orderId=` → creates a renewal record.

#### Mark as Paid
1. Click "Mark Paid" → `GET billing/MakeStatusPaid?orderId=&amount=`.

#### Update Service Dates
1. Admin adjusts start/end dates → `GET orderservice/UpdateOrderServiceDates?orderId=&startDate=&endDate=`.

#### Upload Payment Receipt
1. `UploadOrderPaymentReceipt` dialog → select image file → `POST billing/uploadImage` (multipart).

#### Send Payment Link
1. `OpenPaymentModal` dialog → `GET billing/SendPaymentLink?orderId=&email=`.

#### Create / Edit Direct Order Service
1. `POST orderservice/CreateOrderService` — alternative create path (used for manual/admin-created orders).
2. `POST orderservice/SaveOrderService` — save order edits.

#### Update Device on Order
1. `UpdateDeviceModal` dialog → `GET orderservice/UpdateDevice?orderId=&newDeviceId=`.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All apps and customers |
| Admin | Own app |
| Sales Agent | Own assigned customers (via SalesDashboard quick-renew) |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Customer must be selected | Autocomplete or dropdown required |
| Device must be selected | Dropdown populated after customer selection |
| Start date ≤ End date | Server-side |
| Vehicle type required | Dropdown required |
| Payment amount > 0 | Server-side on `MakeStatusPaid` |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appinfo/GetAllInfoList` | — | App filter |
| GET | `user/GetUserByEmail` | `email` | Customer autocomplete |
| GET | `user/GetUserById` | `idUser` | Load customer details |
| GET | `orderservice/GetAllCustomer` | `idApp` | Customer dropdown |
| GET | `orderservice/GetAllDeviceId` | `idApp`, `idUser` | Device list for customer |
| GET | `billing/GetPriceByApp` | `idUser`, `idApp` | Subscription pricing |
| GET | `billing/GetAllVehicleExpirebyUser` | `idUser` | Expiring vehicle list |
| GET | `vehicletype/GetAllActivevehicletype` | — | Vehicle type dropdown |
| GET | `country/GetAllCountry` | — | Country dropdown |
| GET | `orderservice/GetOrderServiceStatus` | — | Status options list |
| POST | `billing/SaveOrderServiceNew` | Full order object | Create new subscription order |
| GET | `orderservice/RenewOrderService` | `orderId`, `newEndDate` | Renew order |
| GET | `billing/MakeStatusPaid` | `orderId`, `amount` | Mark order as paid |
| GET | `orderservice/UpdateOrderServiceDates` | `orderId`, `startDate`, `endDate` | Adjust service dates |
| POST | `orderservice/CreateOrderService` | Order object | Create order (admin manual path) |
| POST | `orderservice/SaveOrderService` | Order object | Save order edits |
| POST | `billing/uploadImage` (multipart) | FormData with receipt image | Upload payment receipt |
| GET | `billing/SendPaymentLink` | `orderId`, `email`, `appId` | Send payment link to customer |
| GET | `orderservice/UpdateDevice` | `orderId`, `newDeviceId` | Swap device on existing order |

### Database Interactions
Reads: customer, device, pricing, vehicle type, country, order status records.  
Writes: order records (create/update), payment status, renewal records, receipt image path.

### Edge Cases
- `billing/SaveOrderServiceNew` and `orderservice/SaveOrderService` are two separate create paths — the former is the standard flow; the latter is used for admin-edited orders.
- `MakeStatusPaid` uses GET — any sensitive financial operation via GET bypasses CSRF protection patterns; relies on JWT header auth.
- Receipt upload is fire-and-forget after save — a failed upload does not roll back the order record.
- `SendPaymentLink` sends an email/link to the customer for self-service payment.

---

## 2. Wallet — `WalletController`

### Module Purpose
Read-only view of customer wallet balances across apps and countries. Used by admins to monitor prepaid credit balances.

### Business Workflow (Step-by-Step)
1. **Init:** Loads app list and country list.
2. **Filter:** Select app and/or country → DataTable refreshes.
3. **Export:** `window.location = WalletTransaction/ExportWallet?params` → downloads wallet balance report.

### Actor Interactions
- Admin, Super Admin — read-only.

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appinfo/GetAllInfoList` | — | App filter |
| GET | `country/GetAllCountry` | — | Country filter |
| DataTable | `WalletTransaction/GetAllWalletes` | `idApp`, `Country`, `StartDate`, `EndDate`, `search` | Server-side wallet balance list |
| GET (export) | `WalletTransaction/ExportWallet` | `StartDate`, `EndDate`, `Type`, `search`, `idApp`, `Country` | Download wallet report |

### Database Interactions
Reads: wallet balance records.  
Writes: None.

### Edge Cases
- `WalletTransaction/GetAllWalletes` vs `WalletTransaction/GetAllWallettransaction` — the former is balances; the latter is the transaction history (used in WalletTransaction module).

---

## 3. Wallet Transaction — `WalletTransactionController`

### Module Purpose
Manage wallet top-up transactions. Admins can create top-up requests, upload payment receipts, and approve, void, or use wallet credit for device renewals.

### Business Workflow (Step-by-Step)

#### Create Wallet Transaction
1. **Init:** Loads device IDs (`WalletTransaction/GetAllDeviceID`), app list, country list.
2. Select device ID, enter top-up amount.
3. Submit → `POST WalletTransaction/Savewallettransaction`.
4. **Upload receipt:** If receipt file attached → `POST WalletTransaction/uploadImage` (multipart).

#### List & Filter
1. DataTable (`WalletTransaction/GetAllWallettransaction`) filterable by app, country, status, date range.
2. Receipt thumbnails shown inline in the table (linked to `MediaUploads/WalletReceipt/` path).

#### Approve Transaction
1. Click Approve → confirmation → `GET WalletTransaction/ApproveTransaction?id=`.

#### Void / Cancel Transaction
1. Click Void → confirmation → `GET WalletTransaction/VoidTransaction?id=`.

#### Renew via Wallet
1. Click Renew → `GET WalletTransaction/RenewTransaction?id=` → uses wallet balance to renew a device subscription.

#### Export
- `window.location = WalletTransaction/ExportWalletTransaction?params` → downloads Excel report.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All transactions across all apps |
| Admin | Own app |
| Distributor | Own customer transactions |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Device ID required | Dropdown `required` |
| Amount must be > 0 | HTML `min="1"` |
| Receipt image type | Server-side on upload |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `WalletTransaction/GetAllDeviceID` | `idApp`, `UserId` | Device ID dropdown |
| GET | `appinfo/GetAllInfoList` | — | App filter |
| GET | `country/GetAllCountry` | — | Country filter |
| POST | `WalletTransaction/Savewallettransaction` | Transaction model | Create wallet top-up |
| POST | `WalletTransaction/uploadImage` (multipart) | FormData with receipt | Upload payment receipt |
| GET | `WalletTransaction/ApproveTransaction` | `id` | Approve top-up |
| GET | `WalletTransaction/VoidTransaction` | `id` | Void / cancel top-up |
| GET | `WalletTransaction/RenewTransaction` | `id` | Use wallet balance for renewal |
| DataTable | `WalletTransaction/GetAllWallettransaction` | `StartDate`, `EndDate`, `Status`, `search`, `idApp`, `idAppsearch`, `Country` | Transaction list |
| GET (export) | `WalletTransaction/ExportWalletTransaction` | Full filter params | Download transaction report |

### Database Interactions
Reads: wallet transaction records, device list, app/country list.  
Writes: transaction record (create), status update (approve/void), subscription renewal trigger.

### Edge Cases
- Receipt image is displayed inline in the DataTable using `ng-src` with an `err-src` fallback for broken images.
- `RenewTransaction` links the wallet balance directly to a subscription renewal — server must verify sufficient balance.
- Void after approval should be prevented server-side (workflow state machine).

---

## 4. Renew Management — `RenewManagementController`

### Module Purpose
Batch subscription renewal management tool. Allows admins and sales agents to view all expiring devices for a given customer and initiate bulk renewals with optional email notifications.

### Business Workflow (Step-by-Step)
1. **Init:** Loads app list, distributor list, sales agent list, country list.
2. **Filter:** Select distributor, sales agent, country, date range → find customers with expiring devices.
3. **View expiring devices:** `GET billing/GetAllVehicleExpirebyUser?idUser=` → loads device expiry list for selected user.
4. **Send email notification:** `POST billing/SendEmailNotification` with renewal reminder details.
5. **Renew:** Select devices and plan → `POST billing/SaveOrderServiceRenew`.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All distributors, agents, countries |
| Admin | Own app |
| Sales Agent | Own assigned customers |
| Distributor | Own customers |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| User must be selected before loading expiry list | Required step in workflow |
| At least one device must be selected for renewal | Client-side |
| Email template required before sending notification | Server-side |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appsetting/GetAllAppInfo` | — | App filter |
| GET | `assigndistributor/GetAllDistributor` | `appId`, `UserId` | Distributor filter |
| GET | `billing/GetAllSalesAgentRole` | `appId`, `distributorId` | Sales agent filter |
| GET | `country/GetAllCountry` | — | Country filter |
| GET | `billing/GetAllVehicleExpirebyUser` | `idUser` | Expiring vehicle list for user |
| POST | `billing/SendEmailNotification` | Renewal notification object | Send reminder email |
| POST | `billing/SaveOrderServiceRenew` | Renewal order object | Create renewal order |

### Database Interactions
Reads: distributor/agent/customer records, subscription expiry dates, email templates.  
Writes: renewal order records, email notification log.

### Edge Cases
- `billing/GetAllSalesAgentRole` is cascaded from the distributor selection — ensures only agents under the selected distributor are shown.
- Email notification can be sent independently of creating a renewal order (advisory email vs. confirmed renewal).
- Same `billing/SaveOrderServiceRenew` endpoint is shared with `SalesDashboard` quick-renew and the `OpenRemark` dialog.
