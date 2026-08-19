import { useEffect, useState } from "react";
import "../styles/Profile.css";

function Profile() {
  const [interviews, setInterviews] = useState([]);

  const userEmail = localStorage.getItem("userEmail");

const userName =
  localStorage.getItem("hiremindUserName") || "User";

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
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

        console.log("Profile history response:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch interview history"
          );
        }

        setInterviews(data.interviews || []);
      } catch (error) {
        console.error(
          "Profile interview error:",
          error
        );

        setInterviews([]);
      }
    };

    fetchInterviews();
  }, [userEmail]);

  const interviewCount = interviews.length;

  const overallScore =
    interviewCount > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total +
              Number(interview.overallScore || 0),
            0
          ) / interviewCount
        )
      : 0;

  const communication =
    interviewCount > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total +
              Number(interview.communication || 0),
            0
          ) / interviewCount
        )
      : 0;

  const technicalKnowledge =
    interviewCount > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total +
              Number(
                interview.technicalKnowledge || 0
              ),
            0
          ) / interviewCount
        )
      : 0;

  const problemSolving =
    interviewCount > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total +
              Number(interview.problemSolving || 0),
            0
          ) / interviewCount
        )
      : 0;

  const confidence =
    interviewCount > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total +
              Number(interview.confidence || 0),
            0
          ) / interviewCount
        )
      : 0;

  const skillFrequency = {};

  interviews.forEach((interview) => {
    if (
      Array.isArray(interview.techStacks)
    ) {
      interview.techStacks.forEach((skill) => {
        if (
          typeof skill === "string" &&
          skill.trim()
        ) {
          const normalizedSkill =
            skill.trim();

          skillFrequency[normalizedSkill] =
            (skillFrequency[normalizedSkill] || 0) +
            1;
        }
      });
    }
  });

  const topSkills = Object.entries(
    skillFrequency
  )
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill)
    .slice(0, 8);

  const rolePerformance = Object.values(
    interviews.reduce((roles, interview) => {
      const role = interview.role;

      if (!role) {
        return roles;
      }

      if (!roles[role]) {
        roles[role] = {
          role,
          total: 0,
          count: 0,
        };
      }

      roles[role].total += Number(
        interview.overallScore || 0
      );

      roles[role].count += 1;

      return roles;
    }, {})
  ).map((item) => ({
    role: item.role,
    score: Math.round(
      item.total / item.count
    ),
  }));

  return (
    <main className="profile-page">
      <div className="profile-container">

        <section className="profile-header-card">

          <div className="profile-header-content">

            <span className="profile-label">
              PROFILE
            </span>

            <div className="profile-user-info">

              <div className="profile-avatar">
                <i className="bi bi-person-fill"></i>
              </div>

              <div>

                <h1>{userName}</h1>

                <p>
                  {userEmail ||
                    "No email available"}
                </p>

                <span>
                  Interview Candidate
                </span>

              </div>

            </div>

          </div>

        </section>

        <section className="profile-main-grid">

          <div className="profile-card skills-card">

            <div className="profile-card-header">
              <h2>TOP SKILLS</h2>
            </div>

            {topSkills.length > 0 ? (

              <div className="skills-list">

                {topSkills.map((skill) => (
                  <span key={skill}>
                    {skill}
                  </span>
                ))}

              </div>

            ) : (

              <div className="skills-empty">
                Complete an interview to see
                your top skills.
              </div>

            )}

          </div>

          <div className="profile-card performance-card">

            <div className="profile-card-header">
              <h2>PERFORMANCE</h2>
            </div>

            <div className="overall-score">

              <strong>
                {interviewCount > 0
                  ? overallScore
                  : "—"}
              </strong>

              <span>
                Overall Score
              </span>

            </div>

            <div className="performance-list">

              <div>
                <span>
                  Communication
                </span>

                <strong>
                  {interviewCount > 0
                    ? communication
                    : "—"}
                </strong>
              </div>

              <div>
                <span>
                  Technical
                </span>

                <strong>
                  {interviewCount > 0
                    ? technicalKnowledge
                    : "—"}
                </strong>
              </div>

              <div>
                <span>
                  Problem Solving
                </span>

                <strong>
                  {interviewCount > 0
                    ? problemSolving
                    : "—"}
                </strong>
              </div>

              <div>
                <span>
                  Confidence
                </span>

                <strong>
                  {interviewCount > 0
                    ? confidence
                    : "—"}
                </strong>
              </div>

            </div>

          </div>

        </section>

        <section className="profile-card role-card">

          <div className="profile-card-header">
            <h2>ROLE PERFORMANCE</h2>
          </div>

          {rolePerformance.length > 0 ? (

            <div className="role-list">

              {rolePerformance.map((item) => (

                <div
                  className="role-row"
                  key={item.role}>

                  <span>
                    {item.role}
                  </span>

                  <strong>
                    {item.score}%
                  </strong>

                </div>

              ))}

            </div>

          ) : (

            <div className="role-empty">
              Complete an interview to see
              your role performance.
            </div>

          )}

        </section>

      </div>
    </main>
  );
}

export default Profile;

