import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="hero-badge">
                  <i className="bi bi-stars"></i>
                  AI-POWERED INTERVIEW PREPARATION
                </div>

                <h1 className="hero-title">
                  Interviews that
                  <span> adapt to you.</span>
                </h1>

                <p className="hero-description">
                  Practice with an AI interviewer that evaluates every
                  answer and adapts the next question to your performance.
                </p>

                <div className="hero-actions">
                  <Link to="/login" className="hero-primary-btn">
                    Start Interview
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>

                <div className="hero-trust">
                  <div>
                    <i className="bi bi-check-circle-fill"></i>
                    9 adaptive questions
                  </div>

                  <div>
                    <i className="bi bi-check-circle-fill"></i>
                    AI-powered feedback
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="interview-preview">
                <div className="preview-header">
                  <div>
                    <span className="status-dot"></span>
                    AI Interviewer
                  </div>

                  <span>Question 4 / 9</span>
                </div>

                <div className="preview-body">
                  <div className="question-label">
                    TECHNICAL INTERVIEW
                  </div>

                  <h3>
                    How would you design authentication
                    for a MERN application?
                  </h3>

                  <div className="answer-preview">
                    <span>Your answer</span>

                    <div className="answer-lines">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>

                  <div className="preview-progress">
                    <div className="progress-dots">
                      <span className="completed"></span>
                      <span className="completed"></span>
                      <span className="completed"></span>
                      <span className="current"></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>

                <div className="preview-footer">
                  <span>
                    <i className="bi bi-shield-check"></i>
                    Adaptive AI
                  </span>

                  <span>
                    <i className="bi bi-lightning-charge"></i>
                    Real-time analysis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="features-section">
        <div className="container">
          <div className="section-heading">
            <span>HOW HIREMIND AI WORKS</span>

            <h2>
              More than a question generator.
            </h2>

            <p>
              HireMind AI understands your performance and adjusts
              the interview as you progress.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-file-earmark-text"></i>
                </div>

                <h3>Understand the Role</h3>

                <p>
                  AI analyzes the job description and identifies
                  the skills and topics relevant to the interview.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-diagram-3"></i>
                </div>

                <h3>Adapt to Your Answers</h3>

                <p>
                  Every answer is evaluated internally so the next
                  question can adapt to your strengths and weaknesses.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-bar-chart"></i>
                </div>

                <h3>Get the Full Picture</h3>

                <p>
                  After nine questions, receive detailed feedback,
                  skill scores, weaknesses, and a personalized roadmap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">

  <div className="container">

    <div className="about-heading">
      <span>ABOUT HIREMIND AI</span>

      <h2>
        Prepare for interviews
        <span>with intelligence.</span>
      </h2>
    </div>

    <div className="row align-items-center about-content-row">

      <div className="col-lg-6">
        <div className="about-content">

          <p>
            HireMind AI is an adaptive interview platform designed to make
            interview preparation more realistic and personalized.
          </p>

          <p>
            Instead of asking the same fixed questions every time, HireMind AI
            analyzes the job description, evaluates your answers internally,
            and adapts the next question based on your performance.
          </p>

          <div className="about-points">

            <div className="about-point">
              <div className="about-point-icon">
                <i className="bi bi-file-earmark-check"></i>
              </div>

              <div>
                <h3>Job-Aware Interviews</h3>
                <p>
                  Questions are tailored to the role you're preparing for.
                </p>
              </div>
            </div>

            <div className="about-point">
              <div className="about-point-icon">
                <i className="bi bi-arrow-repeat"></i>
              </div>

              <div>
                <h3>Adaptive Questioning</h3>
                <p>
                  The interview changes based on your previous answers.
                </p>
              </div>
            </div>

            <div className="about-point">
              <div className="about-point-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>

              <div>
                <h3>Actionable Feedback</h3>
                <p>
                  Receive a complete performance report after all 9 questions.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="col-lg-6">
        <div className="about-visual">

        </div>
      </div>

    </div>
  </div>

</section>
    </main>
  );
}

export default Home;