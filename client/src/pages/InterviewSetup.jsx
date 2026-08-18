import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InterviewSetup.css";

function InterviewSetup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "MERN Developer",
    "MERN + Generative AI Developer",
    "Full Stack + AI Developer",
    "Generative AI Developer",
    "AI/ML Engineer",
    "Python Developer",
    "JavaScript Developer",
    "Data Analyst",
  ];


  const experienceLevels = [
    "Fresher",
    "0–1 Years",
    "1–2 Years",
    "2–3 Years",
  ];
  const handleStartInterview = async () => {
    setError("");

    if (!role || !experience || !resume) {
      setError(
        "Please select target role, experience level and upload your resume."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("role", role);
      formData.append("experience", experience);
      formData.append(
        "jobDescription",
        jobDescription.trim()
      );

      formData.append("resume", resume);

      console.log("==========");
      console.log("Starting interview...");
      console.log("Role:", role);
      console.log("Experience:", experience);
      console.log("Resume:", resume.name);
      console.log(
        "Job Description:",
        jobDescription.trim()
      );
      console.log("==========");

      const response = await fetch(
        "https://hiremind-ai-yqdp.onrender.com/api/interview/questions",
        {
          method: "POST",
          body: formData,
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      console.log(
        "Questions API response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to generate interview questions."
        );
      }

      if (
        !data.questions ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error(
          "No interview questions were generated."
        );
      }

      if (
        !data.resumeText ||
        typeof data.resumeText !== "string" ||
        !data.resumeText.trim()
      ) {
        throw new Error(
          "Resume text could not be extracted."
        );
      }

      console.log(
        "Questions generated:",
        data.questions.length
      );

      console.log(
        "Resume text length:",
        data.resumeText.length
      );
      navigate("/interview", {
        state: {
          role: role,
          experience: experience,

          resumeText: data.resumeText,

          questions: data.questions,

          jobDescription:
            jobDescription.trim(),
        },
      });
    } catch (err) {
      console.error(
        "Start interview error:",
        err
      );

      setError(
        err.message ||
          "Unable to start interview."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
  role.trim() !== "" &&
  experience.trim() !== "" &&
  resume !== null;
  return (
    <main className="interview-setup-page">
      <div className="interview-setup-container">

        <div className="interview-setup-header">

          <span className="interview-label">
            AI INTERVIEW
          </span>

          <h1>
            Set up your interview
          </h1>

          <p>
            Upload your resume and tell us what
            role you're targeting. Add a job
            description if you have one, and
            HireMind AI will create a personalized
            interview using your profile.
          </p>

        </div>

        <section className="setup-card">

          <div className="setup-group">

            <label htmlFor="role">
              Target role
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setError("");
              }}
              disabled={loading}>

              <option value="">
                Select your target role
              </option>

              {roles.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>

          <div className="setup-group">

            <label htmlFor="experience">
              Experience level
            </label>

            <select
              id="experience"
              value={experience}
              onChange={(event) => {
                setExperience(event.target.value);
                setError("");
              }}
              disabled={loading}>

              <option value="">
                Select experience level
              </option>

              {experienceLevels.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>

          <div className="setup-group">

            <label htmlFor="resume">
              Upload your resume
            </label>

            <input
              id="resume"
              type="file"
              className="setup-file-input"
              accept=".pdf,.docx"
              disabled={loading}
              onChange={(event) => {

                const selectedFile =
                  event.target.files?.[0] ||
                  null;

                setResume(selectedFile);
                setError("");
              }}/>

            {resume && (
              <div className="setup-file-selected">

                <i className="bi bi-file-earmark-text-fill"></i>

                <span title={resume.name}>
                  {resume.name}
                </span>

              </div>
            )}

          </div>
          <div className="setup-group">

            <label htmlFor="jobDescription">

              <span>
                Job description
              </span>

              <span className="optional-label">
                Optional
              </span>

            </label>

            <textarea
              id="jobDescription"
              className="job-description-input"
              placeholder="Paste the job description here if you have one..."
              value={jobDescription}
              disabled={loading}
              onChange={(event) =>
                setJobDescription(
                  event.target.value
                )
              }
              rows={7}
            />

            <p className="setup-help-text">
              If provided, HireMind AI will use the
              job requirements to make the interview
              more relevant to the position.
            </p>

          </div>
          {error && (
            <div className="setup-error">

              <i className="bi bi-exclamation-circle"></i>

              <span>
                {error}
              </span>

            </div>
          )}
          {!isFormValid && !error && (
            <div className="setup-requirement">

              <i className="bi bi-info-circle"></i>

              <span>
                Target role, resume and experience
                level are required
              </span>

            </div>
          )}
          <button
  type="button"
  className="start-interview-btn"
  onClick={handleStartInterview}
  disabled={loading}
>
  <span>
    {loading
      ? "Preparing Interview..."
      : "Start AI Interview"}
  </span>

  {!loading && (
    <i className="bi bi-arrow-right"></i>
  )}
</button>

        </section>

      </div>
    </main>
  );
}

export default InterviewSetup;
