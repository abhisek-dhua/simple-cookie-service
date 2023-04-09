Simple cookie service library.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install simple-cookie-service
```

## API

```js
import { SimpleCookieService } from "simple-cookie-service";
```

**note** This package is ESM only, node 12+ needed to use it and must be imported instead of require.

### cookie.setItem(name, value, options: { expires, path, sameSite, domain, secure})

setItem a cookie name-value pair into a `Set-Cookie` header string. The `name` argument is the
name for the cookie, the `value` argument is the value to set the cookie, and provide options as object.

```js
SimpleCookieService.setItem("token", "your_token");
// token=your_token
// key was "token" and value was "your_token"
```

## Options Object

`cookie.setItem` accepts these properties as the options object.

#### Expires

Specifies the `Date` object to be the value for the [`Expires` `Set-Cookie` attribute][rfc-6265-5.2.1].
By default, no expiration is set, and most clients will consider this a "non-persistent cookie" and
will delete it on a condition like exiting a web browser application.

**note** You can use number for day or Date object.

```js
const date = new Date();
date.setDate(date.getDate() + 1); // expire on next date = 1 day expiry
SimpleCookieService.setItem("token", "your_token", {
  sameSite: "Lax",
  secure: true,
  expires: 365,
  // domain: 'xyz.com',
  // path: '/',
});
or;
SimpleCookieService.setItem("token", "your_token", {
  sameSite: "Lax",
  secure: true,
  expires: date,
  // domain: 'xyz.com',
  // path: '/',
});
```

#### Path :

Specifies the value for the [`Path` `Set-Cookie` attribute][rfc-6265-5.2.4]. By default, the path
is considered the ["default path"][rfc-6265-5.1.4].

#### SameSite :

Specifies the `boolean` or `string` to be the value for the [`SameSite` `Set-Cookie` attribute][rfc-6265bis-09-5.4.7].

- `true` will set the `SameSite` attribute to `Strict` for strict same site enforcement.
- `false` will not set the `SameSite` attribute.
- `'lax'` will set the `SameSite` attribute to `Lax` for lax same site enforcement.
- `'none'` will set the `SameSite` attribute to `None` for an explicit cross-site cookie.
- `'strict'` will set the `SameSite` attribute to `Strict` for strict same site enforcement.

More information about the different enforcement levels can be found in
[the specification][rfc-6265bis-09-5.4.7].

**note** This is an attribute that has not yet been fully standardized, and may change in the future.
This also means many clients may ignore this attribute until they understand it.

#### Domain :

Specifies the value for the [`Domain` `Set-Cookie` attribute][rfc-6265-5.2.3]. By default, no
domain is set, and most clients will consider the cookie to apply to only the current domain.

#### Secure :

Specifies the `boolean` value for the [`Secure` `Set-Cookie` attribute][rfc-6265-5.2.5]. When truthy,
the `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.

**note** be careful when setting this to `true`, as compliant clients will not send the cookie back to
the server in the future if the browser does not have an HTTPS connection.

## Example

The following example uses this module in conjunction with the Node.js core HTTP server
to prompt a user for their name and display it back on future visits.

```js
// For JavaScript & TypeScript Project
import { SimpleCookieService } from "simple-cookie-service";

// For Class base project
constructor(private cookie:SimpleCookieService){}

// If use dependency injection in constructor
yourFunction = () => {
  // here 365 = 365 days expire you can use Date also
  this.cookie.setItem("token", "your_token", {
    sameSite: "Lax",
    secure: true,
    expires: 365,
    // domain: 'xyz.com',
    // path: '/',
  }); // set cookie value
  console.log(this.cookie.getItem("token")); // get cookie value
  setTimeout(() => {
    this.cookie.removeItem("token"); // delete cookie value
  }, 3000);
};
yourFunction(); // call your function

// You can also call like this
yourFunction = () => {
  // here 365 = 365 days expire you can use Date also
  SimpleCookieService.setItem("token", "your_token", {
    sameSite: "Lax",
    secure: true,
    expires: 365,
    // domain: 'xyz.com',
    // path: '/',
  }); // set cookie value
  console.log(SimpleCookieService.getItem("token")); // get cookie value
  setTimeout(() => {
    SimpleCookieService.removeItem("token"); // delete cookie value
  }, 3000);
};
yourFunction(); // call your function
```

## References

- [RFC 6265: HTTP State Management Mechanism][rfc-6265]
- [Same-site Cookies][rfc-6265bis-09-5.4.7]

[rfc-west-cookie-priority-00-4.1]: https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1
[rfc-6265bis-09-5.4.7]: https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7
[rfc-6265]: https://tools.ietf.org/html/rfc6265
[rfc-6265-5.1.4]: https://tools.ietf.org/html/rfc6265#section-5.1.4
[rfc-6265-5.2.1]: https://tools.ietf.org/html/rfc6265#section-5.2.1
[rfc-6265-5.2.2]: https://tools.ietf.org/html/rfc6265#section-5.2.2
[rfc-6265-5.2.3]: https://tools.ietf.org/html/rfc6265#section-5.2.3
[rfc-6265-5.2.4]: https://tools.ietf.org/html/rfc6265#section-5.2.4
[rfc-6265-5.2.5]: https://tools.ietf.org/html/rfc6265#section-5.2.5
[rfc-6265-5.2.6]: https://tools.ietf.org/html/rfc6265#section-5.2.6
[rfc-6265-5.3]: https://tools.ietf.org/html/rfc6265#section-5.3
