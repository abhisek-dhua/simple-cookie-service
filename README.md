# Simple Cookie Service

> Universal cookie management for the browser, Node.js, and all major frontend frameworks.

[![npm version](https://img.shields.io/npm/v/simple-cookie-service.svg)](https://www.npmjs.com/package/simple-cookie-service)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Version 3 is here!** Redesigned for modern development with JSON support, default configurations, event listeners, and specialized Node.js helpers.

## Features

- **Universal**: Works in Browser and Node.js (SSR).
- **Framework-Agnostic**: Compatible with React, Vue, Angular, Svelte, Next.js, Nuxt, Remix, SolidJS, Preact, and more.
- **Type-Safe**: Full TypeScript support.
- **Smart**: Automatically handles JSON objects/arrays.
- **Configurable**: Set default attributes (path, domain, secure) globally.
- **Reactive**: Listen for cookie changes.
- **Lightweight**: Zero dependencies (runtime).

## Supported Frameworks

This library is **framework-agnostic** and works with all major frontend libraries and meta-frameworks:

| Framework | Type | Notes |
|-----------|------|-------|
| **React** | UI Library | Use `useState` with `cookies.get()` for reactive state |
| **Vue** | UI Library | Works with Composition API and Options API |
| **Angular** | Platform | Works with standalone components and services |
| **Svelte** | UI Compiler | Works with Svelte 5 runes (`$state`) |
| **Preact** | UI Library | Drop-in React alternative, works with `preact/hooks` |
| **SolidJS** | UI Library | Works with `createSignal` for reactive state |
| **Next.js** | Meta-Framework | Use `'use client'` directive for client-side cookie access |
| **Nuxt** | Meta-Framework | Use dynamic imports (`await import()`) for SSR compatibility |
| **Remix** | Meta-Framework | Use client-side components for cookie management |
| **Astro** | Static Site Gen | Works with any UI framework integration |
| **Node.js** | Runtime | Use `parse()` and `serialize()` helpers for server-side cookies |

See the [`test/`](./test) directory for complete working examples with each framework.

## Installation

```sh
npm install simple-cookie-service
```

## Browser Usage

```js
import cookies from "simple-cookie-service";

// Basic Setter
cookies.set("token", "abc-123", { expires: 7 }); // expires in 7 days

// JSON Support (Auto Stringify/Parse)
cookies.set("user", { id: 1, role: "admin" });
const user = cookies.get("user"); // { id: 1, role: "admin" }

// Get with Generics (TypeScript)
const data = cookies.get<{ id: number }>("user");

// Configuration Defaults
// Create a new instance with defaults
const myCookies = cookies.withAttributes({ path: "/", secure: true });
myCookies.set("session", "xyz"); // Path=/; Secure

// Listen for Changes
const unsubscribe = cookies.addChangeListener((change) => {
  console.log("Cookie changed:", change);
});

// Remove
cookies.remove("token");
```

## Framework-Specific Examples

### React

```jsx
import { useState } from 'react';
import cookies from 'simple-cookie-service';

function App() {
  const [val, setVal] = useState(cookies.get('token') || '');

  const setCookie = () => {
    cookies.set('token', 'abc-123', { expires: 7 });
    setVal(cookies.get('token'));
  };

  return (
    <div>
      <button onClick={setCookie}>Set Cookie</button>
      <p>Value: {val}</p>
    </div>
  );
}
```

### Vue

```vue
<script setup>
import { ref } from 'vue';
import cookies from 'simple-cookie-service';

const val = ref(cookies.get('token') || '');

const setCookie = () => {
  cookies.set('token', 'abc-123', { expires: 7 });
  val.value = cookies.get('token');
};
</script>

<template>
  <button @click="setCookie">Set Cookie</button>
  <p>Value: {{ val }}</p>
</template>
```

### Angular

```typescript
import { Component } from '@angular/core';
import cookies from 'simple-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <button (click)="setCookie()">Set Cookie</button>
    <p>Value: {{ val }}</p>
  `,
})
export class AppComponent {
  val = cookies.get('token') || '';

  setCookie() {
    cookies.set('token', 'abc-123', { expires: 7 });
    this.val = cookies.get('token') || '';
  }
}
```

### Svelte

```svelte
<script>
  import cookies from 'simple-cookie-service';
  let val = $state(cookies.get('token') || '');

  function setCookie() {
    cookies.set('token', 'abc-123', { expires: 7 });
    val = cookies.get('token') || '';
  }
</script>

<button onclick={setCookie}>Set Cookie</button>
<p>Value: {val}</p>
```

### Next.js

```tsx
'use client'
import { useState } from 'react';
import cookies from 'simple-cookie-service';

export default function Home() {
  const [val, setVal] = useState(cookies.get('token') || '');
  // ... same as React example
}
```

## Node.js / SSR Usage

For Server-Side Rendering (Next.js, Remix, Nuxt, etc.), use the `parse` and `serialize` helpers.

```js
import { CookieManager } from "simple-cookie-service";

const cookies = new CookieManager();

// Parse Request Cookies
const reqCookies = cookies.parse(req.headers.cookie);

// Serialize Response Cookie
const setCookieHeader = cookies.serialize("auth", "token123", {
  httpOnly: true,
  maxAge: 3600,
  path: "/",
});
// "auth=token123; Max-Age=3600; Path=/; HttpOnly"
```

## API Reference

### `cookies.set(name, value, options?)`

Sets a cookie.
- **name**: Cookie name.
- **value**: String or Object (automatically JSON stringified if object).
- **options**: `CookieAttributes` (expires, path, domain, secure, sameSite).

### `cookies.get(name)`

Gets a cookie value. Returns `undefined` if not found. Automatically parses JSON if prefixed with internal marker.
- **name**: Cookie name.

### `cookies.getAll()`

Returns all cookies as a key-value object.

### `cookies.remove(name, options?)`

Removes a cookie.
- **options**: Must match the path/domain used to set the cookie.

### `cookies.withAttributes(defaultAttributes)`

Returns a new `CookieManager` instance with the given default attributes merged with the current ones.

### `cookies.addChangeListener(callback)`

Subscribe to changes performed by the library.
- **callback**: `(change: CookieChangeOptions) => void`
- Returns an unsubscribe function.

## License

MIT © [Abhisek Dhua](https://github.com/abhisek-dhua)
