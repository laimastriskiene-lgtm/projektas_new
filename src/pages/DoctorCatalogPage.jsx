import { useMemo, useState } from 'react'
import './DoctorCatalogPage.css'

export default function DoctorCatalogPage({ doctors, onBack }) {
  const [search, setSearch] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')

  const specialties = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.specialty))].sort((a, b) => a.localeCompare(b, 'lt')),
    [doctors],
  )
  const cities = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.city))].sort((a, b) => a.localeCompare(b, 'lt')),
    [doctors],
  )
  const visibleDoctors = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('lt-LT')

    return doctors.filter((doctor) => {
      const searchableText = `${doctor.name} ${doctor.institution} ${doctor.city} ${doctor.address}`.toLocaleLowerCase('lt-LT')
      const matchesSearch = !query || searchableText.includes(query)
      const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter
      const matchesCity = cityFilter === 'all' || doctor.city === cityFilter
      return matchesSearch && matchesSpecialty && matchesCity
    })
  }, [doctors, search, specialtyFilter, cityFilter])

  return (
    <main className="doctor-catalog-page">
      <header className="doctor-catalog-header">
        <button type="button" className="ghost-btn" onClick={onBack}>
          ← Grįžti į kalendorių
        </button>
        <div>
          <p className="doctor-catalog-eyebrow">Šeimos vizitai</p>
          <h1>Gydytojų katalogas</h1>
          <p className="doctor-catalog-description">
            Gydytojų ir klinikų pavyzdžiai. 5 balų įvertinimai yra demonstraciniai; Pincetas.lt profilyje rasite tikruosius duomenis.
          </p>
        </div>
      </header>

      <section className="doctor-catalog-filters" aria-label="Gydytojų filtrai">
        <label htmlFor="doctor-catalog-search">
          Gydytojas arba įstaiga
          <input
            id="doctor-catalog-search"
            type="search"
            placeholder="Ieškoti gydytojo ar įstaigos..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label htmlFor="doctor-specialty-filter">
          Specialybė
          <select id="doctor-specialty-filter" value={specialtyFilter} onChange={(event) => setSpecialtyFilter(event.target.value)}>
            <option value="all">Visos</option>
            {specialties.map((specialty) => <option key={specialty} value={specialty}>{specialty}</option>)}
          </select>
        </label>
        <label htmlFor="doctor-city-filter">
          Miestas
          <select id="doctor-city-filter" value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
            <option value="all">Visi</option>
            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </label>
      </section>

      <p className="doctor-catalog-count" aria-live="polite">Gydytojų: {visibleDoctors.length}</p>

      {visibleDoctors.length > 0 ? (
        <section className="doctor-catalog-grid" aria-label="Gydytojų sąrašas">
          {visibleDoctors.map((doctor) => (
            <article className="doctor-card" key={doctor.id}>
              <div className="doctor-card-heading">
                <div>
                  <h2>{doctor.name}</h2>
                  <p className="doctor-specialty">{doctor.specialty}</p>
                  <p className="doctor-institution">{doctor.institution}</p>
                  <p className="doctor-address">
                    {[doctor.address, doctor.city].filter(Boolean).join(', ')}
                  </p>
                </div>
                <span className="doctor-city">{doctor.city}</span>
              </div>
              <p className="doctor-rating">
                <strong>{doctor.sampleRating.toFixed(1).replace('.', ',')} / 5</strong>
                <span> · {doctor.ratingCount} įvertinimų</span>
              </p>
              <p className="doctor-rating-source">
                Pavyzdinis balas · Pincetas.lt: {doctor.pincetasRating}% rekomenduoja ({doctor.ratingCheckedAt})
              </p>
              <a href={doctor.pincetasProfileUrl} target="_blank" rel="noreferrer">
                Peržiūrėti Pincetas.lt profilį ↗
              </a>
            </article>
          ))}
        </section>
      ) : (
        <p className="doctor-catalog-empty">Gydytojų pagal pasirinktus kriterijus nerasta.</p>
      )}
    </main>
  )
}
