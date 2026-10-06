import { useEffect, useRef, useState } from 'react'
import {
  createMemberId,
  createVisitId,
  getSampleVisits,
  initialFamilyMembers,
} from './data/sampleData'
import { sampleDoctors } from './data/sampleDoctors'
import LoginPage from './pages/LoginPage'
import CalendarPage from './pages/CalendarPage'
import DoctorCatalogPage from './pages/DoctorCatalogPage'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('calendar')
  const [members, setMembers] = useState(initialFamilyMembers)
  const [visits, setVisits] = useState(() => getSampleVisits(new Date()))
  const [favoriteDoctorIds, setFavoriteDoctorIds] = useState([])
  const sentReminders = useRef(new Set())
  const favoriteDoctors = sampleDoctors.filter((doctor) => favoriteDoctorIds.includes(doctor.id))

  function handleToggleFavoriteDoctor(doctorId) {
    setFavoriteDoctorIds((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId],
    )
  }

  function handleLogin(nextUser) {
    setUser(nextUser)
    setCurrentPage('calendar')
  }

  function handleLogout() {
    setUser(null)
    setCurrentPage('calendar')
  }

  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now()
      for (const visit of visits) {
        if (visit.status !== 'planned' || !visit.reminderEnabled || sentReminders.current.has(visit.id)) continue
        const visitAt = new Date(`${visit.date}T${visit.time}:00`).getTime()
        const reminderAt = visitAt - visit.reminderMinutes * 60_000
        if (reminderAt <= now && now < visitAt) {
          sentReminders.current.add(visit.id)
          if ('Notification' in window && Notification.permission === 'granted') {
            const member = members.find((item) => item.id === visit.memberId)?.name ?? 'Šeimos narys'
            new Notification('Artėja vizitas', {
              body: `${member}: ${visit.date} ${visit.time} — ${visit.doctor}`,
            })
          }
        }
      }
    }
    checkReminders()
    const timer = window.setInterval(checkReminders, 15_000)
    return () => window.clearInterval(timer)
  }, [visits, members])

  function handleAddMember(name) {
    setMembers((prev) => [...prev, { id: createMemberId(), name }])
  }

  function handleDeleteMember(memberId) {
    const linked = visits.some((visit) => visit.memberId === memberId)
    if (linked) {
      window.alert(
        'Negalima paÅ¡alinti: Å¡is narys turi vizitÅ³. Pirmiau iÅ¡trinkite vizitus.',
      )
      return
    }
    setMembers((prev) => prev.filter((member) => member.id !== memberId))
  }

  function handleAddVisit({ date, time, memberId, doctor, reminderEnabled, reminderMinutes }) {
    if (reminderEnabled && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission()
    setVisits((prev) => [
      ...prev,
      {
        id: createVisitId(),
        date,
        time,
        memberId,
        doctor,
        reminderEnabled,
        reminderMinutes,
        status: 'planned',
      },
    ])
  }

  function handleDeleteVisit(visitId) {
    setVisits((prev) => prev.filter((visit) => visit.id !== visitId))
  }

  function handleCompleteVisit(visitId) {
    setVisits((prev) =>
      prev.map((visit) =>
        visit.id === visitId ? { ...visit, status: 'completed' } : visit,
      ),
    )
  }

  function handleUpdateVisit(visitId, updates) {
    setVisits((prev) =>
      prev.map((visit) =>
        visit.id === visitId ? { ...visit, ...updates } : visit,
      ),
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} visits={visits} />
  }

  if (currentPage === 'doctors') {
    return (
      <DoctorCatalogPage
        doctors={sampleDoctors}
        favoriteDoctorIds={favoriteDoctorIds}
        onToggleFavorite={handleToggleFavoriteDoctor}
        onBack={() => setCurrentPage('calendar')}
      />
    )
  }

  return (
    <CalendarPage
      visits={visits}
      members={members}
      favoriteDoctors={favoriteDoctors}
      userEmail={user.email}
      onLogout={handleLogout}
      onOpenDoctorCatalog={() => setCurrentPage('doctors')}
      onAddMember={handleAddMember}
      onDeleteMember={handleDeleteMember}
      onAddVisit={handleAddVisit}
      onDeleteVisit={handleDeleteVisit}
      onCompleteVisit={handleCompleteVisit}
      onUpdateVisit={handleUpdateVisit}
    />
  )
}

export default App
