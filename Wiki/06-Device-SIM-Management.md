# Device & SIM Management Modules

Covers: `SIM` (SIMController), `AssignDevice` (AssignDeviceController), `TransferDevice` (TransferDeviceController), `AssignLicence` (AssignLicenceController)

---

## 1. SIM Management — `SIMController`

### Module Purpose
Manage the SIM card inventory: register new SIM cards, assign them to Telco providers and apps, prevent duplicates, and support bulk import via Excel.

### Business Workflow (Step-by-Step)
1. **Init:** Loads Telco company list (`telco/GetAllCompany`) and app info list.
2. **List:** Server-side DataTable shows all SIM cards.
3. **Add / Edit SIM:**
   a. Fill SIM number, Telco provider, App, optional notes.
   b. **Duplicate check:** Before saving → `GET sim/CheckSimDetail?simNumber=...` verifies uniqueness.
   c. If duplicate found → show error toast, halt.
   d. If unique → `POST sim/SaveSIMInfo`.
4. **Delete SIM:** Confirmation dialog → `GET sim/DeleteSIMInfo?id=`.
5. **Bulk import:** Opens `ImportSIM` dialog → user selects Excel file → `POST sim/uploadExcelDevice` (multipart).

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | Full CRUD across all apps |
| Admin | Full CRUD for own app |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| SIM number required | HTML `required` |
| SIM number must be unique | Client pre-check via `sim/CheckSimDetail` |
| Telco provider required | Dropdown `required` |
| Excel file must be valid format | Server-side validation on upload |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `telco/GetAllCompany` | — | Telco provider dropdown |
| GET | `appinfo/GetAllInfoList` | — | App filter |
| GET | `sim/CheckSimDetail` | `simNumber`, `idApp` | Pre-save duplicate check |
| POST | `sim/SaveSIMInfo` | Full SIM model | Create / update SIM card |
| GET | `sim/DeleteSIMInfo` | `id` | Delete SIM card |
| POST | `sim/uploadExcelDevice` (multipart) | FormData with Excel file | Bulk import SIM cards |

### Database Interactions
Reads: SIM records, Telco list, app list.  
Writes: SIM record (create/update), soft-delete; bulk insert on Excel import.

### Edge Cases
- `sim/GetAllSIMInfo` (list) is conditionally replaced by `sim/GetAllSIMInfoForTrackingApp` when the active app is the Tracking variant — used by the Trackers module.
- Bulk import template format is server-defined — incorrect column headers will fail silently or return a server error.
- `Content-Type: undefined` on multipart upload lets the browser set the correct boundary automatically.

---

## 2. Assign Device — `AssignDeviceController`

### Module Purpose
Assign unallocated GPS devices from the inventory to sales agents or retailers. Supports single assignment via UI form and bulk assignment via Excel file import.

### Business Workflow (Step-by-Step)
1. **Init:** Loads app list (`appsetting/GetAllAppInfo`).
2. **Autocomplete Sales Agent:** As user types → `GET admin/getAutocompleteSalesAgentNew?query=...` returns matching agents.
3. **Select devices:** Admin selects one or more unassigned device IMEIs from a list or enters them.
4. **Assign:** `POST admin/assignDevice` with `{salesAgentId, deviceIds[], appId}`.
5. **Bulk import:** Opens `ImportAssignDevice` dialog:
   a. Loads app list.
   b. User uploads Excel file → `POST admin/assignDeviceByExcelNew` (multipart).
   c. Server processes the file and assigns devices in batch.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All apps; can assign to any agent |
| Admin | Own app |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Sales Agent must be selected | Autocomplete required before submit |
| At least one device must be selected | Client-side list validation |
| Excel template must match expected format | Server-side on upload |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appsetting/GetAllAppInfo` | — | App dropdown |
| GET | `admin/getAutocompleteSalesAgentNew` | `query`, `appId` | Sales agent search autocomplete |
| POST | `admin/assignDevice` | `{salesAgentId, deviceIds, appId}` | Assign device(s) to agent |
| POST | `admin/assignDeviceByExcelNew` (multipart) | FormData with Excel | Bulk assign via Excel |

### Database Interactions
Reads: app list, sales agent list, unassigned device pool.  
Writes: device-agent assignment records.

### Edge Cases
- Devices must be in "unassigned" state before assignment — assigning an already-assigned device may fail server-side.
- Bulk Excel import errors (duplicate IMEI, unknown agent) are typically returned as a summary message from the server.

---

## 3. Transfer Device — `TransferDeviceController`

### Module Purpose
Transfer ownership of a GPS device from one user/customer to another. Used when a device physically moves between users or when customer records need to be reorganised.

### Business Workflow (Step-by-Step)
1. **List unassigned devices:** `GET vehicles/GetAllNotAssignDevice` → displays devices available for transfer.
2. **Select target device:** Admin opens `DeviceDetail` dialog.
3. **Select destination user:** Admin selects the new owner.
4. **Confirm transfer:** `GET vehicles/TransferDevicetoUser?deviceId=&userId=`.
5. Success → toast confirmation + list refresh.

### Actor Interactions
- Super Admin, Admin.

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Target device must be unassigned | List filtered to unassigned only |
| Destination user must be selected | Required in dialog |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `vehicles/GetAllNotAssignDevice` | — | List of unassigned devices |
| GET | `vehicles/TransferDevicetoUser` | `deviceId`, `userId` | Execute device ownership transfer |

### Database Interactions
Reads: unassigned device list, user list.  
Writes: updates device-user ownership record; moves device out of "unassigned" pool.

### Edge Cases
- If a device has an active subscription/licence attached, the transfer may need to also reassign those — handled server-side.
- `GetAllNotAssignDevice` also used by the `AssignLicence` module's `DeviceDetail` dialog for the same purpose.

---

## 4. Assign Licence — `AssignLicenceController`

### Module Purpose
Manage platform access licences assigned to user accounts. Covers licence creation (batch number generation), assignment to devices, renewal, swap between devices, and deletion. Licences control which devices a customer's subscription covers.

### Business Workflow (Step-by-Step)

#### Create Licence Numbers (LicenceModel dialog)
1. Open `LicenceModel` dialog → select app, enter quantity.
2. `GET licence/CreateLicenceNumbers?quantity=&idApp=` → server generates licence number batch.
3. Licence numbers saved to the pool for future assignment.

#### Assign Licence to User
1. **Search user:** Autocomplete `GET user/GetUserByName?query=` → load full details with `GET user/GetUserById`.
2. **View licence pool:** `GET licence/GetLienceToAssignDevice?idUser=&idApp=` → shows available licences.
3. **Save licence detail:** `GET licence/SaveLicenceDetail?params` → links licence to user/device.
4. **Renewal:**
   a. `GET licence/changestatusrenewal?licenceId=` → mark licence for renewal.
   b. `POST licence/SaveOrderService_LicenceRenewal` → create renewal order.
5. **Swap device (DeviceDetail dialog):** `GET licence/SwipeDeviceAdmin?licenceId=&newDeviceId=` → move licence to different device.
6. **Delete licence:** Confirmation → `GET licence/DeleteDeviceLicence?licenceId=`.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | Global; all apps and users |
| Admin | Own app |
| Sales Agent | View assigned customer licences |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| User must be selected via autocomplete | Required before licence operations |
| Licence quantity must be > 0 | HTML `required` + `min="1"` |
| App must be selected before generating licences | Dropdown required in dialog |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appsetting/GetAllAppInfo` | — | App filter |
| GET | `user/GetUserByName` | `query` | User search autocomplete |
| GET | `user/GetUserById` | `idUser` | Load user details |
| GET | `licence/GetLienceToAssignDevice` | `idUser`, `idApp` | Licence pool for user |
| GET | `licence/CreateLicenceNumbers` | `quantity`, `idApp` | Generate new licence batch |
| GET | `licence/SaveLicenceDetail` | Full licence model | Save licence assignment |
| GET | `licence/changestatusrenewal` | `licenceId` | Mark licence for renewal |
| POST | `licence/SaveOrderService_LicenceRenewal` | Renewal order object | Create licence renewal order |
| GET | `licence/SwipeDeviceAdmin` | `licenceId`, `newDeviceId` | Swap licence to different device |
| GET | `licence/DeleteDeviceLicence` | `licenceId` | Delete licence |
| GET | `appinfo/GetAllInfoList` | — | App dropdown in create-licence dialog |

### Database Interactions
Reads: user records, licence records, device records, app list.  
Writes: licence record (create/assign/renew/delete), order service record on renewal, licence-device mapping on swap.

### Edge Cases
- `licence/SaveLicenceDetail` uses GET with params — same unusual pattern as `bike/SaveVehicle`.
- Licence swap (`SwipeDeviceAdmin`) changes the device association without creating a new licence record — audit trail relies on server-side logging.
- `AuditLogLicense` module provides a separate audit trail for all licence operations (see [Audit Modules](./10-Audit-Warranty-Sharing.md)).
- Renewal creates an `OrderService` record — financial reconciliation tracked through the Order Service module.
