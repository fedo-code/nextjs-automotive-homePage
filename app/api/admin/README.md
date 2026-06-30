# Admin API Scope

This folder is the admin namespace: `/api/admin/*`.

## Intended Consumers

- Admin panel UI
- Internal back-office tools

## Responsibilities

- Admin authentication lifecycle: login, register, me, logout
- Admin-managed resources: gallery, featured vehicles, uploads, users

## Guardrails

- Keep responses safe for back-office clients.
- Do not add public storefront endpoints here.
- If an endpoint can be used by anonymous/public traffic, place it in `/api/content/*` instead.
