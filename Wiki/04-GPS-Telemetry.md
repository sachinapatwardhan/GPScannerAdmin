# GPS & Telemetry Modules

Covers: `Gps` (GpsController), `HandShake` (HandShakeController), `Alarm` (AlarmController), `CanBus` (CanBusController), `DrivingBehavior` (DrivingBehaviorController)

---

## 1. GPS Data — `GpsController`

### Module Purpose
Read-only log viewer for raw GPS telemetry records. Allows administrators to query, filter, and export the position history for any tracked device.

### Business Workflow (Step-by-Step)
1. **Init:** Loads all device IDs via `GET gpsdata/GetAllGpsDevice?idApp=` for the filter dropdown.
2. **Default view:** Server-side DataTable loads the latest GPS records (`gpsdata/GetAllGpsDataNew`).
3. **Filter:** Admin selects Device ID, Start Date, End Date — DataTable re-fetches filtered data automatically.
4. **Search:** Full-text search field sends `search` param to the server.
5. **Export:** Clicking export redirects `window.location.href` to `gpsdata/ExportAllGpsDataNew?params` — browser triggers file download (Excel/CSV).

### Actor Interactions
- Admin, Super Admin — read-only access.

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Date range — StartDate must be ≤ EndDate | Server-side |
| Device filter defaults to "All" | `DeviceId = ''` when "All" selected |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `gpsdata/GetAllGpsDevice` | `idApp` | Device filter dropdown |
| DataTable | `gpsdata/GetAllGpsDataNew` | `DeviceId`, `StartDate`, `EndDate`, `search`, `AppName`, `TimeZone` | Server-side paginated GPS records |
| GET (export) | `gpsdata/ExportAllGpsDataNew` | `DeviceId`, `StartDate`, `EndDate`, `TimeZone`, `AppName` | Download GPS data as file |

### Database Interactions
Reads: `gpsdata` table — latitude, longitude, speed, direction, timestamp, device ID.  
Writes: None — read-only module.

### Edge Cases
- `$rootScope.CurrentTimeZone` is passed to both the DataTable and export endpoint to localise timestamps.
- When Device filter = "All", `DeviceId` is sent as empty string to the server.

---

## 2. Handshake Log — `HandShakeController`

### Module Purpose
Read-only viewer for device heartbeat / handshake records. Confirms that GPS devices are actively communicating with the server platform, useful for diagnosing connectivity issues.

### Business Workflow (Step-by-Step)
1. **Init:** Loads device list via `GET gpsdata/GetAllGpsDevice?idApp=`.
2. **Default view:** DataTable shows latest handshake records (`settings/GetAllDynamickHandshakeNew`).
3. **Filter:** By device ID, date range, search term.

### Actor Interactions
- Admin, Super Admin.

### Validation Rules
- No write operations; no user-input validation beyond date range filters.

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `gpsdata/GetAllGpsDevice` | `idApp` | Device filter dropdown |
| DataTable | `settings/GetAllDynamickHandshakeNew` | `DeviceId`, `StartDate`, `EndDate`, `search` | Server-side paginated handshake records |

### Database Interactions
Reads: handshake / heartbeat log table.  
Writes: None.

### Edge Cases
- Device that has never sent a handshake will not appear in the list.
- Useful to detect devices that are online (GPS data present) but not sending handshakes correctly.

---

## 3. Alarm Log — `AlarmController`

### Module Purpose
View and filter all alarm events triggered by GPS devices. Alarm types include overspeed, SOS, geofence entry/exit, power cut, low battery, towing detection, etc. Each alarm is associated with a GPS fix (lat/lng) for map correlation.

### Business Workflow (Step-by-Step)
1. **Init:** Loads device list; loads static alarm code list (`AlarmCode()` helper).
2. **Default view:** Server-side DataTable (`gpsdata/GetAllAlarmNew`) sorted newest first.
3. **Filters:**
   - `DeviceId` — select device or "All".
   - `AlarmCode` — select specific alarm type or "All".
   - `StartDate` / `EndDate` — converted to UTC strings before sending.
   - Free-text `search`.
4. **Toggle filter panel:** `$scope.toggle()` shows/hides the filter bar with a slide animation.
5. DataTable refreshes on filter change.

### DataTable Columns
| Column | Description |
|--------|-------------|
| # | Row number |
| Date | Alarm timestamp (formatted) |
| AlarmCode | Human-readable alarm type label |
| DeviceId | Device that triggered the alarm |
| Latitude | GPS latitude at alarm time |
| Longitude | GPS longitude at alarm time |
| GPSPositioning | Fix quality indicator |
| Status | Current alarm status |
| CreatedDate | Record creation date |

### Actor Interactions
- Admin, Super Admin.

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Dates converted to UTC strings | `ModelSearch.StartDate.toUTCString()` |
| `DeviceId = 'All'` → sent as `''` | `ModelSearch.DeviceId == 'All' ? '' : value` |
| `AlarmCode = 'All'` → sent as `''` | Same pattern |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `gpsdata/GetAllGpsDevice` | `idApp` | Device filter dropdown |
| DataTable | `gpsdata/GetAllAlarmNew` | `DeviceId`, `AlarmCode`, `StartDate`, `EndDate`, `search`, `idApp`, `AppName` | Server-side paginated alarm records |

### Database Interactions
Reads: alarm event records with GPS fix data.  
Writes: None.

### Edge Cases
- `StartDate` / `EndDate` must be valid `Date` objects before `.toUTCString()` is called; empty strings are checked first.
- `idApp` and `AppName` both sent — server uses `AppName` to resolve the correct data partition for multi-tenant setups.

---

## 4. CanBus Data — `CanBusController`

### Module Purpose
View raw CAN Bus / OBD-II telemetry data from vehicles equipped with a CAN bus interface on the GPS tracker. Captures engine-level parameters: RPM, fuel level, coolant temperature, odometer, and more.

### Business Workflow (Step-by-Step)
1. **Init:** Loads device list via `GET gpsdata/GetAllGpsDevice?idApp=`.
2. **Default view:** Server-side DataTable (`canbusdata/GetAllCanbusData`).
3. **Filter:** By device ID, date range, search term.
4. **Export:** `window.location.href = canbusdata/ExportAllCanbusData?params`.

### Actor Interactions
- Admin, Super Admin.

### Validation Rules
- No write operations; date range filters only.

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `gpsdata/GetAllGpsDevice` | `idApp` | Device filter dropdown |
| DataTable | `canbusdata/GetAllCanbusData` | `DeviceId`, `StartDate`, `EndDate`, `search`, `idApp` | Server-side paginated CAN bus records |
| GET (export) | `canbusdata/ExportAllCanbusData` | `DeviceId`, `StartDate`, `EndDate`, `idApp`, `search`, `TimeZone` | Download CAN bus data |

### Database Interactions
Reads: CAN bus telemetry records.  
Writes: None.

### Edge Cases
- Only applicable for vehicles with CAN bus–capable GPS trackers; standard trackers will produce no data.
- `TimeZone` (`$rootScope.CurrentTimeZone`) is passed for timestamp localisation in the export file.

---

## 5. Driving Behavior — `DrivingBehaviorController`

### Module Purpose
Analyse driver behaviour scores derived from CAN bus and GPS data. Identifies harsh braking, rapid acceleration, sharp cornering, and speeding events to support fleet safety management.

### Business Workflow (Step-by-Step)
1. **Init:** Loads device list via `GET gpsdata/GetAllGpsDevice?idApp=`.
2. **Default view:** DataTable (`canbusdata/GetAllDrivingBehavior`) showing processed behaviour events per trip.
3. **Filter:** By device, date range, search.
4. **Export:** `window.location.href = canbusdata/ExportAllDrivingData?params` — includes `TimeZone` for localised timestamps.

### Actor Interactions
- Admin, Super Admin, potentially Fleet Managers.

### Validation Rules
- No write operations; date/device filters.

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `gpsdata/GetAllGpsDevice` | `idApp` | Device filter dropdown |
| DataTable | `canbusdata/GetAllDrivingBehavior` | `DeviceId`, `StartDate`, `EndDate`, `search`, `idApp` | Server-side paginated driving events |
| GET (export) | `canbusdata/ExportAllDrivingData` | `DeviceId`, `StartDate`, `EndDate`, `search`, `idApp`, `TimeZone` | Download driving behavior data |

### Database Interactions
Reads: processed driving-behaviour event records (derived from CAN bus + GPS combined analysis).  
Writes: None.

### Edge Cases
- Requires CAN bus data to be present; GPS-only trackers will not generate driving-behaviour records.
- Processing of raw CAN/GPS data into behaviour events is a server-side background job — not triggered from the UI.
