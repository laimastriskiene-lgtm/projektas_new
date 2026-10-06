import { useEffect, useState } from 'react'
import './CompletedVisitDialog.css'

const EMPTY_DETAILS = {
  result: '',
  recommendations: '',
  medications: '',
  notes: '',
  nextVisit: '',
}

export default function CompletedVisitDialog({ visit, memberName, members, onClose, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...visit, ...EMPTY_DETAILS })

  useEffect(() => {
    setForm({ ...EMPTY_DETAILS, ...visit })
    setEditing(false)
  }, [visit])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function save(event) {
    event.preventDefault()
    if (!form.date || !form.time || !form.memberId || !form.doctor.trim()) return
    onSave(visit.id, {
      date: form.date,
      time: form.time,
      memberId: form.memberId,
      doctor: form.doctor.trim(),
      result: form.result.trim(),
      recommendations: form.recommendations.trim(),
      medications: form.medications.trim(),
      notes: form.notes.trim(),
      nextVisit: form.nextVisit,
    })
    setEditing(false)
  }

  function detail(label, value) {
    return (
      <div className="completed-detail">
        <dt>{label}</dt>
        <dd>{value || 'Neįrašyta'}</dd>
      </div>
    )
  }

  return (
    <div className="completed-dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="completed-dialog" role="dialog" aria-modal="true" aria-labelledby="completed-dialog-title">
        <header className="completed-dialog-header">
          <div>
            <p className="completed-dialog-eyebrow">Vizito įrašas</p>
            <h2 id="completed-dialog-title">{editing ? 'Redaguoti vizitą' : 'Atliktas vizitas'}</h2>
          </div>
          <button type="button" className="completed-dialog-close" onClick={onClose} aria-label="Uždaryti">×</button>
        </header>

        {editing ? (
          <form className="completed-visit-form" onSubmit={save}>
            <label>Data<input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} required /></label>
            <label>Laikas<input type="time" value={form.time} onChange={(event) => update('time', event.target.value)} required /></label>
            <label>Šeimos narys<select value={form.memberId} onChange={(event) => update('memberId', event.target.value)} required>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
            <label>Gydytojas<input type="text" value={form.doctor} onChange={(event) => update('doctor', event.target.value)} required /></label>
            <label>Vizito rezultatas<textarea rows="3" value={form.result} onChange={(event) => update('result', event.target.value)} placeholder="Kokia vizito išvada?" /></label>
            <label>Pastabos<textarea rows="3" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Papildoma informacija apie vizitą" /></label>
            <label>Gydytojo rekomendacijos<textarea rows="3" value={form.recommendations} onChange={(event) => update('recommendations', event.target.value)} placeholder="Gydytojo rekomendacijos" /></label>
            <label>Vaistai<textarea rows="3" value={form.medications} onChange={(event) => update('medications', event.target.value)} placeholder="Paskirti ar vartojami vaistai" /></label>
            <label>Kitas vizitas<input type="date" value={form.nextVisit} onChange={(event) => update('nextVisit', event.target.value)} /></label>
            <div className="completed-dialog-actions">
              <button type="button" className="secondary" onClick={() => { setForm({ ...EMPTY_DETAILS, ...visit }); setEditing(false) }}>Atšaukti</button>
              <button type="submit" className="primary-btn">Išsaugoti</button>
            </div>
          </form>
        ) : (
          <>
            <dl className="completed-details-grid">
              {detail('Data', form.date)}
              {detail('Laikas', form.time)}
              {detail('Šeimos narys', memberName)}
              {detail('Gydytojas', form.doctor)}
              {detail('Būsena', 'Atliktas')}
              {detail('Vizito rezultatas', form.result)}
              {detail('Pastabos', form.notes)}
              {detail('Gydytojo rekomendacijos', form.recommendations)}
              {detail('Vaistai', form.medications)}
              {detail('Kitas vizitas', form.nextVisit)}
            </dl>
            <div className="completed-dialog-actions">
              <button type="button" className="secondary" onClick={onClose}>Uždaryti</button>
              <button type="button" className="primary-btn" onClick={() => setEditing(true)}>Redaguoti / papildyti</button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
