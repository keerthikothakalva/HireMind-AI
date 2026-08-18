import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const userEmail = localStorage.getItem("hiremindUser");
  const isLoggedIn = !!userEmail;

  const userName = userEmail
    ? userEmail.split("@")[0]
    : "User";

  const handleLogout = () => {
    localStorage.removeItem("hiremindUser");
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg hire-navbar">
      <div className="container">

        <Link
          className="navbar-brand hire-logo"
          to={isLoggedIn ? "/dashboard" : "/"}
        >
          <span className="logo-icon">
            <i className="bi bi-stars"></i>
          </span>

          HireMind <span>AI</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hireNavbar"
          aria-controls="hireNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list"></i>
        </button>

        <div
          className="collapse navbar-collapse"
          id="hireNavbar"
        >

          {isLoggedIn ? (
            <>

              <div className="navbar-center"></div>

              <div className="navbar-actions">

                <div className="profile-dropdown">

                  <button
                    type="button"
                    className="navbar-user"
                    onClick={() =>
                      setShowDropdown(!showDropdown)
                    }
                  >
                    <i className="bi bi-person-circle"></i>

                    <span>
                      {userName}
                    </span>

                    <i
                      className={`bi ${
                        showDropdown
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      } dropdown-arrow`}
                    ></i>
                  </button>

                  {showDropdown && (
                    <div className="profile-menu">

                      <Link
                        to="/profile"
                        className="profile-menu-item"
                        onClick={() =>
                          setShowDropdown(false)
                        }
                      >
                        <i className="bi bi-person"></i>

                        <span>
                          Profile
                        </span>
                      </Link>

                      
                      <button
                        type="button"
                        className="profile-menu-item logout-menu-item"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right"></i>

                        <span>
                          Logout
                        </span>
                      </button>

                    </div>
                  )}

                </div>

              </div>
            </>
          ) : (
            <>
         
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/"
                  >
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/#how-it-works"
                  >
                    How It Works
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/#about"
                  >
                    About
                  </a>
                </li>

              </ul>

              <div className="navbar-actions">

                <Link
                  to="/login"
                  className="btn login-btn"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="btn signup-btn"
                >
                  Sign Up
                </Link>

              </div>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;