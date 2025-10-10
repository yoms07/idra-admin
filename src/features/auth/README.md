# Authentication Feature

This feature provides authentication functionality using Sign-In with Ethereum (SIWE) and React Query for state management.

## Overview

The authentication system consists of:

- **Auth Service**: API calls for nonce, verify, and user profile endpoints
- **Auth Hooks**: React Query hooks for authentication operations
- **Auth Schemas**: TypeScript types and Zod validation schemas
- **Query Keys**: Factory for React Query cache keys

## API Endpoints

### Get Nonce

```typescript
POST /api/auth/nonce
{
  "walletAddress": "0x9aC48Bf1E1500Fd7e8a4d98404cdc2F71987bcC7"
}
```

### Verify SIWE

```typescript
POST /api/auth/verify
{
  "message": "idra.xellar.co wants you to sign in with your Ethereum account:\n0x9aC48Bf1E1500Fd7e8a4d98404cdc2F71987bcC7\n\nSign in with Ethereum to the app.\n\nURI: http://localhost\nVersion: 1\nChain ID: 31337\nNonce: qnp8enc8k1fowd9lojf6z9\nIssued At: 2025-10-10T04:20:45.714Z",
  "signature": "0x141fd119be8957933ec25bf3fd98656c335a68958a4bc19bd702087637d399a15aa682411997035a340467f76179ee23f0251d42c8753a0ee5fe8fc1ab7bbffe1b"
}
```

### Get User Profile

```typescript
GET / api / auth / me;
Authorization: Bearer<token>;
```

## Usage

### Basic Authentication Flow

```typescript
import { useGetNonce, useVerifySignature, useIsAuthenticated } from '@/features/auth';

function LoginComponent() {
  const { mutate: getNonce } = useGetNonce();
  const { mutate: verifySignature } = useVerifySignature();
  const { isAuthenticated, user } = useIsAuthenticated();

  const handleLogin = async (walletAddress: string) => {
    // Step 1: Get nonce
    getNonce({ walletAddress }, {
      onSuccess: (data) => {
        // Step 2: Sign the message with wallet
        const signature = await signMessage(data.message);

        // Step 3: Verify signature
        verifySignature({ message: data.message, signature });
      }
    });
  };

  if (isAuthenticated) {
    return <div>Welcome, {user?.walletAddress}</div>;
  }

  return <button onClick={() => handleLogin('0x...')}>Login</button>;
}
```

### Available Hooks

#### `useGetNonce()`

Gets a nonce for wallet authentication.

```typescript
const { mutate: getNonce, data, isPending, error } = useGetNonce();

getNonce({ walletAddress: "0x..." });
```

#### `useVerifySignature()`

Verifies SIWE signature and stores auth token.

```typescript
const { mutate: verifySignature, isPending, error } = useVerifySignature();

verifySignature({ message: "...", signature: "0x..." });
```

#### `useMe()`

Fetches current user profile.

```typescript
const { data: user, isLoading, error } = useMe();
```

#### `useIsAuthenticated()`

Checks if user is authenticated.

```typescript
const { isAuthenticated, isLoading, user } = useIsAuthenticated();
```

#### `useLogout()`

Logs out user and clears auth data.

```typescript
const { mutate: logout } = useLogout();

logout();
```

## Token Management

The authentication system automatically:

- Stores JWT tokens in localStorage after successful verification
- Attaches tokens to API requests via HTTP interceptor
- Clears tokens on logout

## Error Handling

All hooks return error states that can be handled:

```typescript
const { mutate: getNonce, error } = useGetNonce();

if (error) {
  console.error("Authentication failed:", error);
}
```

## TypeScript Support

Full TypeScript support with proper types for all API requests and responses:

```typescript
import type { NonceRequest, VerifyRequest, AuthUser } from "@/features/auth";
```

## Migration from Zustand

This auth system replaces the Zustand-based authentication in `appStore.ts`. The main differences:

- **State Management**: Uses React Query instead of Zustand
- **Caching**: Automatic caching and background updates
- **Server State**: Proper handling of server state vs client state
- **Error Handling**: Built-in error states and retry logic
- **Loading States**: Automatic loading state management

## Example Component

See `AuthExample.tsx` for a complete working example of the authentication flow.
