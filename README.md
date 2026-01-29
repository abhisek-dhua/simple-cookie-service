# Simple Cookie Service

> Universal cookie management for the browser and Node.js.

[![npm version](https://img.shields.io/npm/v/simple-cookie-service.svg)](https://www.npmjs.com/package/simple-cookie-service)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Version 3 is here!** Redesigned for modern development with JSON support, default configurations, event listeners, and specialized Node.js helpers.

## Features

- **Universal**: Works in Browser and Node.js (SSR).
- **Type-Safe**: Full TypeScript support.
- **Smart**: Automatically handles JSON objects/arrays.
- **Configurable**: Set default attributes (path, domain, secure) globally.
- **Reactive**: Listen for cookie changes.
- **Lightweight**: Zero dependencies (runtime).

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

## Node.js / SSR Usage

For Server-Side Rendering (Next.js, Remix, etc.), use the `parse` and `serialize` helpers.

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
