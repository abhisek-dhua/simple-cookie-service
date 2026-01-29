import { useState } from 'react'
import cookies from 'simple-cookie-service'
import './App.css'

function App() {
  const [val, setVal] = useState(cookies.get('test_react') || '')

  const setCookie = () => {
    cookies.set('test_react', 'hello from react ' + new Date().toLocaleTimeString(), { expires: 1 })
    setVal(cookies.get('test_react') || '')
  }

  const clearCookie = () => {
    cookies.remove('test_react')
    setVal(cookies.get('test_react') || '')
  }

  return (
    <div className="card">
      <h1>React Cookie Test</h1>
      <button onClick={setCookie}>Set Cookie</button>
      <button onClick={clearCookie} style={{marginLeft: '10px'}}>Clear Cookie</button>
      <p>Value: <strong>{val}</strong></p>
    </div>
  )
}

export default App
