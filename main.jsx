import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Admin from './Admin.jsx'
import './styles.css'

function Root() {
  const [hash, setHash] = React.useState(location.hash)
  React.useEffect(() => {
    const f = () => setHash(location.hash)
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  return hash === '#admin' ? <Admin /> : <App />
}
createRoot(document.getElementById('root')).render(<Root />)
