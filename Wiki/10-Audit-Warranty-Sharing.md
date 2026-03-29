# Audit, Warranty & Vehicle Sharing Modules

Covers: `AuditLog` (AuditLogController), `AuditLogLicense`, `WarrantyDevice` (WarrantyDeviceController), `WarrantySIM` (WarrantySIMController), `SharedVehicle` (SharedVehicleController)

---

## 1. Audit Log — `AuditLogController`

### Module Purpose
Read-only compliance and accountability log. Records every significant action performed across the system (logins, creates, updates, deletes) with actor identity, timestamp, and description. Used for security auditing and dispute resolution.

### Business Workflow (Step-by-Step)
1. **View log:** DataTable (`auditlog/GetAllAditlog`) loads paginated audit entries sorted newest first.
2. **Search:** Free-text search across all log fields.
3. **Filter:** By date range, actor, action type (server-side).

### DataTable Columns (typical)
| Column | Description |
|--------|-------------|
| Date | Timestamp of the action |
| User | Actor who performed the action |
| Module | System module affected |
| Action | Type of operation (Create, Update, Delete, Login) |
| Description | Detail of what changed |

### Actor Interactions
- Super Admin, Admin — read-only access.

### Validation Rules
- No write operations; no user-input validation.

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| DataTable | `auditlog/GetAllAditlog` | `search`, `StartDate`, `EndDate`, pagination params | Server-side paginated audit log |

### Database Interactions
Reads: audit log records.  
Writes: None — writes are performed server-side by middleware/interceptors on every qualifying action.

### Edge Cases
- Audit records should be immutable — no edit or delete exposed in this module.
- Log volume can grow very large in high-usage deployments; server-side pagination is essential.
- Note the typo in the endpoint: `GetAllAditlog` (not `GetAllAuditlog`) — this is the actual endpoint name.

---

## 2. Audit Log — License — `AuditLogLicense`

### Module Purpose
Specialised audit trail specifically for licence-related operations (licence creation, assignment, renewal, swap, deletion). Provides a separate, focused view for compliance around the licence lifecycle.

### Business Workflow (Step-by-Step)
1. **View log:** DataTable (`licence/GetAllLiacenceAuditlog`) shows licence operation history.
2. Filterable by device, licence number, date range.

### Actor Interactions
- Super Admin, Admin — read-only.

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| DataTable | `licence/GetAllLiacenceAuditlog` | `search`, pagination params | Server-side paginated licence audit log |

### Database Interactions
Reads: licence audit records.  
Writes: None.

### Edge Cases
- Endpoint name contains a typo: `GetAllLiacenceAuditlog` (not `GetAllLicenceAuditlog`).
- All licence operations from `AssignLicence` module should appear here: creates, swaps, renewals, deletions.

---

## 3. Warranty Device — `WarrantyDeviceController`

### Module Purpose
Manage GPS device warranty replacement requests. When a physical GPS device is found to be defective, this module facilitates swapping it with a new device while preserving the customer's vehicle record and subscription.

### Business Workflow (Step-by-Step)
1. **Init:**
   - Load defective (old) device list: `POST warranty/GetAllOldVehicle`.
   - Load replacement (new) device list: `POST warranty/GetAllNewVehicle`.
   - Load app list.
2. **Select defective device:** Admin picks the IMEI of the device to replace from the "old" list.
3. **Select replacement device:** Admin picks the IMEI of the new device from the "new" (unassigned) list.
4. **Confirm swap:** `POST warranty/SaveWarrantyReplaceDevice`:
   - Server transfers all associations (vehicle record, subscription, customer link) from old IMEI to new IMEI.
   - Old device marked as defective/replaced.
5. **Success:** Toast confirmation + lists refresh.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All devices |
| Admin | Own app devices |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Defective device must be selected | Dropdown required |
| Replacement device must be selected | Dropdown required |
| Replacement device must be unassigned | Server-side validation |
| Both devices cannot be the same | Server-side validation |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| POST | `warranty/GetAllOldVehicle` | `{appId, ...}` | List of defective/replaceable devices |
| POST | `warranty/GetAllNewVehicle` | `{appId, ...}` | List of replacement devices |
| GET | `appinfo/GetAllInfoList` | — | App filter |
| POST | `warranty/SaveWarrantyReplaceDevice` | `{oldDeviceId, newDeviceId, reason, ...}` | Execute device swap |

### Database Interactions
Reads: device records (old and new pools), vehicle records, subscription records.  
Writes: updates all associations from old IMEI to new IMEI; marks old device as replaced; creates warranty replacement audit record.

### Edge Cases
- `GetAllOldVehicle` and `GetAllNewVehicle` both use POST — unusual for read operations; may be to send complex filter bodies.
- The swap must be atomic server-side — partial failure (old marked replaced but new not assigned) would be catastrophic; relies on server transaction.
- Warranty reason/notes may be required for compliance tracking.

---

## 4. Warranty SIM — `WarrantySIMController`

### Module Purpose
Manage SIM card warranty replacement requests. When a SIM card fails or is compromised, this module handles swapping it with a new SIM while preserving the device and subscription associations.

### Business Workflow (Step-by-Step)
1. **Init:**
   - Load SIM list: `POST simreplace/GetAllSim` (both old and new SIMs from same list).
   - Load app list.
2. **Select defective SIM:** Admin selects the SIM number to replace.
3. **Select replacement SIM:** Admin selects the new SIM from available inventory.
4. **Confirm swap:** `POST simreplace/SaveSimReplace`:
   - Server transfers device association from old SIM to new SIM.
5. **Success:** Toast + refresh.

### Actor Interactions
- Super Admin, Admin.

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Defective SIM must be selected | Dropdown required |
| Replacement SIM must be selected | Dropdown required |
| Replacement SIM must be unassigned | Server-side |
| Both SIMs cannot be the same | Server-side |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| POST | `simreplace/GetAllSim` | `{appId, ...}` | Load SIM list (old and new) |
| GET | `appinfo/GetAllInfoList` | — | App filter |
| POST | `simreplace/SaveSimReplace` | `{oldSimId, newSimId, reason, ...}` | Execute SIM swap |

### Database Interactions
Reads: SIM records, device-SIM associations.  
Writes: updates device-SIM association, marks old SIM as replaced, creates replacement audit record.

### Edge Cases
- Uses the same endpoint for both "old" and "new" SIM lists — the UI filters/separates them based on assignment status.
- SIM swap must ensure the GPS device firmware receives the new SIM's APN/credentials if applicable (may require OTA command).

---

## 5. Shared Vehicle — `SharedVehicleController`

### Module Purpose
Allow vehicle owners to share GPS tracking access for their vehicles with other platform users. Useful for fleet managers granting view-only access to secondary users, or owners sharing with family members.

### Business Workflow (Step-by-Step)
1. **Init:** Loads app list, then fetches current shared vehicle records: `GET sharedevice/GetAllSharedVehicle?params`.
2. **Load shareable users:** `GET user/GetAllUser?params` → populates the "share with" dropdown.
3. **Share vehicle:**
   a. Select vehicle (device) to share.
   b. Select target user to share with.
   c. Optionally set permissions (view-only vs. full control).
   d. Submit → `POST sharedevice/SaveSharedUserNew`.
4. **Revoke access:** Confirmation → `GET sharedevice/RemoveSharedUser?shareId=`.

### Actor Interactions
| Actor | Action |
|-------|--------|
| Admin / Super Admin | Share any vehicle with any user |
| Vehicle Owner (Customer) | Share their own vehicles (if permitted by app config) |
| Shared User | View-only access to shared vehicle (on the mobile/tracking app) |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Vehicle (device) must be selected | Dropdown required |
| Target user must be selected | Dropdown required |
| Cannot share with yourself | Server-side check |
| Cannot duplicate an existing share | Server-side check |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appinfo/GetAllInfoList` | — | App filter |
| GET | `sharedevice/GetAllSharedVehicle` | `appId`, `UserId` | Current share grants |
| GET | `user/GetAllUser` | `appId`, `UserId` | User list for "share with" selection |
| POST | `sharedevice/SaveSharedUserNew` | Share model object | Grant vehicle access to user |
| GET | `sharedevice/RemoveSharedUser` | `shareId` | Revoke vehicle access |

### Database Interactions
Reads: shared vehicle records, device records, user records.  
Writes: share grant record (create/delete).

### Edge Cases
- `RemoveSharedUser` uses GET — same unconventional pattern as other delete endpoints in this app.
- Shared access is scoped to the **tracking/mobile app** — shared users typically do not get admin portal access.
- Revoking access is immediate — the shared user's view refreshes on next app load.
- `SaveSharedUserNew` — the `New` suffix suggests a revised save endpoint exists; the original `SaveSharedUser` may be deprecated.
