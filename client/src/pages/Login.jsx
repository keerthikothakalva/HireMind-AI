import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://hiremind-ai-yqdp.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem(
  "userEmail",
  data.user.email
);

      localStorage.setItem(
        "hiremindUserName",
        data.user.name
      );

      localStorage.setItem(
        "hiremindUserId",
        data.user.id
      );

      if (rememberMe) {
        localStorage.setItem(
          "hiremindRememberMe",
          "true"
        );
      } else {
        localStorage.removeItem(
          "hiremindRememberMe"
        );
      }

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">

          <div className="auth-logo">
            <i className="bi bi-stars"></i>
          </div>

          <div>
            <span>HireMind</span> AI
          </div>

        </div>

        <div className="auth-card">

          <div className="auth-header">

            <h1>Welcome back</h1>

            <p>
              Log in to continue your interview preparation.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}>
            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <i className="bi bi-envelope"></i>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}/>

              </div>

            </div>

            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <a href="#forgot-password">
                  Forgot password?
                </a>

              </div>

              <div className="input-wrapper">

                <i className="bi bi-lock"></i>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />

              </div>

            </div>

            <div className="remember-row">

              <label>

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    setRememberMe(e.target.checked);
                    setError("");
                  }}
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>

            {error && (
              <div className="auth-error">

                <i className="bi bi-exclamation-circle"></i>

                {error}

              </div>
            )}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}>

              {loading
                ? "Logging in..."
                : "Log In"}

              {!loading && (
                <i className="bi bi-arrow-right"></i>
              )}

            </button>

          </form>
          <div className="auth-divider">

            <span>
              Don't have an account?
            </span>

          </div>

          <Link
            to="/signup"
            className="auth-switch"
          >
            Create a HireMind AI account
          </Link>

        </div>

        <p className="auth-footer">
          © 2026 HireMind AI. Practice smarter.
          Interview better.
        </p>

      </div>
    </main>
  );
}

export default Login;