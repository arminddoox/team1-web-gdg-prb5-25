import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'

function App() {
  const [count, setCount] = useState(0)

  // Access environment variables
  const API_URL = import.meta.env.VITE_API_URL
  const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT
  const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_BASE_URL

  // Debug: Log ALL env variables
  console.log('🔍 ALL import.meta.env:', import.meta.env)
  console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* Environment Variables Display */}
      <div className="card" style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h2>🔧 Environment Variables Test</h2>
        
        {/* Show what we're trying to access */}
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <p>
            <strong>VITE_API_URL:</strong>{' '}
            <span style={{ color: API_URL ? '#61dafb' : '#ff6b6b' }}>
              {API_URL || '❌ Not loaded'}
            </span>
          </p>
          <p>
            <strong>VITE_API_TIMEOUT:</strong>{' '}
            <span style={{ color: API_TIMEOUT ? '#61dafb' : '#ff6b6b' }}>
              {API_TIMEOUT || '❌ Not loaded'}
            </span>
          </p>
          <p>
            <strong>VITE_ADMIN_BASE_URL:</strong>{' '}
            <span style={{ color: ADMIN_BASE_URL ? '#61dafb' : '#ff6b6b' }}>
              {ADMIN_BASE_URL || '❌ Not loaded'}
            </span>
          </p>
        </div>

        {/* Show ALL env variables */}
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#1a1a1a', borderRadius: '8px' }}>
          <p style={{ color: '#888', marginBottom: '0.5rem' }}>
            All import.meta.env (check browser console for full details):
          </p>
          <pre style={{ fontSize: '12px', color: '#61dafb', overflow: 'auto' }}>
            {JSON.stringify(import.meta.env, null, 2)}
          </pre>
        </div>

        {API_URL ? (
          <p style={{ color: '#4ade80', marginTop: '1rem' }}>
            ✅ Environment variables loaded successfully!
          </p>
        ) : (
          <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>
            ❌ Environment variables not loaded. Check browser console for details.
          </p>
        )}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App