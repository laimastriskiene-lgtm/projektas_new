import { useEffect, useMemo, useState } from 'react'
import './VisitReminder.css'

function localDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getTomorrowKey(todayKey) {
  const [year, month, day] = todayKey.split('-').map(Number)
  return localDateKey(new Date(year, month - 1, day + 1))
}

export default function VisitReminder({ visits, members }) {
  const [todayKey, setTodayKey] = useState(() => localDateKey(new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentDateKey = localDateKey(new Date())
      setTodayKey((previousDateKey) => (
        previousDateKey === currentDateKey ? previousDateKey : currentDateKey
      ))
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  const tomorrowKey = useMemo(() => getTomorrowKey(todayKey), [todayKey])
  const tomorrowVisits = useMemo(
    () => visits
      .filter((visit) => visit.status === 'planned' && visit.date === tomorrowKey)
      .sort((a, b) => a.time.localeCompare(b.time)),
    [visits, tomorrowKey],
  )

  if (tomorrowVisits.length === 0) return null

  const hasMultipleVisits = tomorrowVisits.length > 1

  return (
    <section className="visit-reminder" aria-live="polite" aria-labelledby="visit-reminder-title">
      <div className="visit-reminder-heading">
        <span className="visit-reminder-icon" aria-hidden="true">🔔</span>
        <h2 id="visit-reminder-title">
          {hasMultipleVisits ? 'Rytoj vizitai' : 'Rytoj vizitas'}
        </h2>
      </div>
      <ul className={hasMultipleVisits ? 'multiple-visits' : 'single-visit'}>
        {tomorrowVisits.map((visit) => {
          const member = members.find((item) => item.id === visit.memberId)
          return (
            <li key={visit.id}>
              <strong>{member?.name ?? 'Šeimos narys'}</strong>
              <span>{visit.doctor}, {visit.time}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
