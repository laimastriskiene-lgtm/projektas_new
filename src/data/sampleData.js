export const initialFamilyMembers = [
  { id: 'm1', name: 'Mama' },
  { id: 'm2', name: 'Tėtis' },
  { id: 'm3', name: 'Emilija' },
]

function isoDate(year, month, day) {
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

/** Pradiniai pavyzdiniai vizitai einamajam mėnesiui. */
export function getSampleVisits(referenceDate = new Date()) {
  const y = referenceDate.getFullYear()
  const m = referenceDate.getMonth() + 1

  return [
    {
      id: 'v1',
      memberId: 'm1',
      date: isoDate(y, m, 5),
      time: '10:30',
      doctor: 'Dr. Petrauskienė',
      status: 'completed',
    },
    {
      id: 'v2',
      memberId: 'm3',
      date: isoDate(y, m, 12),
      time: '14:00',
      doctor: 'Dr. Kazlauskas',
      status: 'planned',
    },
    {
      id: 'v3',
      memberId: 'm2',
      date: isoDate(y, m, 18),
      time: '09:15',
      doctor: 'Dr. Jankauskaitė',
      status: 'planned',
    },
  ]
}

export function createVisitId() {
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function createMemberId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
