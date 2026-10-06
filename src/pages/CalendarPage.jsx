import { useMemo, useState } from 'react'
import VisitForm from '../components/VisitForm'
import MembersPanel from '../components/MembersPanel'
import VisitProgress from '../components/VisitProgress'
import CompletedVisitDialog from '../components/CompletedVisitDialog'
import VisitReminder from '../components/VisitReminder'
import './CalendarPage.css'
const WEEKDAYS = ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk']
const MONTHS = [
  'Sausis',
  'Vasaris',
  'Kovas',
  'Balandis',
  'Gegužė',
  'Birželis',
  'Liepa',
  'Rugpjūtis',
  'Rugsėjis',
  'Spalis',
  'Lapkritis',
  'Gruodis',
]

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function mondayIndex(date) {
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

function toKey(year, monthIndex, day) {
  const m = String(monthIndex + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

function memberName(members, memberId) {
  return members.find((m) => m.id === memberId)?.name ?? '—'
}

export default function CalendarPage({
  visits,
  members,
  userEmail,
  onLogout,
  onOpenDoctorCatalog,
  onAddMember,
  onDeleteMember,
  onAddVisit,
  onDeleteVisit,
  onCompleteVisit,
  onUpdateVisit,
}) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [openVisitId, setOpenVisitId] = useState(null)
  const [memberFilter, setMemberFilter] = useState('all')
  const [doctorSearch, setDoctorSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const visitsByDate = useMemo(() => {
    const map = new Map()
    for (const visit of visits) {
      const list = map.get(visit.date) ?? []
      list.push(visit)
      map.set(visit.date, list)
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.time.localeCompare(b.time))
    }
    return map
  }, [visits])

  const cells = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const total = daysInMonth(cursor)
    const offset = mondayIndex(cursor)
    const result = []

    for (let i = 0; i < offset; i += 1) {
      result.push({ type: 'empty', key: `e-${i}` })
    }

    for (let day = 1; day <= total; day += 1) {
      const key = toKey(year, month, day)
      result.push({
        type: 'day',
        key,
        day,
        dateKey: key,
        visits: visitsByDate.get(key) ?? [],
      })
    }

    return result
  }, [cursor, visitsByDate])

  const selectedVisits = selectedDate
    ? (visitsByDate.get(selectedDate) ?? [])
    : []
  const openVisit = visits.find((visit) => visit.id === openVisitId)
  const filteredVisits = useMemo(() => {
    const normalizedDoctor = doctorSearch.trim().toLocaleLowerCase('lt-LT')

    return visits
      .filter((visit) => {
        const matchesMember = memberFilter === 'all' || visit.memberId === memberFilter
        const matchesDoctor = !normalizedDoctor || visit.doctor.toLocaleLowerCase('lt-LT').includes(normalizedDoctor)
        const matchesDate = !dateFilter || visit.date === dateFilter
        const matchesStatus = statusFilter === 'all' || visit.status === statusFilter

        return matchesMember && matchesDoctor && matchesDate && matchesStatus
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  }, [visits, memberFilter, doctorSearch, dateFilter, statusFilter])

  const todayKey = toKey(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  )
  function goPrev() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
  }

  function goNext() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
  }

  function openAddForm() {
    if (!selectedDate) {
      setSelectedDate(todayKey)
    }
    setShowForm(true)
  }

  function handleCreate(payload) {
    onAddVisit(payload)
    setSelectedDate(payload.date)
    setShowForm(false)

    const [y, m] = payload.date.split('-').map(Number)
    setCursor(new Date(y, m - 1, 1))
  }

  function handleDelete(visitId) {
    const ok = window.confirm('Ar tikrai ištrinti šį vizitą?')
    if (ok) onDeleteVisit(visitId)
  }

  function handleSaveCompletedVisit(visitId, updates) {
    onUpdateVisit(visitId, updates)
    setSelectedDate(updates.date)
    const [year, month] = updates.date.split('-').map(Number)
    setCursor(new Date(year, month - 1, 1))
  }

  function renderVisitCard(visit, showDate = false) {
    return (
      <li
        key={visit.id}
        className={`visit-card status-${visit.status}`}
        onClick={visit.status === 'completed' ? () => setOpenVisitId(visit.id) : undefined}
      >
        <div className="visit-top">
          <strong>
            {showDate ? `${visit.date} · ` : ''}{visit.time} · {memberName(members, visit.memberId)}
          </strong>
          <span className={`badge ${visit.status}`}>
            {visit.status === 'completed' ? 'Atliktas' : 'Suplanuotas'}
          </span>
        </div>
        <p>Pas: {visit.doctor}</p>

        <div className="visit-actions">
          {visit.status === 'planned' ? (
            <button
              type="button"
              className="action complete"
              onClick={() => onCompleteVisit(visit.id)}
            >
              Pažymėti atliktu
            </button>
          ) : null}
          {visit.status === 'completed' ? (
            <button
              type="button"
              className="action complete"
              onClick={(event) => {
                event.stopPropagation()
                setOpenVisitId(visit.id)
              }}
            >
              Atidaryti
            </button>
          ) : null}
          <button
            type="button"
            className="action danger"
            onClick={(event) => {
              event.stopPropagation()
              handleDelete(visit.id)
            }}
          >
            Ištrinti
          </button>
        </div>
      </li>
    )
  }

  return (
    <div className="calendar-app">
      <header className="calendar-header">
        <div>
          <p className="brand">Šeimos vizitai</p>
          <p className="user-line">{userEmail}</p>
        </div>
        <div className="header-actions">
          <button type="button" className="ghost-btn" onClick={onOpenDoctorCatalog}>
            Gydytojų katalogas
          </button>
          <button type="button" className="primary-btn" onClick={openAddForm}>
            + Pridėti vizitą
          </button>
          <button type="button" className="ghost-btn" onClick={onLogout}>
            Atsijungti
          </button>
        </div>
      </header>

      <VisitReminder visits={visits} members={members} />

      <section className="visit-search-panel" aria-labelledby="visit-search-title">
        <h2 id="visit-search-title">Vizitų paieška ir filtravimas</h2>
        <div className="visit-search-controls">
          <label htmlFor="visit-doctor-search">
            Gydytojas
            <input
              id="visit-doctor-search"
              type="search"
              placeholder="Ieškoti gydytojo..."
              value={doctorSearch}
              onChange={(event) => setDoctorSearch(event.target.value)}
            />
          </label>
          <label htmlFor="visit-member-filter">
            Šeimos narys
            <select id="visit-member-filter" value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)}>
              <option value="all">Visi</option>
              {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </label>
          <label htmlFor="visit-date-filter">
            Data
            <input id="visit-date-filter" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
          </label>
          <label htmlFor="visit-status-filter">
            Būsena
            <select id="visit-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">Visi</option>
              <option value="planned">Suplanuotas</option>
              <option value="completed">Atliktas</option>
            </select>
          </label>
        </div>
        <p className="visit-search-count" aria-live="polite">Rasta vizitų: {filteredVisits.length}</p>
        {filteredVisits.length > 0 ? (
          <ul className="visit-search-results">
            {filteredVisits.map((visit) => renderVisitCard(visit, true))}
          </ul>
        ) : (
          <p className="muted">Pagal pasirinktus filtrus vizitų nerasta.</p>
        )}
      </section>

      <section className="visit-list">
        <div className="visit-list-head">
          <h2>
            {selectedDate ? `Vizitai — ${selectedDate}` : 'Pasirinkite dieną'}
          </h2>
          {selectedDate ? (
            <button
              type="button"
              className="link-btn"
              onClick={() => setShowForm(true)}
            >
              + Šiai dienai
            </button>
          ) : null}
        </div>

        {showForm ? (
          <VisitForm
            members={members}
            initialDate={selectedDate || todayKey}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        ) : null}

        {!selectedDate && !showForm ? (
          <p className="muted">
            Spustelėkite dieną kalendoriuje arba pridėkite naują vizitą.
          </p>
        ) : null}

        {selectedDate && selectedVisits.length === 0 && !showForm ? (
          <p className="muted">Šią dieną vizitų nėra.</p>
        ) : null}

        {selectedVisits.length > 0 ? (
          <ul>
            {selectedVisits.map((visit) => renderVisitCard(visit))}
          </ul>
        ) : null}
      </section>

      <section className="calendar-panel">
        <div className="calendar-toolbar">
          <h1>
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </h1>
          <div className="nav-btns">
            <button type="button" onClick={goPrev} aria-label="Ankstesnis mėnuo">
              ←
            </button>
            <button type="button" onClick={goNext} aria-label="Kitas mėnuo">
              →
            </button>
          </div>
        </div>

        <div className="weekday-row">
          {WEEKDAYS.map((label) => (
            <div key={label} className="weekday">
              {label}
            </div>
          ))}
        </div>

        <div className="day-grid">
          {cells.map((cell) => {
            if (cell.type === 'empty') {
              return <div key={cell.key} className="day-cell empty" />
            }

            const hasCompleted = cell.visits.some((v) => v.status === 'completed')
            const hasPlanned = cell.visits.some((v) => v.status === 'planned')
            const isSelected = selectedDate === cell.dateKey
            const isToday = cell.dateKey === todayKey

            return (
              <button
                key={cell.key}
                type="button"
                className={[
                  'day-cell',
                  isSelected ? 'selected' : '',
                  isToday ? 'today' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  setSelectedDate(cell.dateKey)
                  setShowForm(false)
                }}
              >
                <span className="day-num">{cell.day}</span>
                <span className="day-dots" aria-hidden="true">
                  {hasPlanned ? <span className="dot planned" /> : null}
                  {hasCompleted ? <span className="dot completed" /> : null}
                </span>
              </button>
            )
          })}
        </div>

        <div className="legend">
          <span>
            <i className="dot planned" /> Suplanuotas
          </span>
          <span>
            <i className="dot completed" /> Atliktas
          </span>
        </div>
      </section>

      <MembersPanel
  members={members}
  onAddMember={onAddMember}
  onDeleteMember={onDeleteMember}
/>

      {openVisit ? (
        <CompletedVisitDialog
          visit={openVisit}
          memberName={memberName(members, openVisit.memberId)}
          members={members}
          onClose={() => setOpenVisitId(null)}
          onSave={handleSaveCompletedVisit}
        />
      ) : null}

    </div>
  )
}
