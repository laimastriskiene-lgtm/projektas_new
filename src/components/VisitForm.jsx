import { useState } from 'react'
import './VisitForm.css'

export default function VisitForm({ members, initialDate = '', onSubmit, onCancel }) {
  const [form, setForm] = useState({
    date: initialDate || '', time: '', memberId: members[0]?.id ?? '', doctor: '',
    reminderEnabled: false, reminderMinutes: '60',
  })
  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }
  function handleSubmit(event) {
    event.preventDefault()
    if (!form.date || !form.time || !form.memberId || !form.doctor.trim()) return
    onSubmit({ ...form, doctor: form.doctor.trim(), reminderMinutes: Number(form.reminderMinutes) })
  }
  if (members.length === 0) {
    return <div className="visit-form"><h3>Naujas vizitas</h3><p className="form-hint">Pirmiau pridėkite bent vieną šeimos narį skiltyje „Šeimos nariai“.</p><div className="form-actions"><button type="button" className="secondary" onClick={onCancel}>Uždaryti</button></div></div>
  }
  return (
    <form className="visit-form" onSubmit={handleSubmit}>
      <h3>Naujas vizitas</h3>
      <p className="form-hint">Kada, kam ir pas ką reikia vykti</p>
      <label htmlFor="visit-date">Data<input id="visit-date" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required /></label>
      <label htmlFor="visit-time">Laikas<input id="visit-time" type="time" value={form.time} onChange={(e) => update('time', e.target.value)} required /></label>
      <label htmlFor="visit-member">Šeimos narys<select id="visit-member" value={form.memberId} onChange={(e) => update('memberId', e.target.value)} required>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
      <label htmlFor="visit-doctor">Gydytojas arba specialybė<input id="visit-doctor" type="text" placeholder="pvz. Kardiologas" value={form.doctor} onChange={(e) => update('doctor', e.target.value)} required /></label>
      <label className="reminder-toggle" htmlFor="visit-reminder"><input id="visit-reminder" type="checkbox" checked={form.reminderEnabled} onChange={(e) => update('reminderEnabled', e.target.checked)} />Priminti apie vizitą</label>
      {form.reminderEnabled ? <label htmlFor="visit-reminder-time">Kada priminti<select id="visit-reminder-time" value={form.reminderMinutes} onChange={(e) => update('reminderMinutes', e.target.value)}><option value="10">Likus 10 minučių</option><option value="60">Likus 1 valandai</option><option value="1440">Likus 1 dienai</option><option value="10080">Likus 1 savaitei</option></select></label> : null}
      <div className="form-actions"><button type="button" className="secondary" onClick={onCancel}>Atšaukti</button><button type="submit">Išsaugoti</button></div>
    </form>
  )
}
