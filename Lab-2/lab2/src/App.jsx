import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserCard from './components/UserCard.jsx'
import Loader from './components/Loader.jsx'
import { fetchUsers } from './services/api.js'

function App() {
  // Лічильник
  const [count, setCount] = useState(0)

  // Користувачі
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const data = await fetchUsers()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div style={{ padding: 20 }}>
      {/* Логотипи і лічильник */}
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
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Пошук і користувачі */}
      <h2 style={{ marginTop: 40 }}>Список користувачів</h2>
      <input
        placeholder="Пошук користувача"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ padding: 8, marginBottom: 20, width: "100%" }}
      />

      {loading && <Loader />}
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {!loading && !error && filtered.map(u => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>
    </div>
  )
}

export default App
