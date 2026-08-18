import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const location = useLocation();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("hiremindUser");

  const userName = userEmail
    ? userEmail.split("@")[0]
    : "User";

  useEffect(() => {
  const fetchInterviewHistory = async () => {
    try {
      setLoading(true);

      if (!userEmail) {
        setInterviews([]);
        return;
      }

      const response = await fetch(
        `https://hiremind-ai-yqdp.onrender.com/api/interview/history?userEmail=${encodeURIComponent(
          userEmail
        )}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      console.log("Dashboard history response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch interview history"
        );
      }

      setInterviews(data.interviews || []);
    } catch (error) {
      console.error("Dashboard history error:", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  fetchInterviewHistory();
}, [location.key, userEmail]);

  const interviewCount = interviews.length;

  const averageScore =
    interviewCount > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total + interview.overallScore,
            0
          ) / interviewCount
        )
      : null;

  const bestScore =
    interviewCount > 0
      ? Math.max(
          ...interviews.map(
            (interview) => interview.overallScore
          )
        )
      : null;

  const lastInterview =
    interviewCount > 0
      ? new Date(
          interviews[0].createdAt
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;

  return (
    <main className="dashboard-page">
      <div className="container">

        <section className="dashboard-welcome">

          <div>
            <span className="dashboard-label">
              YOUR DASHBOARD
            </span>

            <h1>
              Welcome back{" "}
              <span>{userName}</span>
            </h1>

            <p>
              Ready to sharpen your interview skills?
              Start a new AI-powered interview and see
              how you perform.
            </p>
          </div>

          <Link
            to="/interview-setup"
            className="dashboard-start-btn"
          >
            <i className="bi bi-stars"></i>

            Start New Interview

            <i className="bi bi-arrow-right"></i>
          </Link>

        </section>
        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              <i className="bi bi-play-circle"></i>
            </div>

            <div>
              <span>Interviews</span>

              <strong>
                {loading ? "..." : interviewCount}
              </strong>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              <i className="bi bi-bar-chart"></i>
            </div>

            <div>
              <span>Average Score</span>

              <strong>
                {loading
                  ? "..."
                  : averageScore !== null
                  ? `${averageScore}`
                  : "—"}
              </strong>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              <i className="bi bi-graph-up-arrow"></i>
            </div>

            <div>
              <span>Best Score</span>

              <strong>
                {loading
                  ? "..."
                  : bestScore !== null
                  ? `${bestScore}`
                  : "—"}
              </strong>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              <i className="bi bi-clock-history"></i>
            </div>

            <div>
              <span>Last Interview</span>

              <strong>
                {loading
                  ? "..."
                  : lastInterview || "—"}
              </strong>
            </div>

          </div>

        </section>
        <section className="dashboard-history">

          <div className="history-header">

            <div>

              <span className="dashboard-label">
                YOUR PROGRESS
              </span>

              <h2>
                Interview History
              </h2>

            </div>

            <span className="history-count">
              {loading
                ? "Loading..."
                : `${interviewCount} ${
                    interviewCount === 1
                      ? "interview"
                      : "interviews"
                  }`}
            </span>

          </div>
          {loading && (
            <div className="history-empty">

              <div className="history-empty-icon">
                <i className="bi bi-hourglass-split"></i>
              </div>

              <h3>
                Loading your interviews...
              </h3>

            </div>
          )}

          {!loading && interviewCount === 0 && (
            <div className="history-empty">

              <div className="history-empty-icon">
                <i className="bi bi-clipboard2-check"></i>
              </div>

              <h3>
                No interviews yet
              </h3>

              <p>
                Complete your first HireMind AI
                interview and your results will appear
                here.
              </p>

              

            </div>
          )}
{!loading && interviewCount > 0 && (
  <div className="history-list">

    {interviews.map((interview) => (
      <Link
        to="/results"
        state={{
          results: {
            overallScore: interview.overallScore,
            communication: interview.communication,
            technicalKnowledge: interview.technicalKnowledge,
            problemSolving: interview.problemSolving,
            confidence: interview.confidence,
            summary: interview.summary,
            strengths: interview.strengths,
            areasToImprove: interview.areasToImprove,
          },
          role: interview.role,
          experience: interview.experience,
        }}
        className="history-item"
        key={interview._id}
      >

        <div className="history-item-info">

          <h3>
            {interview.role}
          </h3>

          <p>
            {interview.experience}
          </p>

        </div>
        <div className="history-item-right">

          <span className="history-date">
            {new Date(
              interview.createdAt
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>

          <div className="history-score">

            <strong>
              {interview.overallScore}
            </strong>

            <span>
              / 100
            </span>

          </div>

        </div>

      </Link>
    ))}

  </div>
)}

        </section>
        <section className="dashboard-tip">

          <div className="tip-icon">
            <i className="bi bi-lightbulb"></i>
          </div>

          <div>

            <strong>
              How HireMind AI works
            </strong>

            <p>
              Each interview contains 9 adaptive
              questions. Your answers are evaluated
              internally and the complete feedback report
              is revealed after the interview is finished.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}

export default Dashboard;