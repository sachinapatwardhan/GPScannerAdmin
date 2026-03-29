# Dashboard Modules

Covers: `Dashboard` (DashboardController), `SalesDashboard` (SalesDashboardController)

---

## 1. Dashboard — `DashboardController`

### Module Purpose
Real-time live-map view of the entire fleet combined with KPI counters. Serves as the operational command centre for Admins and Super Admins. Displays vehicle positions, online/offline status, customer statistics, and expiring device warnings.

### Business Workflow (Step-by-Step)
1. **Boot:** Resolves `appId` and `AppName` from `localStorage`; reads `UserRoles` and `UserId` from cookies.
2. **Multi-tenant app selector:** Calls `GET appinfo/GetAllInfoList` → populates an app-switcher dropdown. Super Admin can change active `appId`; non-Super-Admins are locked to their assigned app.
3. **Live map initialisation:** Connects to Socket.IO at `$rootScope.Socket_URL`; subscribes to real-time GPS position events.
4. **Vehicle load:** Calls `GET dashboard/GetAllWorkingBikeNew?AppName=` → receives all vehicles with their current positions and statuses.
5. **Map rendering:** Plots vehicles on a Leaflet map using `MovingMarker` for smooth position updates. Icon set varies by `AppName` (tracking-app icons vs standard fleet icons).
6. **KPI cards load:**
   - `dashboard/GetDashboardData` → online/offline/active device counts.
   - `dashboard/GetTotalCustomer` → total registered customer count.
   - `dashboard/GetTotalCustomerByCountry?idApp=` → customer breakdown by country.
   - `bike/GetAllExpireDevice` → list of devices expiring soon.
7. **Charts load:**
   - `dashboard/GetGraphCustomer` → customer growth over time.
   - `dashboard/GetGraphData` → device activity time-series.
8. **Periodic refresh:** Socket.IO pushes keep vehicle positions live without polling.
9. **Expire list:** Devices approaching expiry are highlighted with renewal calls-to-action.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All tenant apps; can switch `appId` via app selector |
| Admin | Own app only; `appId` fixed |
| Sales Agent | Redirected to `/SalesDashboard` — does not see this view |
| Distributor | Redirected to `/DistributorTrackers` — does not see this view |

### Validation Rules
- No user-input forms on this screen — read-only KPI and map view.
- `appId = ''` (empty string) is used to fetch data for all apps (Super Admin "All" view).

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appinfo/GetAllInfoList` | — | Multi-tenant app list for switcher |
| GET | `dashboard/GetAllWorkingBikeNew` | `AppName` | All vehicles with current positions & statuses |
| GET | `dashboard/GetDashboardData` | `idApp`, `UserId`, date filters | KPI counters (online/offline/active) |
| GET | `dashboard/GetGraphCustomer` | `idApp`, date range | Customer growth graph data |
| GET | `dashboard/GetGraphData` | `idApp`, date range | Device activity time-series |
| GET | `dashboard/GetTotalCustomer` | `idApp`, `UserId` | Total customer count |
| GET | `dashboard/GetTotalCustomerByCountry` | `idApp` | Customer count per country |
| GET | `bike/GetAllExpireDevice` | `idApp`, date range | Devices expiring soon |
| Socket.IO | `$rootScope.Socket_URL` | — | Real-time GPS position stream |

### Database Interactions
Reads:
- GPS positions and movement history (live from socket + REST).
- Vehicle status flags (online, offline, active, idle).
- Customer registration counts.
- Subscription expiry dates.

Writes: None — dashboard is read-only.

### Edge Cases
- **`AppName === "Tracking"`** → uses person-tracking icon set instead of car icons.
- **Super Admin "All" view** → sends `appId = ''`; server aggregates across all tenants.
- **Socket disconnection** → vehicle markers stop updating but last-known positions remain visible; no explicit reconnection logic found in the controller.
- **`GetAllWorkingBikeNew` empty response** → map renders with no markers.

---

## 2. Sales Dashboard — `SalesDashboardController`

### Module Purpose
Sales Agent–specific operational view showing assigned account summaries, device expiry reminders, and a quick-renew capability. Sales Agents are redirected here instead of the main Dashboard.

### Business Workflow (Step-by-Step)
1. Page loads → calls `GET dashboard/SalesDashBoardData` with `UserId` and `idApp`.
2. Displays KPI tiles: total customers assigned, devices active, devices expiring.
3. **Expiry detail modal:** Clicking a device opens `OpenRemark` dialog:
   - Calls `GET dashboard/GetVehicleExpireDetailsByDeviceID?DeviceID=`.
   - Shows device subscription details, customer info, and expiry date.
   - Sales agent can initiate renewal → `POST billing/SaveOrderServiceRenew`.
4. Success renewal → toast confirmation.

### Actor Interactions
| Actor | Action |
|-------|--------|
| Sales Agent | View their assigned accounts; initiate renewals |
| Admin / Super Admin | Can navigate here but it is designed for Sales Agent role |

### Validation Rules
- Renewal requires selecting a plan and confirming order details in the `OpenRemark` dialog.
- Renewal amount must be > 0 (server-side enforcement).

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `dashboard/SalesDashBoardData` | `UserId`, `idApp` | Sales KPI summary data |
| GET | `dashboard/GetVehicleExpireDetailsByDeviceID` | `DeviceID` | Device expiry detail for modal |
| POST | `billing/SaveOrderServiceRenew` | Renewal order object | Create renewal order |

### Database Interactions
Reads: sales agent's assigned customer list, device expiry dates, subscription status. Writes: new renewal order record on `SaveOrderServiceRenew`.

### Edge Cases
- Sales Agents are **routed here from Login** — they never land on the main Dashboard.
- `UserId` scope ensures agents only see their own assigned accounts.
- If `SalesDashBoardData` returns empty, KPI tiles show zero counts.
