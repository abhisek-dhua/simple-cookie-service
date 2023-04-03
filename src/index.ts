export declare type SameSite = "Lax" | "None" | "Strict";
export interface ICookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: boolean | SameSite;
}

export class SimpleCookieService {
  /**
   * * Set cookie with different cookie option
   *
   * @param name string
   * @param value string
   * @param options
   * * {expires, path, domain, secure, sameSite}
   *
   * @developer Abhisek Dhua
   */
  static setItem(name: string, value: string, options?: ICookieOptions): void {
    // calculate expiry date if available
    let date = new Date();
    if (options !== undefined && typeof options.expires == "number") {
      date.setDate(date.getDate() + options.expires);
    } else if (options !== undefined && options.expires !== undefined) {
      date = options?.expires as Date;
    }
    // add cookie depending on options
    document.cookie = `${name}=${value}${
      !!options && Object.keys(options).length
        ? `${
            options.expires !== undefined
              ? `; expires=${date.toUTCString()}`
              : ""
          }${!!options.path ? `; path=${options.path}` : ""}${
            options.sameSite !== undefined
              ? `; SameSite=${options.sameSite}`
              : ""
          }${!!options.domain ? `; domain=${options.domain}` : ""}${
            options.secure ? `; Secure` : ""
          }`
        : ""
    }`;
  }

  /**
   * * Get cookie value by key name
   *
   * @param key string
   * @returns cookie value
   *
   * @developer Abhisek Dhua
   */
  static getItem(key: string): string | undefined {
    return document.cookie
      .split(";")
      .find((row) => row.trim().startsWith(key))
      ?.split("=")[1];
  }

  /**
   * * Delete cookie by key name
   *
   * @param key string
   * @param options
   * * {expires, path, domain, secure, sameSite}
   *
   * @developer Abhisek Dhua
   */
  static removeItem(key: string, options?: ICookieOptions) {
    document.cookie = `${key}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;${
      !!options && Object.keys(options).length
        ? `${!!options.path ? `; path=${options.path}` : ""}${
            options.sameSite !== undefined
              ? `; SameSite=${options.sameSite}`
              : ""
          }${!!options.domain ? `; domain=${options.domain}` : ""}${
            options.secure ? `; Secure` : ""
          }`
        : ""
    }`;
    // document.cookie = key + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}
