// Utility to detect environment
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

export type SameSite = "Lax" | "None" | "Strict"

export interface CookieAttributes {
  expires?: number | Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: SameSite
  [property: string]: any
}

export interface CookieChangeOptions {
  name: string
  value?: any
  options?: CookieAttributes
  deleted?: boolean
}

export type CookieChangeListener = (options: CookieChangeOptions) => void

export interface Converter {
  read: (value: string, name: string) => string
  write: (value: string | object, name: string) => string
}

export interface CookieManagerConfig {
  defaultAttributes?: CookieAttributes
  converter?: Converter
}

/**
 * Universal Cookie Manager
 * Works in browser and provides helpers for Node.js
 */
export class CookieManager {
  private defaultAttributes: CookieAttributes
  private converter: Converter | undefined
  private listeners: Set<CookieChangeListener> = new Set()

  constructor(config?: CookieManagerConfig) {
    this.defaultAttributes = {
      path: "/",
      ...config?.defaultAttributes,
    }
    this.converter = config?.converter
  }

  /**
   * Set a cookie (browser only)
   */
  set(name: string, value: any, options?: CookieAttributes): void {
    if (!isBrowser()) return

    const opts = { ...this.defaultAttributes, ...options }
    const stringValue =
      typeof this.converter?.write === "function"
        ? this.converter.write(value, name)
        : typeof value === "object"
        ? "j:" + JSON.stringify(value)
        : String(value)

    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(
      stringValue
    )}`

    if (opts.expires) {
      let date: Date
      if (typeof opts.expires === "number") {
        date = new Date()
        date.setDate(date.getDate() + opts.expires)
      } else {
        date = opts.expires
      }
      cookieStr += `; Expires=${date.toUTCString()}`
    }

    if (opts.path) cookieStr += `; Path=${opts.path}`
    if (opts.domain) cookieStr += `; Domain=${opts.domain}`
    if (opts.sameSite) cookieStr += `; SameSite=${opts.sameSite}`
    if (opts.secure) cookieStr += `; Secure`

    document.cookie = cookieStr
    this.notifyChange({ name, value, options: opts })
  }

  /**
   * Get a cookie value by name (browser only)
   */
  get<T = any>(name: string): T | undefined {
    if (!isBrowser()) return undefined
    const cookies = this.getAll<T>()
    return cookies[name]
  }

  /**
   * Get all cookies (browser only)
   */
  getAll<T = any>(): Record<string, T> {
    if (!isBrowser()) return {}

    const cookies: Record<string, T> = {}
    const documentCookie = document.cookie || ""

    if (documentCookie === "") return cookies

    const parts = documentCookie.split("; ")
    for (const part of parts) {
      const [k, ...v] = part.split("=")
      if (!k) continue

      const key = decodeURIComponent(k)
      let value = v.join("=")
      
      try {
        value = decodeURIComponent(value)
      } catch (e) {
        // keep original value if decode fails
      }

      if (this.converter?.read) {
        value = this.converter.read(value, key)
      }

      let parsedValue: any = value
      if (value.startsWith("j:")) {
        try {
          parsedValue = JSON.parse(value.substring(2))
        } catch (e) {
          // parse error, return as string
        }
      }

      cookies[key] = parsedValue
    }

    return cookies
  }

  /**
   * Remove a cookie (browser only)
   */
  remove(name: string, options?: CookieAttributes): void {
    if (!isBrowser()) return
    const opts = { ...this.defaultAttributes, ...options }
    this.set(name, "", {
      ...opts,
      expires: -1,
    })
    this.notifyChange({ name, deleted: true, options: opts })
  }

  /**
   * Add a listener for cookie changes made via this API
   */
  addChangeListener(callback: CookieChangeListener): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private notifyChange(event: CookieChangeOptions) {
    this.listeners.forEach((listener) => listener(event))
  }

  /**
   * Create a new instance with different default configuration
   */
  withAttributes(attributes: CookieAttributes): CookieManager {
    return new CookieManager({
      defaultAttributes: { ...this.defaultAttributes, ...attributes },
      converter: this.converter,
    })
  }

  /**
   * Parse a cookie header string (Node.js/SSR helper)
   */
  parse(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {}
    if (!cookieHeader) return cookies
    
    cookieHeader.split(";").forEach((cookie) => {
      const [k, ...v] = cookie.trim().split("=")
      if (!k) return
      
      try {
        const key = decodeURIComponent(k)
        const val = decodeURIComponent(v.join("="))
        cookies[key] = val
      } catch (e) {
        // ignore malformed
      }
    })
    return cookies
  }

  /**
   * Serialize a cookie (Node.js/SSR helper)
   */
  serialize(name: string, value: string, options?: CookieAttributes): string {
     let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
     if (options) {
       if (options.expires) {
         let date: Date
         if (typeof options.expires === "number") {
           date = new Date()
           date.setDate(date.getDate() + options.expires)
         } else {
           date = options.expires
         }
         cookieStr += `; Expires=${date.toUTCString()}`
       }
       if (options.path) cookieStr += `; Path=${options.path}`
       if (options.domain) cookieStr += `; Domain=${options.domain}`
       if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`
       if (options.secure) cookieStr += `; Secure`
     }
     return cookieStr
  }
}

// Default instance
const cookies = new CookieManager()
export default cookies
