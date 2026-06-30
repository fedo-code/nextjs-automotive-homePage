# API Namespace Guide

This project uses two parallel authentication-related API namespaces by design.

The code is working and should remain unchanged. This file only defines ownership so teams avoid confusion.

## Route Ownership

- `/api/auth/*`: End-user authentication and user session APIs.
- `/api/admin/*`: Admin authentication and admin-only content management APIs.
- `/api/content/*`: Public content read APIs used by the storefront.

## Why Both `/api/auth` And `/api/admin` Exist

- Admin and user flows use different session helpers and validation logic.
- Admin APIs support back-office actions (gallery, featured vehicles, upload, users).
- User auth APIs support customer-facing login/register/me/logout flows.

## Endpoint Map

### `/api/auth/*` (User Identity)

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET/POST /api/auth/[...nextauth]`
- `GET/POST /api/auth/authorized-emails`

### `/api/admin/*` (Admin Identity + Admin CMS)

- `POST /api/admin/login`
- `POST /api/admin/register`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `GET /api/admin/users`
- `POST /api/admin/upload`
- `GET/POST /api/admin/gallery`
- `PUT/DELETE /api/admin/gallery/[id]`
- `GET/POST /api/admin/featured-vehicles`
- `PUT/DELETE /api/admin/featured-vehicles/[id]`

### `/api/content/*` (Public Catalog Content)

- `GET /api/content`
- `GET /api/content/vehicle/[id]`

## Team Rules (Non-Breaking)

- Do not call `/api/admin/*` from public customer UI.
- Keep `/api/auth/*` focused on end-user identity.
- Keep `/api/admin/*` focused on admin identity and admin operations.
- When adding a new auth endpoint, choose namespace by actor first:
  - customer/user -> `/api/auth/*`
  - admin/staff -> `/api/admin/*`

## Optional Future Cleanup (No Immediate Change Required)

- If needed later, keep current routes for compatibility and add a versioned namespace (`/api/v1/*`) with clearer naming.
- Do not remove existing endpoints without a migration window.
