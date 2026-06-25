import { useState } from 'preact/hooks'
import cookies from 'simple-cookie-service'

function App() {
  const [val, setVal] = useState(cookies.get('test_preact') || '')

  const setCookie = () => {
    cookies.set('test_preact', 'Hello from Preact ' + new Date().toLocaleTimeString(), { expires: 1 })
    setVal(cookies.get('test_preact') || '')
  }

  const clearCookie = () => {
    cookies.remove('test_preact')
    setVal(cookies.get('test_preact') || '')
  }

  return (
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Preact Cookie Test</h1>
      <button onClick={setCookie} style="padding: 10px; cursor: pointer;">Set Cookie</button>
      <button onClick={clearCookie} style="padding: 10px; margin-left: 10px; cursor: pointer;">Clear Cookie</button>
      <p>Value: <strong>{val}</strong></p>
    </div>
  )
}

export default App