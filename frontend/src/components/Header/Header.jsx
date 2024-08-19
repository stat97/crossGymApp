import './Header.css';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="menu-icon" onClick={toggleMenu}>
        <i className="fa fa-bars"></i>
      </div>

      <div className="logo-container">
        <NavLink className="logo-link" to="/">
          <h1 className="logo-text">CrossGymApp</h1>
        </NavLink>
      </div>

      <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <NavLink className="nav-link" to="/" onClick={toggleMenu}>
          Home
        </NavLink>
        {!user && (
          <NavLink className="nav-link" to="/login">
            <button className="login-button">Login</button>
          </NavLink>
        )}
        {user && (
          <NavLink
            className="nav-link"
            to="/"
            onClick={() => {
              toggleMenu();
              logout();
            }}
          >
            Logout
          </NavLink>
        )}
      </nav>
    </header>
  );
};
