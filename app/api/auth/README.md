# User Auth API Scope

This folder is the user auth namespace: `/api/auth/*`.

## Intended Consumers

- Public/customer-facing UI
- Client auth state checks

## Responsibilities

- User authentication lifecycle: login, register, me, logout
- NextAuth integration
- Authorized email list access used by auth flows

## Guardrails

- Keep this namespace focused on user identity.
- Do not place admin content-management endpoints here.
- Admin-only operations must remain in `/api/admin/*`.
