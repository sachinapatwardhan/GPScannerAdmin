# Cross-Cutting Concerns & API Reference

This document covers architecture patterns that apply across all modules, plus a consolidated index of every API endpoint used in the application.

---

## 1. Role-Based Access Control (RBAC)

### Role Hierarchy
```
Super Admin
  └── Admin
        ├── Distributor
        │     └── Distributor Sub User
        ├── Sales Agent
        └── Retailer
```

### `$rootScope.MenuSet()` — Dynamic Navigation Builder
Located in `src/app/index.run.js`. Called after every successful login and on app boot.

**How it works:**
1. Reads `UserRoles` from `$cookieStore`.
2. Calls `GET userPermission/GetAllPermissionByRole?RoleName=` to retrieve the current user's allowed modules.
3. Iterates the permission list and calls `msNavigationService.saveItem(MenuName, {...})` for each permitted module to build the sidebar.
4. Hard-coded items always visible: Dashboard, Settings sub-menu (Country/State/City, API Access), Users sub-menu (Roles, UserPermission, Users), CMS sub-menu (App Setting, App Info, Language).
5. Dynamic items added based on permissions: Customer, Vehicle, Trackers, GPS, Alarm, CanBus, Driving Behaviour, Logs/AuditLog, SIM, Utility, Transfer Device, Assign Device, Assign Licence, Assign Retailer, Wallet.

**Login-time routing by role:**
| Role | Redirect Target |
|------|----------------|
| Distributor / Distributor Sub User | `/#/DistributorTrackers` |
| Sales Agent | `/#/SalesDashboard` |
| All others | `/#/Dashboard` |

---

### `$rootScope.CheckPageRights(ModuleName, callback)` — Page-Level Guard
Called at the top of each controller's init block, before any DataTable or form setup.

**How it works:**
1. Reads `UserRoles` from `$cookieStore`.
2. Checks if `UserRoles` includes `'Super Admin'` — if yes, executes callback immediately (full access).
3. Otherwise, looks up the module's permission record for the current role.
4. If the role has access, executes the `callback` (which sets up DataTable columns and options).
5. If the role does not have access, the page renders empty — no redirect or error shown.

**Usage pattern in every controller:**
```javascript
$rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
    $scope.FilterStatus = 1;
    // Set up dtColumns and dtOptions here
});
```

---

## 2. Authentication & Session Management

| Concern | Implementation |
|---------|---------------|
| JWT token storage | `$cookieStore.put('token', token)` |
| Token injection | `$http.defaults.headers.common['Authorization'] = token` |
| User identity | `UserId`, `UserRoles`, `UserCountry` in cookies |
| App identity | `appId`, `appName`, `Logo` in `localStorage` |
| Remember Me | `RemeberMe`, `RemeberUserName`, `RemeberPassword` in cookies |
| Multiple tabs | `isAllowMultipleTabs` cookie |
| Session flag | `isLogin` in `sessionStorage` |

**Token expiry handling:**  
When any API response returns `{data: 'TOKEN'}`, the controller clears `UserName` and `token` cookies and redirects to login. This pattern is consistently implemented across `ForgotpasswordController` and several other controllers.

---

## 3. Multi-Tenancy

| Concern | Implementation |
|---------|---------------|
| App resolution at boot | `GET appinfo/GetAppInfoByAdmin` (by domain) or `GET appinfo/GetAppInfoByName` (fallback) |
| App context | `$rootScope.appId` + `localStorage.appId` |
| Super Admin multi-app | App-switcher on Dashboard sends `appId = ''` for "All" |
| Non-admin scoping | `appId` mandatory query param on all data endpoints |
| Country scoping | `CountryList` cookie (comma-separated) passed to DataTable endpoints |

---

## 4. Common UI Patterns

| Pattern | Detail |
|---------|--------|
| **Toast notifications** | `$mdToast.simple().textContent(msg).position('top right').hideDelay(3000)` — used for all success/error feedback |
| **Confirmation dialogs** | `$mdDialog.confirm()` — required before all destructive operations (delete, void, revoke) |
| **Server-side DataTables** | `DTOptionsBuilder.newOptions().withOption('ajax', {...}).withOption('serverSide', true).withDisplayLength(25)` — all list views |
| **File uploads** | `new FormData()` + `$http.post(..., formData, {headers: {'Content-Type': undefined}})` — lets browser set multipart boundary |
| **Export / Download** | `window.location.href = RoutePath + 'endpoint?params'` — triggers browser file download |
| **Cascade dropdowns** | Country → State → City pattern in Register, User, and Customer forms |
| **init() pattern** | Every controller defines `$scope.init()` and calls it at the bottom, keeping initialisation explicit and testable |
| **DataTable reload** | `vm.dtInstance.reloadData(callback, resetPaging)` + `$('#TableId').dataTable()._fnAjaxUpdate()` — dual call for compatibility |
| **`createdRow` compile** | `$compile(angular.element(row).contents())($scope)` — recompiles each DataTable row so Angular directives work inside table cells |

---

## 5. API Base URL Configuration

The API base URL (`$rootScope.RoutePath`) is set in `src/app/index.run.js`. Production uses:
```
$rootScope.RoutePath = $window.location.protocol + "//api.maark.my/";
$rootScope.Socket_URL = $window.location.protocol + "//api.maark.my";
$rootScope.MapTile_URL = "https://map.maark.my/";
```
Multiple commented-out entries for dev/staging environments exist (localhost, UAT domains, IP addresses).

---

## 6. Identified Anti-Patterns & Notes

| Issue | Description |
|-------|-------------|
| **GET for mutations** | Many create/update/delete operations use `GET` with query params instead of `POST`/`PUT`/`DELETE` (e.g., `bike/SaveVehicle`, `vehicles/DeleteVehicle`, `sim/DeleteSIMInfo`, `assignretailer/SaveAssignRetailer`). This bypasses CSRF protection patterns and can be cached by proxies. |
| **Credentials in cookies** | `RemeberPassword` stored in plain text in a cookie — should use encrypted storage. |
| **Typos in endpoint names** | `mainsetting/DeleteSettingeById`, `auditlog/GetAllAditlog`, `licence/GetAllLiacenceAuditlog` — typos are in the production API and must be preserved client-side. |
| **Commented-out code** | Multiple commented-out endpoints and state cascade dropdowns suggest the API evolved — old code left in place. |
| **Duplicate DataTable instances** | Customer and other modules maintain two separate `dtInstance` objects for Super Admin vs. other role views. |

---

## 7. Full API Endpoint Index

### `account/` — Authentication & Password
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `account/loginNew` | Login |
| POST | `account/register` | Register |
| GET | `account/forgotpasswordNew` | Forgot Password |
| GET | `account/forgotpassword` | User (admin-initiated reset) |
| GET | `account/forgotpasswordfromOwnerCustomer` | Customer (admin-initiated reset) |
| GET | `account/forgotpasswordfromOwnerCustomerNew` | User dialog |
| GET | `account/passwordVerification` | User change-password dialog |
| POST | `account/changepassword` | Change Password |
| POST | `account/changepasswordNew` | User change-password dialog |

### `appinfo/` — Application Info
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `appinfo/GetAppInfoByAdmin` | index.run.js (boot) |
| GET | `appinfo/GetAppInfoByName` | index.run.js (boot fallback) |
| GET | `appinfo/GetAllInfoList` | Most modules (app filter) |
| POST | `appinfo/SaveAppInfo` | AppInfo |
| POST | `appinfo/uploadFile` | AppInfo |
| GET | `appinfo/DeleteAppInfo` | AppInfo |

### `appsetting/` — App Settings
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `appsetting/GetAllAppInfo` | AssignDevice, AssignLicence, RenewManagement |

### `assignagentretailer/` — Agent-Retailer
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `assignagentretailer/GetAllAgent` | AssignAgentRetailer |
| POST | `assignagentretailer/SaveAgentDeviceRetailer` | AssignAgentRetailer |
| POST | `assignagentretailer/uploadExcelDevice` | AssignAgentRetailer |

### `assigndistributor/` — Distributor
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `assigndistributor/GetAllDistributor` | AssignDistributor, RenewManagement |
| POST | `assigndistributor/SaveDeviceDistributor` | AssignDistributor |
| POST | `assigndistributor/uploadExcelDevice` | AssignDistributor |

### `assignretailer/` — Retailer
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `assignretailer/GetAllRetailer` | AssignRetailer |
| GET | `assignretailer/GetAllAssignRetailer` | AssignRetailer, AssignAgentRetailer |
| GET | `assignretailer/SaveAssignRetailer` | AssignRetailer |
| GET | `assignretailer/removeAssignRetailer` | AssignRetailer |

### `auditlog/` — Audit
| Method | Endpoint | Used By |
|--------|----------|---------|
| DataTable | `auditlog/GetAllAditlog` | AuditLog |

### `bike/` — Vehicle (legacy naming)
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `bike/SaveVehicle` | Vehicles |
| GET | `bike/GetAllExpireDevice` | Dashboard |

### `billing/` — Financial
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `billing/GetPriceByApp` | OrderService |
| GET | `billing/GetAllVehicleExpirebyUser` | OrderService, RenewManagement |
| GET | `billing/GetAllSalesAgentRole` | RenewManagement |
| POST | `billing/SaveOrderServiceNew` | OrderService |
| POST | `billing/SaveOrderServiceRenew` | RenewManagement, SalesDashboard |
| GET | `billing/MakeStatusPaid` | OrderService |
| GET | `billing/SendPaymentLink` | OrderService |
| POST | `billing/uploadImage` | OrderService |
| POST | `billing/SendEmailNotification` | RenewManagement |

### `canbusdata/` — CAN Bus
| Method | Endpoint | Used By |
|--------|----------|---------|
| DataTable | `canbusdata/GetAllCanbusData` | CanBus |
| GET (export) | `canbusdata/ExportAllCanbusData` | CanBus |
| DataTable | `canbusdata/GetAllDrivingBehavior` | DrivingBehavior |
| GET (export) | `canbusdata/ExportAllDrivingData` | DrivingBehavior |

### `city/` — Geography
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `city/GetAllCityByStateId` | Register, User |

### `country/` — Geography
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `country/GetAllCountry` | Register, Customer, User, Vehicles, SIM, Roles, Wallet, WalletTransaction, RenewManagement, OrderService |

### `dashboard/` — Dashboard
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `dashboard/GetAllWorkingBikeNew` | Dashboard |
| GET | `dashboard/GetDashboardData` | Dashboard |
| GET | `dashboard/GetGraphCustomer` | Dashboard |
| GET | `dashboard/GetGraphData` | Dashboard |
| GET | `dashboard/GetTotalCustomer` | Dashboard |
| GET | `dashboard/GetTotalCustomerByCountry` | Dashboard |
| GET | `dashboard/SalesDashBoardData` | SalesDashboard |
| GET | `dashboard/GetVehicleExpireDetailsByDeviceID` | SalesDashboard |

### `Email/` & `email/` — Email
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `Email/GetAllEmailSettingNew` | EmailSetting |
| GET | `Email/GetEmailSetting` | EmailSetting |
| POST | `Email/SaveEmailSetting` | EmailSetting |
| GET | `email/GetAllEmailTemplate` | EmailTemplate |
| POST | `email/SaveEmailTemplate` | EmailTemplate |
| GET | `email/DeleteEmailTemplate` | EmailTemplate |

### `gpsdata/` — GPS
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `gpsdata/GetAllGpsDevice` | GPS, HandShake, Alarm, CanBus, DrivingBehavior |
| DataTable | `gpsdata/GetAllGpsDataNew` | GPS |
| GET (export) | `gpsdata/ExportAllGpsDataNew` | GPS |
| DataTable | `gpsdata/GetAllAlarmNew` | Alarm |

### `licence/` — Licence
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `licence/GetLienceToAssignDevice` | AssignLicence |
| GET | `licence/CreateLicenceNumbers` | AssignLicence dialog |
| GET | `licence/SaveLicenceDetail` | AssignLicence |
| GET | `licence/changestatusrenewal` | AssignLicence |
| POST | `licence/SaveOrderService_LicenceRenewal` | AssignLicence |
| GET | `licence/SwipeDeviceAdmin` | AssignLicence dialog |
| GET | `licence/DeleteDeviceLicence` | AssignLicence |
| DataTable | `licence/GetAllLiacenceAuditlog` | AuditLogLicense |

### `mainsetting/` — Settings
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `mainsetting/GetAllSetting` | MainSetting |
| POST | `mainsetting/SaveSetting` | MainSetting |
| GET | `mainsetting/DeleteSettingeById` | MainSetting |

### `module/` — Module Registry
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `module/GetAllModule` | UserPermission |
| GET | `module/GetAllModuleName` | Module |
| POST | `module/CreateModule` | Module |
| POST | `module/UpdateModule` | Module |
| GET | `module/DeleteModule/:id` | Module |
| GET | `module/DeleteModuleAndpermission/:id` | Module |

### `orderservice/` — Orders
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `orderservice/GetAllCustomer` | OrderService |
| GET | `orderservice/GetAllDeviceId` | OrderService |
| GET | `orderservice/GetOrderServiceStatus` | OrderService |
| GET | `orderservice/RenewOrderService` | OrderService |
| GET | `orderservice/UpdateOrderServiceDates` | OrderService |
| POST | `orderservice/CreateOrderService` | OrderService |
| POST | `orderservice/SaveOrderService` | OrderService |
| GET | `orderservice/UpdateDevice` | OrderService dialog |

### `PetDevice/` — GPS Device Hardware
| Method | Endpoint | Used By |
|--------|----------|---------|
| POST | `PetDevice/SaveGPSDevice` | Trackers |
| POST | `PetDevice/DeleteVehicle` | Trackers |
| GET | `PetDevice/UpdateStatus` | Trackers |
| GET | `PetDevice/GetGPSDeviceById` | Vehicles |

### `role/` — Roles
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `role/GetAllRole` | Customer, User, Roles, UserPermission |
| POST | `role/SaveRole` | Roles |
| GET | `role/DeleteRole` | Roles |

### `settings/` — Device Settings
| Method | Endpoint | Used By |
|--------|----------|---------|
| DataTable | `settings/GetAllDynamickHandshakeNew` | HandShake |

### `sharedevice/` — Vehicle Sharing
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `sharedevice/GetAllSharedVehicle` | SharedVehicle |
| POST | `sharedevice/SaveSharedUserNew` | SharedVehicle |
| GET | `sharedevice/RemoveSharedUser` | SharedVehicle |

### `sim/` — SIM Cards
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `sim/GetAllSIMInfo` | Trackers, SIM |
| GET | `sim/GetAllSIMInfoForTrackingApp` | Trackers |
| GET | `sim/CheckSimDetail` | SIM |
| POST | `sim/SaveSIMInfo` | SIM |
| GET | `sim/DeleteSIMInfo` | SIM |
| POST | `sim/uploadExcelDevice` | SIM |

### `simreplace/` — SIM Warranty
| Method | Endpoint | Used By |
|--------|----------|---------|
| POST | `simreplace/GetAllSim` | WarrantySIM |
| POST | `simreplace/SaveSimReplace` | WarrantySIM |

### `socketapi/` — Socket Commands
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `socketapi/SendCommandToDevice` | VehicleMonitor |

### `state/` — Geography
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `state/GetAllStateByCountryId` | Register |

### `telco/` — Telecom
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `telco/GetAllCompany` | SIM, Trackers |

### `user/` — Users
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `user/GetAllUser` | SharedVehicle |
| GET | `user/GetAllUserBySalesRole` | Trackers |
| GET | `user/GetAllDynamicOwnerCustomer` | Customer (DataTable) |
| GET | `user/GetUserById` | Vehicles, AssignLicence, OrderService |
| GET | `user/GetUserByEmail` | Vehicles, OrderService |
| GET | `user/GetUserByName` | AssignLicence |
| POST | `user/SaveCustomer` | Customer |
| GET | `user/DeleteCustomer` | Customer |
| POST | `user/SaveUserNew` | User |
| POST | `user/uploadImage` | User |
| GET | `user/changeUserStatus` | User |
| GET | `user/SetSuspendStatus` | User |

### `userPermission/` — Permissions
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `userPermission/GetAllPermissionByRole` | UserPermission, index.run.js (MenuSet) |
| POST | `userPermission/ChangePermission` | UserPermission |
| POST | `userPermission/ChangeAllPermissions` | UserPermission |

### `vehicles/` — Vehicle Management
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `vehicles/GetAllVehicleDeviceId` | VehicleMonitor |
| GET | `vehicles/GetAllNotAssignDevice` | TransferDevice |
| GET | `vehicles/TransferDevicetoUser` | TransferDevice |
| GET | `vehicles/UpdateExpiryDate` | Vehicles |
| GET | `vehicles/DeleteVehicle` | Vehicles |

### `vehicletype/` — Vehicle Types
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `vehicletype/GetAllActivevehicletype` | Vehicles, OrderService |

### `warranty/` — Device Warranty
| Method | Endpoint | Used By |
|--------|----------|---------|
| POST | `warranty/GetAllOldVehicle` | WarrantyDevice |
| POST | `warranty/GetAllNewVehicle` | WarrantyDevice |
| POST | `warranty/SaveWarrantyReplaceDevice` | WarrantyDevice |

### `WalletTransaction/` — Wallet
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `WalletTransaction/GetAllDeviceID` | WalletTransaction |
| POST | `WalletTransaction/Savewallettransaction` | WalletTransaction |
| POST | `WalletTransaction/uploadImage` | WalletTransaction |
| GET | `WalletTransaction/ApproveTransaction` | WalletTransaction |
| GET | `WalletTransaction/VoidTransaction` | WalletTransaction |
| GET | `WalletTransaction/RenewTransaction` | WalletTransaction |
| DataTable | `WalletTransaction/GetAllWalletes` | Wallet |
| DataTable | `WalletTransaction/GetAllWallettransaction` | WalletTransaction |
| GET (export) | `WalletTransaction/ExportWallet` | Wallet |
| GET (export) | `WalletTransaction/ExportWalletTransaction` | WalletTransaction |

### `admin/` — Admin Utilities
| Method | Endpoint | Used By |
|--------|----------|---------|
| GET | `admin/getAutocompleteSalesAgentNew` | AssignDevice |
| POST | `admin/assignDevice` | AssignDevice |
| POST | `admin/assignDeviceByExcelNew` | AssignDevice |
