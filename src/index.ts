export declare type SameSite = "Lax" | "None" | "Strict";
export interface ICookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: SameSite;
}

export class SimpleCookieService {
  /**
   * * Set cookie with different cookie option
   *
   * @param name
   * @param value
   * @param expires
   * @param path
   * @param sameSite
   * @param domain
   * @param secure
   *
   * @developer Abhisek Dhua
   */
  static setValue(
    name: string,
    value: string,
    expires?: ICookieOptions["expires"],
    path?: ICookieOptions["path"],
    sameSite?: SameSite,
    domain?: ICookieOptions["domain"],
    secure?: ICookieOptions["secure"]
  ): void {
    let date = new Date();

    if (typeof expires == "number") {
      date.setDate(date.getDate() + expires);
    } else if (expires !== undefined) {
      date = expires as Date;
    }
    document.cookie = `${name}=${value}; expires=${
      !!expires ? date.toUTCString() : "Session"
    }; path=${path ? path : "/"}; SameSite=${sameSite ? sameSite : "None"}; ${
      domain ? "domain=" + domain + ";" : ""
    } ${secure ? "Secure;" : ""}  `;
  }

  /**
   * * Get cookie value by key name
   *
   * @param key
   * @returns value
   *
   * @developer Abhisek Dhua
   */
  static getValue(key: string): string | undefined {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(key))
      ?.split("=")[1];
  }

  /**
   * * Delete cookie by key name
   *
   * @param key
   *
   * @developer Abhisek Dhua
   */
  static delete(key: string) {
    document.cookie = key + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
}
