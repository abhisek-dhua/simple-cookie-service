import { CookieManager } from 'simple-cookie-service';
import http from 'http';

const cookies = new CookieManager();

const server = http.createServer((req, res) => {
  // 1. Parse incoming cookies
  const cookieHeader = req.headers.cookie || "";
  const parsedCookies = cookies.parse(cookieHeader);
  
  console.log('Received Cookies:', parsedCookies);

  // 2. Set multiple cookies using serialization
  const cookie1 = cookies.serialize('session_id', '12345', { path: '/', httpOnly: true });
  const cookie2 = cookies.serialize('user_pref', 'dark_mode', { maxAge: 3600 });
  
  // 3. Send response
  res.setHeader('Set-Cookie', [cookie1, cookie2]);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'Cookies set!', 
    received: parsedCookies 
  }, null, 2));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Run: curl -v http://localhost:3000/ -H "Cookie: existing_cookie=abc"');
});
