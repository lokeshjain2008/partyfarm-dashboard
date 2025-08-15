# Svelte 5 Migration Guide

This document outlines the key changes made to migrate the PartyFarm Dashboard to Svelte 5 with runes.

## Key Changes

### 1. State Management with Runes

**Before (Svelte 4):**
```javascript
import { writable, derived } from 'svelte/store';

const count = writable(0);
const doubled = derived(count, $count => $count * 2);
```

**After (Svelte 5):**
```javascript
let count = $state(0);
let doubled = $derived(count * 2);
```

### 2. Component Props

**Before (Svelte 4):**
```javascript
export let name;
export let age = 25;
```

**After (Svelte 5):**
```javascript
let { name, age = 25 } = $props();
```

### 3. Auth Context Implementation

We've moved from traditional Svelte stores to a context-based approach using runes:

**New Auth Context (`src/lib/contexts/auth.svelte.ts`):**
```typescript
export class AuthContext {
  user = $state<AuthUser | null>(null);
  session = $state<Session | null>(null);
  loading = $state(true);
  
  get isAuthenticated() {
    return !!this.user && !!this.session;
  }
}
```

**Usage in Components:**
```javascript
import { getAuthContext } from '$lib/contexts/auth.svelte.js';

const auth = getAuthContext();

// Access reactive state directly
{#if auth.loading}
  Loading...
{:else if auth.isAuthenticated}
  Welcome, {auth.user?.email}!
{/if}
```

### 4. Event Handling

**Before (Svelte 4):**
```svelte
<button on:click={handleClick}>Click me</button>
```

**After (Svelte 5):**
```svelte
<button onclick={handleClick}>Click me</button>
```

### 5. Reactive Statements

**Before (Svelte 4):**
```javascript
$: doubled = count * 2;
$: if (count > 10) {
  alert('Count is high!');
}
```

**After (Svelte 5):**
```javascript
let doubled = $derived(count * 2);

$effect(() => {
  if (count > 10) {
    alert('Count is high!');
  }
});
```

## Migration Steps Completed

### ✅ Auth System Migration

1. **Created new auth context** (`src/lib/contexts/auth.svelte.ts`)
   - Uses `$state` for reactive properties
   - Uses getters for derived values
   - Provides type-safe context access

2. **Updated layout** (`src/routes/+layout.svelte`)
   - Uses `setAuthContext()` to provide auth to entire app
   - Initializes auth listener on mount

3. **Updated auth callback** (`src/routes/auth/callback/+page.svelte`)
   - Uses `$state` for component state
   - Uses `getAuthContext()` to access auth
   - Removed deprecated `page` store usage

4. **Created example component** (`src/lib/components/AuthStatus.svelte`)
   - Shows how to use auth context in components
   - Demonstrates reactive state access

### ✅ Key Benefits

1. **Better Performance**: Runes provide more efficient reactivity
2. **Type Safety**: Better TypeScript integration
3. **Simpler API**: Less boilerplate code
4. **Future-Proof**: Aligned with Svelte's direction

## Usage Patterns

### Accessing Auth State

```javascript
import { getAuthContext } from '$lib/contexts/auth.svelte.js';

const auth = getAuthContext();

// Reactive access to auth state
{#if auth.loading}
  <LoadingSpinner />
{:else if auth.isAuthenticated}
  <UserDashboard user={auth.user} />
{:else}
  <LoginForm />
{/if}
```

### Role-Based Access Control

```javascript
const auth = getAuthContext();

{#if auth.isAdmin}
  <AdminPanel />
{:else if auth.isInHouseUser}
  <InHousePanel />
{:else if auth.isFarmhouseUser}
  <FarmhousePanel />
{/if}
```

### Reactive Effects

```javascript
import { getAuthContext } from '$lib/contexts/auth.svelte.js';

const auth = getAuthContext();

// React to auth state changes
$effect(() => {
  if (auth.isAuthenticated) {
    console.log('User signed in:', auth.user?.email);
  }
});
```

## Next Steps

When creating new components:

1. Use `$state()` for component state
2. Use `$derived()` for computed values
3. Use `$effect()` for side effects
4. Use `getAuthContext()` for auth access
5. Use `let { prop } = $props()` for component props

## Resources

- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [Runes Documentation](https://svelte.dev/docs/svelte/what-are-runes)
- [Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)