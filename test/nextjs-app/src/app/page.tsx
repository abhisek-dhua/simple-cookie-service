'use client'

import { useState } from 'react'
import cookies from 'simple-cookie-service'

export default function Home() {
  const [val, setVal] = useState<string>(cookies.get('test_nextjs') || '')

  const setCookie = () => {
    cookies.set('test_nextjs', 'Hello from Next.js ' + new Date().toLocaleTimeString(), { expires: 1 })
    setVal(cookies.get('test_nextjs') || '')
  }

  const clearCookie = () => {
    cookies.remove('test_nextjs')
    setVal(cookies.get('test_nextjs') || '')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Next.js Cookie Test</h1>
      <button onClick={setCookie} style={{ padding: '10px', cursor: 'pointer' }}>Set Cookie</button>
      <button onClick={clearCookie} style={{ padding: '10px', marginLeft: '10px', cursor: 'pointer' }}>Clear Cookie</button>
      <p>Value: <strong>{val}</strong></p>
    </div>
  )
}