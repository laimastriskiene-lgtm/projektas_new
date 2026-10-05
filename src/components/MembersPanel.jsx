import { useState } from 'react'
import './MembersPanel.css'

export default function MembersPanel({ members, onAddMember, onDeleteMember }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = name.trim()

    if (!trimmed) {
      setError('Įveskite vardą')
      return
    }

    const exists = members.some(
      (member) => member.name.toLowerCase() === trimmed.toLowerCase(),
    )
    if (exists) {
      setError('Toks šeimos narys jau yra')
      return
    }

    onAddMember(trimmed)
    setName('')
    setError('')
  }

  return (
    <section className="members-panel">
      <h2>Šeimos nariai</h2>
      <p className="muted">Įvesk, kam planuoji vizitus.</p>

      <form className="member-form" onSubmit={handleSubmit}>
        <label htmlFor="member-name">
          Vardas
          <input
            id="member-name"
            type="text"
            placeholder="pvz. Mama, Jonas"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError('')
            }}
          />
        </label>
        <button type="submit">Pridėti</button>
      </form>

      {error ? <p className="form-error">{error}</p> : null}

      {members.length === 0 ? (
        <p className="muted">Dar nėra šeimos narių.</p>
      ) : (
        <ul className="member-list">
          {members.map((member) => (
            <li key={member.id}>
              <span>{member.name}</span>
              <button
                type="button"
                className="remove-btn"
                onClick={() => onDeleteMember(member.id)}
              >
                Pašalinti
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
