import { useState } from "react";
import cookies from "simple-cookie-service";

export default function Index() {
  const [val, setVal] = useState<string>(cookies.get("test_remix") || "");

  const setCookie = () => {
    cookies.set(
      "test_remix",
      "Hello from Remix " + new Date().toLocaleTimeString(),
      { expires: 1 }
    );
    setVal(cookies.get("test_remix") || "");
  };

  const clearCookie = () => {
    cookies.remove("test_remix");
    setVal(cookies.get("test_remix") || "");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Remix Cookie Test</h1>
      <button
        onClick={setCookie}
        style={{ padding: "10px", cursor: "pointer" }}
      >
        Set Cookie
      </button>
      <button
        onClick={clearCookie}
        style={{ padding: "10px", marginLeft: "10px", cursor: "pointer" }}
      >
        Clear Cookie
      </button>
      <p>
        Value: <strong>{val}</strong>
      </p>
    </div>
  );
}