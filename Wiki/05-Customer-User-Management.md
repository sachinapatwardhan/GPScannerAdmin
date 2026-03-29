# Customer & User Management Modules

Covers: `Customer` (CustomerController), `User` (UserController), `Roles` (RolesController), `UserPermission` (UserPermissionController)

---

## 1. Customer — `CustomerController`

### Module Purpose
Manage end-customer (vehicle owner) accounts: create, view, delete, and reset passwords. Customers are the subscribers who own vehicles registered on the platform.

### Business Workflow (Step-by-Step)
1. **Init:** Loads country list, role list, app info list. Resets model with defaults (`IsMobileVerify = false`, `idApp` from localStorage).
2. **List:** Server-side DataTable (`user/GetAllDynamicOwnerCustomer`) filtered by role, country, app, and user scope.
   - Super Admin sees `AppName` column + all apps.
   - Non-super-admin sees own-app customers only.
3. **Create customer:**
   a. Fill email (auto-copied to `username` via `setUsernameValue()`), phone, role, country, gender, password.
   b. Sets `IsMobileVerify = false` and `idApp`.
   c. POST to `user/SaveCustomer`.
   d. On success → reload DataTable.
4. **Delete customer:** Confirmation dialog → `GET user/DeleteCustomer?id=`.
5. **Reset password:** `GET account/forgotpasswordfromOwnerCustomer?params` — triggers email to the customer.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All apps; sees AppName column |
| Admin | Own app; scoped by `appId` |
| Sales Agent | Own customers; scoped by `UserId` |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Email → auto-copied to username | `setUsernameValue()` on email change |
| `IsMobileVerify` defaults `false` | Hard-coded in `init()` |
| Role selection required | Dropdown — `required` |
| Country required | Dropdown — `required` |
| Password required on create | HTML `required` |
| Email format | HTML `type="email"` |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appinfo/GetAllInfoList` | — | App filter dropdown |
| GET | `country/GetAllCountry` | — | Country dropdown |
| GET | `role/GetAllRole` | — | Role assignment dropdown |
| POST | `user/SaveCustomer` | Full customer model | Create / update customer |
| GET | `user/DeleteCustomer` | `id` | Delete (soft) customer |
| GET | `account/forgotpasswordfromOwnerCustomer` | `email`, `idApp` | Send password-reset email to customer |
| DataTable | `user/GetAllDynamicOwnerCustomer` | `appId`, `UserRoles`, `UserId`, `UserCountry`, `CountryList`, `search` | Server-side customer list |

### Database Interactions
Reads: customer records, country/role reference data.  
Writes: customer record (create/update), soft-delete flag, triggers password-reset token (via account endpoint).

### Edge Cases
- `CountryList` (multi-country roles) and `UserCountry` cookies sent with every DataTable request for row-level country security.
- Super Admin and non-super-admin have **different DataTable instances** (`dtOptions` vs `dtOptions1`) each with different column sets.
- `vm.dtInstance` and `vm.dtInstance1` are separate — reload is called on the correct instance based on role.
- Commented-out `user/updateCustomer` endpoint suggests the update workflow was migrated to `user/SaveCustomer`.

---

## 2. User — `UserController`

### Module Purpose
Manage admin and staff users (not end-customers). Covers full CRUD with profile image upload, role assignment, country/city scope, account status toggling, suspension, and password management.

### Business Workflow (Step-by-Step)
1. **Init:** Loads countries, app list, roles.
2. **List:** Server-side DataTable of users (scoped by `UserRoles` and `appId`).
3. **Create / Edit user:**
   a. Fill name, email, phone, gender, role, country → state (commented out, removed) → city cascade.
   b. POST to `user/SaveUserNew`.
   c. **Optional profile image:** If image selected → multipart POST to `user/uploadImage`.
4. **Toggle active/inactive:** `GET user/changeUserStatus?id=&status=`.
5. **Suspend user:** `GET user/SetSuspendStatus?id=&status=` (prevents login without deleting account).
6. **Admin-reset password:** `GET account/forgotpassword?email=` — sends reset email.
7. **Change password dialog (admin-initiated):**
   a. `GET account/forgotpasswordfromOwnerCustomerNew` → send OTP / reset link.
   b. Admin enters new password + calls `GET account/passwordVerification` to verify admin's own credentials first.
   c. If verified → `POST account/changepasswordNew`.
8. **Self-change password dialog:** `POST account/changepassword`.

### Actor Interactions
| Actor | Access |
|-------|--------|
| Super Admin | All users across all apps |
| Admin | Users within own app |

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Email format | HTML `type="email"` |
| Role required | Dropdown `required` |
| Country required | Dropdown `required` |
| Image is optional | Separate upload call only if file selected |
| Admin must verify own credentials before changing another user's password | `account/passwordVerification` step |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `country/GetAllCountry` | — | Country dropdown |
| GET | `city/GetAllCityByStateId` | `StateId` | City cascade |
| GET | `role/GetAllRole` | — | Role dropdown |
| GET | `appinfo/GetAllInfoList` | — | App filter |
| POST | `user/SaveUserNew` | Full user model | Create / update user |
| POST | `user/uploadImage` (multipart) | FormData with image file | Upload profile photo |
| GET | `user/changeUserStatus` | `id`, `status` | Toggle active / inactive |
| GET | `user/SetSuspendStatus` | `id`, `status` | Suspend / unsuspend account |
| GET | `account/forgotpassword` | `email`, `appId` | Send password-reset email (admin-initiated) |
| GET | `account/forgotpasswordfromOwnerCustomerNew` | `email`, `appId` | Send reset token (admin dialog flow) |
| GET | `account/passwordVerification` | `username`, `password` | Verify admin credentials |
| POST | `account/changepasswordNew` | `{userId, newPassword, ...}` | Change another user's password |
| POST | `account/changepassword` | `{oldPwd, newPwd}` | Self-change password |

### Database Interactions
Reads: user records, country/city/role reference data.  
Writes: user record (create/update), status/suspend flags, profile image path, password hash.

### Edge Cases
- State cascade was intentionally removed from the UI (commented out) — only country → city is active.
- Profile image upload is fire-and-forget after `SaveUserNew` succeeds; a failed image upload does not roll back the user save.
- `SetSuspendStatus` prevents login but retains all data — differs from delete.
- **Two-step admin password change:** admin must prove their own identity before changing another user's password.

---

## 3. Roles — `RolesController`

### Module Purpose
Define named user roles with optional country-level access restrictions. Roles control what menus and modules each user can access (enforced via `UserPermission`).

### Business Workflow (Step-by-Step)
1. **Init:** Loads all roles and all countries.
2. **List:** Displays all roles with their assigned country scopes.
3. **Create role:** Enter role name, optionally select countries → `POST role/SaveRole`.
4. **Edit countries on existing role:** Opens `RemoveCountryModel` dialog:
   - **Add country:** Select country → `POST role/SaveRole` with updated country list.
   - **Remove country:** Remove from list → `POST role/SaveRole` with updated country list.
5. **Delete role:** Confirmation → `GET role/DeleteRole?idRole=`.

### Actor Interactions
- Super Admin only (role management is a system-level operation).

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Role name required | HTML `required` |
| Cannot delete roles with assigned users | Server-side enforcement |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `role/GetAllRole` | — | List all roles |
| GET | `country/GetAllCountry` | — | Country list for role scoping |
| POST | `role/SaveRole` | `{RoleName, CountryList, ...}` | Create / update role |
| GET | `role/DeleteRole` | `idRole` | Delete role |

### Database Interactions
Reads: role records, country list.  
Writes: role record (create/update), role-country mapping, soft-delete flag.

### Edge Cases
- `RemoveCountryModel` dialog handles both add and remove operations via the same `POST role/SaveRole` — the full updated country list is always sent (replace, not patch).
- Deleting a role used by active users should be blocked server-side to maintain referential integrity.

---

## 4. User Permission — `UserPermissionController`

### Module Purpose
Granular RBAC configuration. Controls which system modules (pages) each role can access, with per-operation permission flags (view, add, edit, delete). All users sharing a role inherit the same permission set.

### Business Workflow (Step-by-Step)
1. **Init:** Loads role list and module list.
2. **Select role:** Choosing a role calls `GET userPermission/GetAllPermissionByRole?RoleName=` → populates permission grid.
3. **Toggle individual permission:** Clicking a permission checkbox → `POST userPermission/ChangePermission` with the updated module permission object.
4. **Bulk operations (four variants):**
   - **Enable all permissions** → `POST userPermission/ChangeAllPermissions` (`type: 'all', value: true`).
   - **Disable all permissions** → `POST userPermission/ChangeAllPermissions` (`type: 'all', value: false`).
   - **Enable all "Add"** → `POST userPermission/ChangeAllPermissions` (`type: 'add', value: true`).
   - **Disable all "Delete"** → `POST userPermission/ChangeAllPermissions` (`type: 'delete', value: false`).

### Actor Interactions
- Super Admin only.

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Role must be selected before permissions load | Dropdown required |
| Changes apply immediately (no save button) | Each toggle immediately POSTs |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `role/GetAllRole` | — | Role dropdown |
| GET | `module/GetAllModule` | — | All registered system modules |
| GET | `userPermission/GetAllPermissionByRole` | `RoleName` | Current permission set for role |
| POST | `userPermission/ChangePermission` | Module permission object | Update single module permission |
| POST | `userPermission/ChangeAllPermissions` | `{RoleName, type, value}` | Bulk permission update |

### Database Interactions
Reads: role list, module list, role-permission junction records.  
Writes: role-permission records (immediate update on each toggle).

### Edge Cases
- Permissions are **role-based, not user-based** — a change affects every user with that role instantly.
- `CheckPageRights()` in `index.run.js` reads these permissions at runtime when navigating to any page.
- Four separate bulk-update calls each map to different `type`/`value` combinations on the same endpoint.
- There is no "draft" state — all changes are live immediately.
