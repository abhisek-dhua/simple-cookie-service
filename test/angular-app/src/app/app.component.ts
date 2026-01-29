import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import cookies from 'simple-cookie-service';
// import { CookieManager } from 'simple-cookie-service';

// const cookies = new CookieManager();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Angular Cookie Test</h1>
      <button (click)="setCookie()" style="padding: 10px; cursor: pointer;">Set Cookie</button>
      <button (click)="clearCookie()" style="padding: 10px; margin-left: 10px; cursor: pointer;">
        Clear Cookie
      </button>

      <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px;">
        <p><strong>String Value:</strong> {{ val }}</p>
        <p><strong>JSON Value:</strong> {{ jsonData | json }}</p>
      </div>

      <p style="color: #666; font-size: 0.9em; margin-top: 20px;">
        Check Application > Cookies in DevTools to see 'test_ng' and 'test_ng_json'.
      </p>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  val: string | undefined = '';
  jsonData: any = {};

  constructor() {
    this.refresh();
  }

  setCookie() {
    cookies.set('test_ng', 'Hello Angular ' + new Date().toLocaleTimeString());
    cookies.set('test_ng_json', { id: 123, role: 'user', timestamp: Date.now() });
    this.refresh();
  }

  clearCookie() {
    cookies.remove('test_ng');
    cookies.remove('test_ng_json');
    this.refresh();
  }

  refresh() {
    this.val = cookies.get('test_ng');
    this.jsonData = cookies.get('test_ng_json');
  }
}
