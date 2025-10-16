## IDRA Dashboard

Dashboard for minting and redeeming IDRA, with live estimates, transaction history, and wallet integration.

### Features

- Mint with QRIS/Virtual Account (BNI/BRI) and live estimate
- Redeem to bank accounts with live estimate and confirmation
- Transactions list with compact cards, status badges, explorer links
- Detail modals for mint and redeem
- Wallet connection (wagmi) and responsive UI (shadcn/ui)

### Tech Stack

- Next.js (App Router), React, TypeScript
- React Query, Zod
- wagmi + viem
- Tailwind + shadcn/ui

### Getting Started

1. Install deps: `pnpm i` (or npm/yarn)
2. Run dev: `pnpm dev`
3. Open `http://localhost:3000`

### Environment

- Configure API base, auth, and chains in `.env`
- Explorer support via `getExplorerTxUrl` (polygon, base-sepolia)

### Architecture

- Services → Hooks → Components
- React Query for server state with stable query keys
- Schemas under `features/<domain>/schema`, services in `services`, hooks in `hooks`

### API Contracts (high-level)

- Mint
  - Create: `MintCreateBodySchema`
  - Estimate: returns amounts and fees
  - Data: currencies, amounts, fees, instructions, statuses
- Redeem
  - Create: `RedeemCreateBodySchema`
  - Estimate: returns amounts and fees
  - Data: currencies, amounts, fees, bank recipient, statuses
- Transactions
  - `UnifiedTransaction` with `chainId`, hashes, status, timestamps

### Coding Standards

- Schemas and Types
  - Define Zod schemas and TS types for every request/response
  - Validate all network IO in services with Zod before returning
  - Export inferred types; colocate schemas per feature
- Services & Hooks
  - Services parse and narrow responses; no raw `any`
  - Hooks expose typed data, use `queryKeys`, debounce estimates
- Error Handling
  - Show actionable messages for validation failures
  - Don’t silently catch; map to UI-safe errors
- State & Caching
  - Use React Query; avoid duplicating cache in component state
  - Include params/body in keys for estimate queries
- Components
  - Keep presentational; use hooks for data fetching
  - Use small, composable components
- Naming & Style
  - Descriptive names, no abbreviations, avoid `any`
  - Tailwind utilities, dark-mode friendly classes

### Deployment

- Build: `pnpm build`
- Configure production env vars (API, auth, chains)
