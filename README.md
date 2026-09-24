# Vendli

Retail management and point of sale for multi-store businesses. React + TypeScript + Vite, Redux Toolkit / RTK Query, shadcn/ui.

## Getting started

```sh
npm install
cp .env.example .env   # defaults to demo mode, no backend needed
npm run dev            # http://localhost:8080
```

`.env` is git-ignored. For deployments, set the same variables in the host's environment settings (e.g. Vercel → Project → Settings → Environment Variables).

## Roles

| Role | Lands on | Can do |
|---|---|---|
| **Super Admin** | `/admin` | Everything, across all stores: catalogue, stores, staff of any role, stock transfers, settings. |
| **Store Admin** | `/admin` | Their own store only: dashboard, orders, stock, customers, POS staff. Can also use the POS and approve voids/returns. |
| **POS User** | `/pos` | Ring up sales and view their store's orders. Voids and returns need a store admin's approval. |

Store scoping is enforced by the API, not just the UI. `StoreSelect` locks to the user's store for store-scoped roles.

## Demo mode

With `VITE_USE_MOCK_API=true` (the default in `.env.example`), every API call is served in the browser from `src/mocks/db.json`: 5 stores, 45 products, 64 customers and roughly 500 orders over the past year. Dates are shifted on load so "today" always has activity. Changes persist in `localStorage` under `vendli-mock-db`; clear that key to reset the data.

Demo accounts (password `Demo@123`), also available as one-click buttons on the sign-in page:

- `superadmin@vendli.ng`
- `storeadmin@vendli.ng` (Victoria Island Store)
- `pos@vendli.ng` (Victoria Island Store)

Set `VITE_USE_MOCK_API=false` to use the real API at `VITE_API_URL`. The mock code and seed are lazy-loaded, so they aren't downloaded when mock mode is off.

## Scripts

| Command | |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:mock` | Smoke-tests the mock API, including role and permission rules |

## Layout

```
src/
  lib/          roles, enums, pricing, formatting, csv, error helpers
  redux/        store, auth + cart slices, RTK Query services
  mocks/        demo API: router, handlers per domain, JSON seed
  hooks/        useAuth, useCart, useNotifications, ...
  components/
    common/     shared building blocks (StatCard, StoreSelect, Pager, FormField, ...)
    admin/      admin sections (registered in admin/sections.ts)
    pos/        till UI
  pages/        route-level pages (lazy loaded)
```

## Backend notes

The mock follows the existing API contract, plus one endpoint the real backend will need:

- `POST /Order/{id}/reverse` with `{ type: "void" | "return", reason, approverEmail, approverPassword }`. The server checks that the approver is a store admin for that store (or a super admin), then restores stock and refunds loyalty points.

It also expects the backend to enforce the same rules: store-scoped roles are pinned to their own store, prices and discounts are taken from the catalogue rather than the client, and only super admins can edit the catalogue or transfer stock.
