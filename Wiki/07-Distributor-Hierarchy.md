# Distributor Hierarchy Modules

Covers: `AssignDistributor`, `AssignRetailer`, `AssignAgentRetailer`, `DistributorTrackers`

---

## Overview — Hierarchy Model

```
Super Admin / Admin
    └── Distributor
            └── Retailer
                    └── Sales Agent
```

Each tier manages the inventory and customers below it. GPS devices flow from Admin → Distributor → Retailer → Sales Agent → Customer.

---

## 1. Assign Distributor — `AssignDistributorController`

### Module Purpose
Assign GPS devices from the admin pool to distributors. Distributors then manage those devices within their own sub-hierarchy. Supports both individual assignment and bulk Excel import.

### Business Workflow (Step-by-Step)
1. **Init:** Loads distributor list (`assigndistributor/GetAllDistributor`) and app list.
2. **List:** Server-side DataTable showing current distributor–device assignments.
3. **Assign device(s) to distributor:**
   a. Select distributor from dropdown.
   b. Select device(s) / enter IMEI list.
   c. Select app.
   d. `POST assigndistributor/SaveDeviceDistributor`.
4. **Bulk import:** Opens `ImportDistributor` dialog:
   a. Loads distributor list and app list.
   b. User uploads Excel file → `POST assigndistributor/uploadExcelDevice` (multipart).

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All distributors across all apps |
| Admin | Own app distributors |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Distributor required | Dropdown `required` |
| At least one device required | Client-side list check |
| Excel format must match template | Server-side |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `assigndistributor/GetAllDistributor` | `appId`, `UserId` | Distributor list |
| GET | `appinfo/GetAllInfoList` | — | App dropdown |
| POST | `assigndistributor/SaveDeviceDistributor` | `{distributorId, deviceIds[], appId}` | Assign device(s) to distributor |
| POST | `assigndistributor/uploadExcelDevice` (multipart) | FormData + Excel | Bulk assign via Excel |

### Database Interactions
Reads: distributor user records, device inventory, app list.  
Writes: distributor-device assignment records.

### Edge Cases
- `GetAllDistributor` is called twice at init (once for the main list, once for a filter dropdown) — same endpoint, different scope params.
- Assigning a device that is already assigned to a distributor may create a conflict — server should enforce one-distributor-per-device.

---

## 2. Assign Retailer — `AssignRetailerController`

### Module Purpose
Manage the association between distributors and retailers. Retailers operate under distributors and receive device batches for onward sale to end customers.

### Business Workflow (Step-by-Step)
1. **Init:** Loads app list.
2. **List:** DataTable shows current retailer assignments grouped by distributor.
3. **Assign retailer to distributor (Retailer dialog):**
   a. Load all available retailers: `GET assignretailer/GetAllRetailer?params`.
   b. Load current assignments: `GET assignretailer/GetAllAssignRetailer?params`.
   c. **Add:** Select retailer → `GET assignretailer/SaveAssignRetailer?retailerId=&distributorId=`.
   d. **Remove:** `GET assignretailer/removeAssignRetailer?params`.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All distributors/retailers |
| Admin | Own app |
| Distributor | Own retailer assignments |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Retailer must be selected | Dropdown required |
| Cannot assign same retailer twice to same distributor | Server-side check |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appinfo/GetAllInfoList` | — | App filter |
| GET | `assignretailer/GetAllRetailer` | `distributorId`, `appId` | Available retailer list |
| GET | `assignretailer/GetAllAssignRetailer` | `distributorId`, `appId` | Current retailer assignments |
| GET | `assignretailer/SaveAssignRetailer` | `retailerId`, `distributorId` | Link retailer to distributor |
| GET | `assignretailer/removeAssignRetailer` | `assignId` | Unlink retailer |

### Database Interactions
Reads: retailer user records, distributor-retailer junction records.  
Writes: junction record (add/remove).

### Edge Cases
- Both `SaveAssignRetailer` and `removeAssignRetailer` use GET instead of POST/DELETE — unconventional REST pattern.
- Removing a retailer from a distributor does not automatically reassign their devices; orphaned device assignments may need manual cleanup.

---

## 3. Assign Agent-Retailer — `AssignAgentRetailerController`

### Module Purpose
Assign sales agents to retailers and allocate device batches to specific agent-retailer combinations. Operates at the bottom tier of the distribution hierarchy.

### Business Workflow (Step-by-Step)
1. **Init:** Loads agent list (`assignagentretailer/GetAllAgent`), all retailer assignments, and app list.
2. **List:** DataTable showing agent–retailer–device assignments.
3. **Assign agent to retailer with devices:**
   a. Select sales agent from dropdown.
   b. Select retailer from dropdown.
   c. Select device batch.
   d. `POST assignagentretailer/SaveAgentDeviceRetailer`.
4. **Bulk import:** Opens `ImportAgentRetailer` dialog → Excel upload → `POST assignagentretailer/uploadExcelDevice` (multipart).

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin / Admin | Full access |
| Distributor | Own agents/retailers |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Agent required | Dropdown required |
| Retailer required | Dropdown required |
| Devices required | List required |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `assignagentretailer/GetAllAgent` | `appId`, `UserId` | Sales agent list |
| GET | `assignretailer/GetAllAssignRetailer` | — | Retailer assignment list |
| GET | `appinfo/GetAllInfoList` | — | App dropdown |
| POST | `assignagentretailer/SaveAgentDeviceRetailer` | `{agentId, retailerId, deviceIds[]}` | Save agent-retailer device assignment |
| POST | `assignagentretailer/uploadExcelDevice` (multipart) | FormData + Excel | Bulk assign via Excel |

### Database Interactions
Reads: sales agent records, retailer assignments, device pool.  
Writes: agent-retailer-device assignment records.

### Edge Cases
- Three-way junction (agent + retailer + devices) — server must validate all three exist and are compatible.
- Excel import must contain agent, retailer, and device columns in the expected format.

---

## 4. Distributor Trackers — `DistributorTrackersController`

### Module Purpose
A restricted dashboard view for distributors and distributor sub-users. Shows the GPS trackers assigned to the logged-in distributor's inventory, replacing the full admin Trackers module for this role.

### Business Workflow (Step-by-Step)
1. **Login redirect:** Distributors and Distributor Sub Users are automatically sent to `/#/DistributorTrackers` after login (enforced in `LoginController`).
2. Loads distributor-scoped tracker list (DataTable filtered by `UserId` / `DistributorId`).
3. Distributor can view device details but has limited edit/delete capability vs. full admin Trackers module.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Distributor | Own device inventory |
| Distributor Sub User | Parent distributor's inventory |

### API Endpoints
Most init calls are commented out in the source (SIM, App, Country, Telco, Agent lists) — the module uses a simplified DataTable view scoped to the distributor's assigned devices.

### Database Interactions
Reads: device records scoped to the distributor's assignment.  
Writes: limited (status updates only, based on available actions in the view).

### Edge Cases
- `Distributor Sub User` login substitutes `UserId` with parent `DistributorId` at login time — so all data queries are automatically scoped to the parent distributor's inventory.
- The heavily commented-out init code suggests this module was derived from the full Trackers module but simplified for the distributor role.
