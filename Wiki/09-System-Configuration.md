# System Configuration Modules

Covers: `AppInfo` (AppInfoController), `Module` (ModuleController), `MainSetting` (MainSettingController), `EmailSetting` (EmailSettingController), `EmailTemplate` (EmailTemplateController)

---

## 1. App Info — `AppInfoController`

### Module Purpose
Manage tenant application configurations in this multi-tenant platform. Each "App Info" record defines a separate application instance with its own branding (logo, name), settings, and user base. Super Admins can create and manage multiple app tenants from this module.

### Business Workflow (Step-by-Step)
1. **List:** DataTable shows all configured app tenants.
2. **Create / Edit app:**
   a. Fill app name, description, and other configuration fields.
   b. Optionally upload a logo image file.
   c. Submit → `POST appinfo/SaveAppInfo`.
   d. **If logo selected:** `POST appinfo/uploadFile` (multipart) → uploads logo file to `MediaUploads/FileUpload/`.
3. **Delete app:** Confirmation dialog → `GET appinfo/DeleteAppInfo?id=`.

### Actor Interactions
- Super Admin only — tenant creation is a platform-level operation.

### Validation Rules
| Rule | Enforcement |
|------|------------|
| App name required | HTML `required` |
| Logo file type (image) | Server-side on upload |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| POST | `appinfo/SaveAppInfo` | Full app model | Create / update app tenant |
| POST | `appinfo/uploadFile` (multipart) | FormData with logo file | Upload app branding logo |
| GET | `appinfo/DeleteAppInfo` | `id` | Delete app tenant |

**Boot-time endpoints** (called from `index.run.js`, not this controller):
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `appinfo/GetAppInfoByAdmin` | `domain` | Resolve app config by admin domain at boot |
| GET | `appinfo/GetAppInfoByName` | `appName` | Fallback app config resolution |
| GET | `appinfo/GetAllInfoList` | — | App list used by all other modules |

### Database Interactions
Reads: app tenant records.  
Writes: app record (create/update), logo file path, soft-delete flag.

### Edge Cases
- Logo upload is a separate step after `SaveAppInfo` succeeds — a failed upload leaves the record without a logo (no rollback).
- Deleting an app tenant with active users, devices, or orders may fail server-side due to FK constraints.
- The resolved `appId` from boot is stored in `localStorage` and used as the global context for the entire session.

---

## 2. Module — `ModuleController`

### Module Purpose
Manage the system module registry — the list of named pages/features that appear in the sidebar navigation and can have permissions assigned. Adding a new module here makes it available for permission assignment in `UserPermission`.

### Business Workflow (Step-by-Step)
1. **List:** `GET module/GetAllModuleName` → shows all registered modules.
2. **Create module:** Fill module name, icon, route → `POST module/CreateModule`.
3. **Edit module:** `POST module/UpdateModule`.
4. **Delete module (safe):** Confirmation → `GET module/DeleteModule/:id` — only removes the module record.
5. **Delete module + permissions (cascade):** Second confirmation dialog → `GET module/DeleteModuleAndpermission/:id` — removes module AND all role-permission mappings for it.

### Actor Interactions
- Super Admin only.

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Module name required | HTML `required` |
| Cascade delete requires explicit second confirmation | Two-step dialog |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `module/GetAllModuleName` | — | List all registered modules |
| POST | `module/CreateModule` | Module object | Add new module |
| POST | `module/UpdateModule` | Module object | Edit existing module |
| GET | `module/DeleteModule/:id` | Route param: `id` | Delete module only |
| GET | `module/DeleteModuleAndpermission/:id` | Route param: `id` | Delete module + cascade permissions |

### Database Interactions
Reads: module registry records.  
Writes: module record (create/update/delete), cascading delete of role-permission records on `DeleteModuleAndpermission`.

### Edge Cases
- **Two-step delete:** The first delete attempt checks if the module has associated permissions. If yes, it prompts for cascade delete. If no, it proceeds with simple delete.
- Deleting a module without cascade leaves orphaned permission records — use cascade delete to keep DB clean.
- Modules added here must also have corresponding AngularJS routes and controllers to function.

---

## 3. Main Setting — `MainSettingController`

### Module Purpose
Manage arbitrary system-wide key-value configuration settings (e.g., API keys, feature flags, service URLs, currency configuration, rate limits).

### Business Workflow (Step-by-Step)
1. **Load settings:** `GET mainsetting/GetAllSetting` → renders list of key-value pairs.
2. **Add / Edit setting:** Fill key name and value → `POST mainsetting/SaveSetting`.
3. **Delete setting:** Confirmation → `GET mainsetting/DeleteSettingeById?id=`.

### Actor Interactions
- Super Admin only.

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Key name required | HTML `required` |
| Value required | HTML `required` |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `mainsetting/GetAllSetting` | — | Load all settings |
| POST | `mainsetting/SaveSetting` | `{key, value, ...}` | Create / update setting |
| GET | `mainsetting/DeleteSettingeById` | `id` | Delete setting |

### Database Interactions
Reads: settings key-value records.  
Writes: setting record (create/update/delete).

### Edge Cases
- `DeleteSettingeById` — note the typo in the endpoint name (`Settinge` instead of `Setting`) — this is the actual endpoint name in production.
- Changing a critical system setting (e.g., payment gateway key) takes effect immediately without restart.

---

## 4. Email Setting — `EmailSettingController`

### Module Purpose
Configure SMTP email server settings per application tenant. Each app can have its own email sender identity (from address, SMTP host, port, credentials) used for system notifications, renewal reminders, and password resets.

### Business Workflow (Step-by-Step)
1. **Init:** Loads app list (`Email/GetAllEmailSettingNew`) → shows all configured email settings.
2. **Load specific setting:** `GET Email/GetEmailSetting?id=` → populates the edit form.
3. **Save:** Fill SMTP host, port, username, password, from email, from name → `POST Email/SaveEmailSetting`.
4. The saved configuration is used by the server for all outbound emails for that app.

### Actor Interactions
- Super Admin, Admin (own app).

### Validation Rules
| Rule | Enforcement |
|------|------------|
| SMTP host required | HTML `required` |
| Port required (numeric) | HTML `required`, `type="number"` |
| SMTP username required | HTML `required` |
| From email required (valid email format) | HTML `required`, `type="email"` |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `Email/GetAllEmailSettingNew` | — | List all email settings (by app) |
| GET | `Email/GetEmailSetting` | `id` | Load single email setting |
| POST | `Email/SaveEmailSetting` | Full SMTP config object | Save email configuration |

### Database Interactions
Reads: email SMTP configuration records.  
Writes: SMTP configuration record (create/update).

### Edge Cases
- SMTP credentials are stored in the database — ensure server-side encryption for passwords at rest.
- Multiple apps can have different email identities — tenants appear to send from their own domain.

---

## 5. Email Template — `EmailTemplateController`

### Module Purpose
Manage HTML email templates used by the system for transactional emails: account registration confirmation, subscription renewal reminders, alarm notifications, password resets, etc.

### Business Workflow (Step-by-Step)
1. **List:** `GET email/GetAllEmailTemplate` → shows all templates with their names and types.
2. **Create / Edit template:** Opens `EmailTemplateModel` dialog → fill template name, type, HTML body → `POST email/SaveEmailTemplate`.
3. **Delete template:** Confirmation → `GET email/DeleteEmailTemplate?id=`.

### Actor Interactions
- Super Admin, Admin.

### Validation Rules
| Rule | Enforcement |
|------|------------|
| Template name required | HTML `required` |
| Template body (HTML) required | HTML `required` / textarea |
| Template type required | Dropdown required |

### API Endpoints
| Method | Endpoint | Params | Purpose |
|--------|----------|--------|---------|
| GET | `email/GetAllEmailTemplate` | — | List all email templates |
| POST | `email/SaveEmailTemplate` | Template object | Create / update template |
| GET | `email/DeleteEmailTemplate` | `id` | Delete template |

### Database Interactions
Reads: email template records.  
Writes: template record (create/update/delete).

### Edge Cases
- Email templates likely use placeholder tokens (e.g., `{{CustomerName}}`, `{{DeviceId}}`) resolved server-side at send time — the UI stores raw HTML without validation of token syntax.
- Deleting a template that is actively referenced by a system trigger (e.g., renewal reminder) may cause email failures — no client-side warning.
