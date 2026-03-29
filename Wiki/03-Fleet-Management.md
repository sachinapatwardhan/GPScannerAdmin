# Fleet Management Modules

Covers: `Vehicles` (VehiclesController), `Trackers` (TrackersController), `VehicleMonitor` (VehicleMonitorController)

---

## 1. Vehicles — `VehiclesController`

### Module Purpose
Full CRUD management for the vehicle registry. Links GPS tracker hardware to customer accounts, manages subscription renewal dates, and configures per-device operational parameters (speed limit, GPRS interval, sleep mode, relay, siren, etc.).

### Business Workflow (Step-by-Step)
1. **Init:** Loads vehicle type list (`vehicletype/GetAllActivevehicletype`). Loads user autocomplete (search by email).
2. **List:** Server-side DataTable (`user/GetAllDynamicOwnerCustomer`) shows all vehicles with owner, IMEI, status, renewal date.
3. **Add / Edit vehicle:**
   a. Admin fills in vehicle name, IMEI, deviceId, vehicle type.
   b. Email autocomplete (`user/GetUserByEmail`) searches for the owning customer; selecting a result populates `iduser`.
   c. On IMEI entry → `PetDevice/GetGPSDeviceById?IMEI=` pre-fills device details if already registered.
   d. Sets renewal date, MaxSpeed, GPRSInterval, SleepMode, Arm, OdoMeter, Relay, Siren flags.
   e. Validates form (`flgValidation` flag must be `true`).
   f. Submits → `GET bike/SaveVehicle?params` (all params serialised as query string).
4. **Update expiry date:** Inline action → `GET vehicles/UpdateExpiryDate?params`.
5. **Delete vehicle:** Confirmation dialog → `GET vehicles/DeleteVehicle?params`.

### Actor Interactions
| Actor | Scoping |
|-------|---------|
| Super Admin | All apps; sees `AppName` column in table |
| Admin | Own app (`appId` fixed); no `AppName` column |
| Sales Agent | Own app, scoped by `UserId` |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Vehicle type (`idType`) required | `flgValidation` gate + HTML `required` |
| Customer must be selected via autocomplete | `iduser` populated by selection |
| IMEI lookup pre-populates device info | If blank, fields remain empty (no block) |
| All required model fields | `flgValidation` boolean flag |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `vehicletype/GetAllActivevehicletype` | — | Vehicle type dropdown |
| GET | `user/GetUserByEmail` | `email` (query) | Customer autocomplete |
| GET | `user/GetUserById` | `idUser` | Load full user details on selection |
| GET | `bike/SaveVehicle` | Full vehicle model | Create / update vehicle record |
| GET | `vehicles/UpdateExpiryDate` | `idVehicle`, `expiryDate` | Update renewal/expiry date |
| GET | `vehicles/DeleteVehicle` | `idVehicle` | Soft-delete vehicle |
| GET | `PetDevice/GetGPSDeviceById` | `IMEI` | Look up GPS device record by IMEI |
| DataTable | `user/GetAllDynamicOwnerCustomer` | `appId`, `UserRoles`, `UserId`, `CountryList`, `search` | Server-side paginated vehicle list |

### Database Interactions
Reads: vehicle records, GPS device records, user/customer records, vehicle type catalogue.  
Writes: vehicle record (create/update), expiry date update, soft-delete flag.

### Edge Cases
- **`bike/SaveVehicle` uses GET** (not POST) with all parameters in the query string — unusual pattern; large payloads may hit URL length limits.
- Super Admin sees `AppName` column; others do not — controlled by role check at DataTable setup time.
- `CountryList` and `UserCountry` cookies sent with every DataTable request for row-level country-based security.
- IMEI lookup is advisory only — blank result does not block form submission.
- `renewaldate` and `HandshakDatetime` are nullable; form can be saved without setting them.

---

## 2. Trackers — `TrackersController`

### Module Purpose
Manage physical GPS tracker hardware inventory. Registers new devices with IMEI, assigns SIM cards and Telco providers, links to an app and sales agent, and manages device lifecycle (enable/disable, delete).

### Business Workflow (Step-by-Step)
1. **Init:** Loads SIM list, telco company list, app info list, country list, and sales agent list.
   - For **Tracking App** variant: uses `sim/GetAllSIMInfoForTrackingApp` instead of `sim/GetAllSIMInfo`.
2. **List:** Server-side DataTable shows all registered GPS devices.
3. **Add tracker:**
   a. Fill IMEI, SIM card, Telco provider, App, Sales Agent, country.
   b. Submit → `POST PetDevice/SaveGPSDevice`.
4. **Toggle active/inactive status:** `GET PetDevice/UpdateStatus?params`.
5. **Delete tracker:** Confirmation → `POST PetDevice/DeleteVehicle`.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All devices across all apps |
| Admin | Own app devices |
| Sales Agent | View only (list is scoped to their assignment) |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| IMEI required | HTML `required` |
| SIM card selection required | Dropdown — must select from list |
| App assignment required | Dropdown |
| Sales Agent selection required | Dropdown (`user/GetAllUserBySalesRole`) |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `sim/GetAllSIMInfo` | — | SIM dropdown (standard) |
| GET | `sim/GetAllSIMInfoForTrackingApp` | `appId` | SIM dropdown (tracking app variant) |
| GET | `appinfo/GetAllInfoList` | — | App dropdown |
| GET | `country/GetAllCountry` | — | Country filter |
| GET | `telco/GetAllCompany` | — | Telco provider dropdown |
| GET | `user/GetAllUserBySalesRole` | — | Sales agent dropdown |
| POST | `PetDevice/SaveGPSDevice` | Full device model | Create / update GPS device record |
| POST | `PetDevice/DeleteVehicle` | `{id, ...}` | Delete GPS device |
| GET | `PetDevice/UpdateStatus` | `id`, `status` | Enable / disable device |

### Database Interactions
Reads: SIM cards, Telco companies, users (sales role), app list.  
Writes: GPS device record (create/update), status flag, soft-delete.

### Edge Cases
- SIM endpoint differs depending on whether the active app is the "Tracking" app — controlled by `AppName` check at init.
- Deleting a tracker that is assigned to a vehicle may cause orphaned vehicle records — handled server-side.

---

## 3. Vehicle Monitor — `VehicleMonitorController`

### Module Purpose
OTA (over-the-air) remote configuration tool. Allows admins to push settings commands to one or more physical GPS devices simultaneously via the server's Socket API: speed limit, GPRS reporting interval, sleep mode, ARM status, heartbeat interval, odometer, stop interval, and ACC setting.

### Business Workflow (Step-by-Step)
1. **Init:** Calls `GET vehicles/GetAllVehicleDeviceId?idApp=` → loads all device IDs into an autocomplete chip input.
2. **Device selection:** Admin uses the chip input (with debounced autocomplete, 300 ms threshold) to add one or multiple device IDs to the target list.
3. **Fill settings:** Admin fills any subset of:
   - `MaxSpeed` (km/h)
   - `SleepMode` (on/off code)
   - `GPRSInterval` (seconds)
   - `GPRSStopInterval` (seconds when stationary)
   - `Arm` (immobiliser arm/disarm)
   - `OdoMeter` (reset/set value)
   - `HeartbeatInterval` (seconds)
   - `ACC` (accessory/ignition detection)
4. **Save settings:** Calls `GET socketapi/SendCommandToDevice?objDevice[]=...&MaxSpeed=...&...`
   - Server relays AT-commands to the selected devices over Socket.IO.
5. On success → toast, form reset (`ResetModel()`).

### Actor Interactions
| Actor | Scoping |
|-------|---------|
| Super Admin | All devices (`idApp = ''`) |
| Admin | Own app devices |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| At least one device must be selected | Client: `$scope.DeviceList.length > 0` |
| Settings fields are optional (partial updates allowed) | Null fields sent as empty string/null |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `vehicles/GetAllVehicleDeviceId` | `idApp` | All device IDs for autocomplete |
| GET | `socketapi/SendCommandToDevice` | `objDevice[]`, `MaxSpeed`, `SleepMode`, `TimeInterval`, `Arm`, `odometer`, `HeartbeatInterval`, `GPRSStopInterval`, `ACC` | Push OTA config to device(s) |

### Database Interactions
Reads: device ID list.  
Writes: triggers socket command delivery; device configuration stored on hardware and optionally logged server-side.

### Edge Cases
- **Debounced search** (300 ms) prevents flooding the chip autocomplete during rapid typing.
- Super Admin passes `idApp = ''` to get all devices; non-super-admins are scoped to `$rootScope.appId`.
- **Partial updates:** Only filled fields are applied — null/empty fields are ignored by the device firmware.
- **No confirmation dialog** — command is sent immediately on `savesetting()`.
- `SendCommandToDevice` uses GET with array parameter (`objDevice[]`) — relies on jQuery-style array serialisation.
