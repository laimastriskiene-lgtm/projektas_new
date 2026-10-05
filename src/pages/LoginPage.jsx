import VisitProgress from '../components/VisitProgress'
import { useState } from 'react'
import './LoginPage.css'

export default function LoginPage({ onLogin, visits }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onLogin({ email })
  }

  return (
    <main className="login-page">
      <div className="login-content">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="brand">Šeimos vizitai</p>
          <h1>Prisijungimas</h1>
          <p className="login-sub">
            Tu esi atsakingas už šeimos vizitus — pažymėk kada, kam ir pas ką.
          </p>
  
          <label htmlFor="email">
            El. paštas
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="vardas@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
  
          <label htmlFor="password">
            Slaptažodis
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
  
          <button type="submit">Prisijungti</button>
        </form>
  
        <VisitProgress visits={visits} />
      </div>
    </main>
  )
}