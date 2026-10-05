import './VisitProgress.css'

export default function VisitProgress({ visits, maxVisits = 10 }) {
  const visitCount = visits?.length ?? 0
  const progress = Math.min((visitCount / maxVisits) * 100, 100)

  return (
    <section className="visit-progress">
      <div className="visit-progress-top">
        <div>
          <p className="visit-progress-label">Užregistruoti vizitai</p>
          <h2>{visitCount}</h2>
        </div>

        <span className="visit-progress-total">
          iš {maxVisits}
        </span>
      </div>

      <div
        className="visit-progress-track"
        role="progressbar"
        aria-valuenow={visitCount}
        aria-valuemin="0"
        aria-valuemax={maxVisits}
        aria-label="Užregistruotų vizitų progresas"
      >
        <div
          className="visit-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  )
}