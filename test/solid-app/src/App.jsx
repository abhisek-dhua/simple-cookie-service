import { createSignal } from 'solid-js'
import cookies from 'simple-cookie-service'

function App() {
  const [val, setVal] = createSignal(cookies.get('test_solid') || '')

  const setCookie = () => {
    cookies.set('test_solid', 'Hello from SolidJS ' + new Date().toLocaleTimeString(), { expires: 1 })
    setVal(cookies.get('test_solid') || '')
  }

  const clearCookie = () => {
    cookies.remove('test_solid')
    setVal(cookies.get('test_solid') || '')
  }

  return (
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>SolidJS Cookie Test</h1>
      <button onClick={setCookie} style="padding: 10px; cursor: pointer;">Set Cookie</button>
      <button onClick={clearCookie} style="padding: 10px; margin-left: 10px; cursor: pointer;">Clear Cookie</button>
      <p>Value: <strong>{val()}</strong></p>
    </div>
  )
}

export default App