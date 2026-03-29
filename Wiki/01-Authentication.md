# Authentication Modules

Covers: `login`, `Register`, `Forgotpassword`, `ChangePassword`

---

## 1. Login — `LoginController`

### Module Purpose
Entry point for all users. Authenticates credentials against the backend, retrieves a JWT session token and role-based context, then routes users to role-appropriate dashboards.

### Business Workflow (Step-by-Step)
1. Page loads → reads `RemeberMe` cookie → auto-fills username/password if previously saved.
2. Custom `autoFillableField` directive fires after 1500 ms to detect browser-native autofill (not caught by Angular's `ng-model`).
3. User submits form → `$scope.Login(model, form, isLogout)` is called.
4. Sets `isAllowMultipleTabs = true` and `isLogin = true` in sessionStorage/cookies.
5. Persists `RemeberMe`, `RemeberUserName`, `RemeberPassword` to cookies if opted-in.
6. Calls `GET account/loginNew?username=&password=&appId=`.
7. On success:
   - Stores `UserId`, `UserImage`, `UserCountry`, `UserRoles`, `token`, `RenewAmount`, `CountryList` in cookies.
   - For **Distributor Sub User** role → replaces `UserId` with the parent `DistributorId`.
   - Sets `$http.defaults.headers.common['Authorization'] = token` for all subsequent requests.
   - Calls `msNavigationService.clearNavigation()` then `$rootScope.MenuSet()` to build RBAC sidebar.
8. Role-based redirect:
   - **Distributor / Distributor Sub User** (not Super Admin) → `/#/DistributorTrackers`
   - **Sales Agent** → `/#/SalesDashboard`
   - **All others** → `/#/Dashboard`
9. On failure → shows `$mdToast` with the server's error message.

### Actor Interactions
| Actor | Action |
|-------|--------|
| Super Admin | Full access, routed to `/Dashboard` |
| Admin | Full access (app-scoped), routed to `/Dashboard` |
| Distributor | Routed to `/DistributorTrackers`; UserId replaced by DistributorId |
| Distributor Sub User | Same as Distributor |
| Sales Agent | Routed to `/SalesDashboard` |

### Validation Rules
- All validation relies on Angular form binding (`ng-required` on HTML inputs).
- `RemeberMe` toggle persists credentials across sessions using `$cookieStore`.
- Browser autofill is handled by a 1500 ms polling directive (`autoFillableField`).

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `account/loginNew` | `username`, `password`, `appId` | Authenticate user; returns JWT token, roles, country list |

### Database Interactions
Reads: user record, hashed password (verified server-side), role assignments, country scope list, renewal amount, app assignment. Writes: last-login timestamp (implicit, server-side).

### Edge Cases
- `Distributor Sub User` role substitutes the parent distributor's `UserId` to scope all subsequent queries.
- `RolewiseCountryList` may contain null/empty entries — filtered out when building the `CountryList` cookie.
- Autofill bypass: standard Angular `ng-model` does not detect Chrome/Firefox autofill; the custom directive polls the DOM value 1.5 s after load.
- Multiple-tab support tracked via `isAllowMultipleTabs` cookie.

---

## 2. Register — `RegisterController`

### Module Purpose
Self-registration for new users (end-customers creating their own account).

### Business Workflow (Step-by-Step)
1. Page loads → `init()` → sets default model, calls `GetAllCountry()`.
2. User selects country → `GetAllStateByCountry(idCountry)` cascades state list.
3. User selects state → `GetAllCityByState(idState)` cascades city list.
4. User fills: email, username, password, confirm password, phone, gender.
5. Submits → `Register(o)`:
   - Sets `IsMobileVerify = false`, `createdby = username`, `idApp` from localStorage.
   - **Client-side check:** `password.length < 6` → toast error, halt.
   - **Client-side check:** `password !== cpassword` → toast error, halt.
   - POSTs to `account/register`.
6. Success (`data.success == 1`) → success toast → redirect to login.
7. Failure → error toast.

### Actor Interactions
- **Anonymous user** (not yet registered) — sole actor.

### Validation Rules
| Rule | Where Enforced |
|------|---------------|
| Password ≥ 6 characters | Client-side (`Register()`) |
| Password must match confirm password | Client-side (`Register()`) |
| Required fields (email, username, phone, country) | HTML `required` attributes |
| `IsMobileVerify` always starts as `false` | Hard-coded in `Register()` |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `country/GetAllCountry` | — | Populate country dropdown |
| GET | `state/GetAllStateByCountryId` | `CountryId` | Cascade state dropdown |
| GET | `city/GetAllCityByStateId` | `StateId` | Cascade city dropdown |
| POST | `account/register` | Full model object | Create new user account |

### Database Interactions
Reads: country, state, city lookup tables. Writes: new user record with hashed password, default role, `IsMobileVerify = false`.

### Edge Cases
- Country/state/city IDs are resolved by name-matching loop over cached arrays before calling the API — avoids sending display names as IDs.
- `data.success` is compared to integer `1`, not boolean `true`.

---

## 3. Forgot Password — `ForgotpasswordController`

### Module Purpose
Allows a registered user to request a password-reset email.

### Business Workflow (Step-by-Step)
1. Page loads → `init()` → sets model with empty email and current `appId`.
2. User enters email → submits `ResetPassword()`.
3. Email is lowercased before being sent.
4. Calls `GET account/forgotpasswordNew?email=&idApp=&AppName=`.
5. Success → toast with server message → clears email field → redirects to login after 1500 ms.
6. Failure:
   - `response.data.data === 'TOKEN'` → clears auth cookies → redirects to login (session expired).
   - Other error → shows error toast.

### Actor Interactions
- **Registered user** (any role) — sole actor.

### Validation Rules
| Rule | Where Enforced |
|------|---------------|
| Email lowercased before sending | `ResetPassword()` |
| Email must be registered | Server-side (returns error message) |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `account/forgotpasswordNew` | `email`, `idApp`, `AppName` | Trigger password-reset email |

### Database Interactions
Reads: user record by email. Writes: password-reset token to user record.

### Edge Cases
- `TOKEN` response code from server indicates the current session is already expired — forces clean logout.
- Email domain is not validated client-side; server handles unknown email addresses.

---

## 4. Change Password — `ChangePasswordController`

### Module Purpose
Allows a logged-in user to change their own password.

### Business Workflow (Step-by-Step)
1. User fills current password, new password, confirm new password.
2. Submits → `ChangePassword(o)` → POSTs to `account/changepassword`.
3. Success/failure toast shown.

### Actor Interactions
- Any authenticated user (any role).

### Validation Rules
- Current password and new password fields required (HTML level).
- New password vs confirm-new-password match typically enforced server-side.

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| POST | `account/changepassword` | `{oldPassword, newPassword, ...}` | Change password for authenticated user |

### Database Interactions
Reads: user record (verify current password). Writes: new hashed password.

### Edge Cases
- Admin-initiated password change for another user goes through `account/changepasswordNew` (in User module's `PasswordConfirmation` dialog), which first calls `account/passwordVerification` to confirm admin's own credentials.
