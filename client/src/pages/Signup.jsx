import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

   
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!agreeTerms) {
      setError(
        "Please agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://hiremind-ai-yqdp.onrender.com/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed.");
        return;
      }

      
      localStorage.setItem(
        "hiremindUser",
        email
      );

      localStorage.setItem(
        "hiremindUserName",
        name
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("Signup error:", error);

      setError(
        "Unable to connect to the server."
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

            <h1>Create your account</h1>

            <p>
              Start practicing with your AI-powered
              adaptive interviewer.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                <i className="bi bi-exclamation-circle"></i>
                {error}
              </div>
            )}
            <div className="form-group">

              <label htmlFor="name">
                Full name
              </label>

              <div className="input-wrapper">

                <i className="bi bi-person"></i>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>

            </div>
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
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <i className="bi bi-lock"></i>

                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="input-wrapper">

                <i className="bi bi-shield-lock"></i>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}/>

              </div>

            </div>


            <div className="terms-row">

              <label>

                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    setError("");
                  }}
                />

                <span>
                  I agree to the Terms of Service
                  and Privacy Policy
                </span>

              </label>

            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}>

              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <i className="bi bi-arrow-right"></i>
              )}

            </button>

          </form>


          <div className="auth-divider">

            <span>
              Already have an account?
            </span>

          </div>

          <Link
            to="/login"
            className="auth-switch"
          >
            Log in to HireMind AI
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

export default Signup;