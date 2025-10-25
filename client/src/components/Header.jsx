import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <Link to="/" className="header-logo">
        ClinicApp
      </Link>
      <nav className="header-nav">
        {user ? (
          <>
            <span className="header-userInfo">
              Greeting, {user.username} ({user.role})
            </span>
            <button onClick={logout} className="header-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-link">
              Login
            </Link>
            <Link to="/register" className="header-link">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
