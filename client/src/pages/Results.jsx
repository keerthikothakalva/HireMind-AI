import { Link, useLocation } from "react-router-dom";
import "../styles/Results.css";

function Results() {
  const location = useLocation();

  const results = location.state?.results;
  const role = location.state?.role || "Software Engineer";
  const experience = location.state?.experience || "Fresher";

  const username =
    localStorage.getItem("username") || "Candidate";

  if (!results) {
    return (
      <main className="results-page">
        <div className="results-container">
          <section className="results-empty">
            <div className="results-empty-icon">
              <i className="bi bi-clipboard-x"></i>
            </div>

            <span className="results-label">
              NO RESULTS
            </span>

            <h1>No interview results found</h1>

            <p>
              Complete an interview first to view your
              performance results.
            </p>

            <Link
              to="/interview-setup"
              className="results-dashboard-btn"
            >
              Start Interview
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const {
    overallScore = 0,
    communication = 0,
    technicalKnowledge = 0,
    problemSolving = 0,
    confidence = 0,
    summary = "",
    strengths = [],
    areasToImprove = [],
  } = results;

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent performance";
    if (score >= 65) return "Good performance";
    if (score >= 50) return "Fair performance";
    return "Needs improvement";
  };

  return (
    <main className="results-page">
      <div className="results-container">

        <section className="results-header">

          <span className="results-label">
            INTERVIEW RESULTS
          </span>

          <h1>
            Great job, <span>{username}!</span>
          </h1>

          <p>
            You completed your AI interview for{" "}
            <strong>{role}</strong> at the{" "}
            <strong>{experience}</strong> level. Here's
            a summary of your performance.
          </p>

        </section>

        <section className="results-score-card">

          <div className="score-circle">
            <strong>{overallScore}</strong>
            <span>/ 100</span>
          </div>

          <div className="score-content">

            <span>OVERALL SCORE</span>

            <h2>
              {getScoreMessage(overallScore)}
            </h2>

            <p>
              {summary}
            </p>

          </div>

        </section>

        <section className="results-section">

          <div className="results-section-header">

            <div>
              <span className="results-label">
                PERFORMANCE
              </span>

              <h2>
                Skill Breakdown
              </h2>
            </div>

          </div>

          <div className="skill-grid">

            <div className="skill-card">

              <div className="skill-top">
                <span>Communication</span>
                <strong>{communication}%</strong>
              </div>

              <div className="skill-progress">
                <div
                  style={{
                    width: `${communication}%`,
                  }}
                ></div>
              </div>

            </div>

            <div className="skill-card">

              <div className="skill-top">
                <span>Technical Knowledge</span>
                <strong>
                  {technicalKnowledge}%
                </strong>
              </div>

              <div className="skill-progress">
                <div
                  style={{
                    width: `${technicalKnowledge}%`,
                  }}
                ></div>
              </div>

            </div>

            <div className="skill-card">

              <div className="skill-top">
                <span>Problem Solving</span>
                <strong>{problemSolving}%</strong>
              </div>

              <div className="skill-progress">
                <div
                  style={{
                    width: `${problemSolving}%`,
                  }}
                ></div>
              </div>

            </div>

            <div className="skill-card">

              <div className="skill-top">
                <span>Confidence</span>
                <strong>{confidence}%</strong>
              </div>

              <div className="skill-progress">
                <div
                  style={{
                    width: `${confidence}%`,
                  }}
                ></div>
              </div>

            </div>

          </div>

        </section>

        <section className="feedback-grid">

          <div className="feedback-card">

            <div className="feedback-icon positive">
              <i className="bi bi-check2-circle"></i>
            </div>

            <h2>
              Strengths
            </h2>

            {strengths.length > 0 ? (
              <ul>
                {strengths.map((strength, index) => (
                  <li key={index}>
                    {strength}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-feedback">
                No strengths were provided.
              </p>
            )}

          </div>

          <div className="feedback-card">

            <div className="feedback-icon improve">
              <i className="bi bi-lightbulb"></i>
            </div>

            <h2>
              Areas to Improve
            </h2>

            {areasToImprove.length > 0 ? (
              <ul>
                {areasToImprove.map((item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-feedback">
                No improvement areas were provided.
              </p>
            )}

          </div>

        </section>

        <section className="results-actions">

          <Link
            to="/interview-setup"
            className="retry-interview-btn"
          >
            <i className="bi bi-arrow-repeat"></i>
            Try Another Interview
          </Link>

          <Link
            to="/dashboard"
            className="results-dashboard-btn"
          >
            Back to Dashboard
          </Link>

        </section>

      </div>
    </main>
  );
}

export default Results;