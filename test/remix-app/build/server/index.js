var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
var CookieManager = class _CookieManager {
  constructor(config) {
    __publicField(this, "defaultAttributes");
    __publicField(this, "converter");
    __publicField(this, "listeners", /* @__PURE__ */ new Set());
    this.defaultAttributes = {
      path: "/",
      ...config == null ? void 0 : config.defaultAttributes
    };
    this.converter = config == null ? void 0 : config.converter;
  }
  /**
   * Set a cookie (browser only)
   */
  set(name, value, options) {
    var _a;
    if (!isBrowser()) return;
    const opts = { ...this.defaultAttributes, ...options };
    const stringValue = typeof ((_a = this.converter) == null ? void 0 : _a.write) === "function" ? this.converter.write(value, name) : typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(
      stringValue
    )}`;
    if (opts.expires) {
      let date;
      if (typeof opts.expires === "number") {
        date = /* @__PURE__ */ new Date();
        date.setDate(date.getDate() + opts.expires);
      } else {
        date = opts.expires;
      }
      cookieStr += `; Expires=${date.toUTCString()}`;
    }
    if (opts.path) cookieStr += `; Path=${opts.path}`;
    if (opts.domain) cookieStr += `; Domain=${opts.domain}`;
    if (opts.sameSite) cookieStr += `; SameSite=${opts.sameSite}`;
    if (opts.secure) cookieStr += `; Secure`;
    document.cookie = cookieStr;
    this.notifyChange({ name, value, options: opts });
  }
  /**
   * Get a cookie value by name (browser only)
   */
  get(name) {
    if (!isBrowser()) return void 0;
    const cookies2 = this.getAll();
    return cookies2[name];
  }
  /**
   * Get all cookies (browser only)
   */
  getAll() {
    var _a;
    if (!isBrowser()) return {};
    const cookies2 = {};
    const documentCookie = document.cookie || "";
    if (documentCookie === "") return cookies2;
    const parts = documentCookie.split("; ");
    for (const part of parts) {
      const [k, ...v] = part.split("=");
      if (!k) continue;
      const key = decodeURIComponent(k);
      let value = v.join("=");
      try {
        value = decodeURIComponent(value);
      } catch (e) {
      }
      if ((_a = this.converter) == null ? void 0 : _a.read) {
        value = this.converter.read(value, key);
      }
      let parsedValue = value;
      if (value.startsWith("j:")) {
        try {
          parsedValue = JSON.parse(value.substring(2));
        } catch (e) {
        }
      }
      cookies2[key] = parsedValue;
    }
    return cookies2;
  }
  /**
   * Remove a cookie (browser only)
   */
  remove(name, options) {
    if (!isBrowser()) return;
    const opts = { ...this.defaultAttributes, ...options };
    this.set(name, "", {
      ...opts,
      expires: -1
    });
    this.notifyChange({ name, deleted: true, options: opts });
  }
  /**
   * Add a listener for cookie changes made via this API
   */
  addChangeListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  notifyChange(event) {
    this.listeners.forEach((listener) => listener(event));
  }
  /**
   * Create a new instance with different default configuration
   */
  withAttributes(attributes) {
    return new _CookieManager({
      defaultAttributes: { ...this.defaultAttributes, ...attributes },
      converter: this.converter
    });
  }
  /**
   * Parse a cookie header string (Node.js/SSR helper)
   */
  parse(cookieHeader) {
    const cookies2 = {};
    if (!cookieHeader) return cookies2;
    cookieHeader.split(";").forEach((cookie) => {
      const [k, ...v] = cookie.trim().split("=");
      if (!k) return;
      try {
        const key = decodeURIComponent(k);
        const val = decodeURIComponent(v.join("="));
        cookies2[key] = val;
      } catch (e) {
      }
    });
    return cookies2;
  }
  /**
   * Serialize a cookie (Node.js/SSR helper)
   */
  serialize(name, value, options) {
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    if (options) {
      if (options.expires) {
        let date;
        if (typeof options.expires === "number") {
          date = /* @__PURE__ */ new Date();
          date.setDate(date.getDate() + options.expires);
        } else {
          date = options.expires;
        }
        cookieStr += `; Expires=${date.toUTCString()}`;
      }
      if (options.path) cookieStr += `; Path=${options.path}`;
      if (options.domain) cookieStr += `; Domain=${options.domain}`;
      if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;
      if (options.secure) cookieStr += `; Secure`;
    }
    return cookieStr;
  }
};
var cookies = new CookieManager();
var index_default = cookies;
function Index() {
  const [val, setVal] = useState(index_default.get("test_remix") || "");
  const setCookie = () => {
    index_default.set(
      "test_remix",
      "Hello from Remix " + (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      { expires: 1 }
    );
    setVal(index_default.get("test_remix") || "");
  };
  const clearCookie = () => {
    index_default.remove("test_remix");
    setVal(index_default.get("test_remix") || "");
  };
  return /* @__PURE__ */ jsxs("div", { style: { padding: "20px", fontFamily: "sans-serif" }, children: [
    /* @__PURE__ */ jsx("h1", { children: "Remix Cookie Test" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: setCookie,
        style: { padding: "10px", cursor: "pointer" },
        children: "Set Cookie"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: clearCookie,
        style: { padding: "10px", marginLeft: "10px", cursor: "pointer" },
        children: "Clear Cookie"
      }
    ),
    /* @__PURE__ */ jsxs("p", { children: [
      "Value: ",
      /* @__PURE__ */ jsx("strong", { children: val })
    ] })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-2nPXTF-a.js", "imports": ["/assets/index-BJHAE5s4.js", "/assets/components-bylm_Btn.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-D1UajonG.js", "imports": ["/assets/index-BJHAE5s4.js", "/assets/components-bylm_Btn.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DxGqXVC1.js", "imports": ["/assets/index-BJHAE5s4.js"], "css": [] } }, "url": "/assets/manifest-bb4c1267.js", "version": "bb4c1267" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
