import './Footer.css';

import { NavLink } from 'react-router-dom';

export const Footer = () => {
  return (
    <>
      <div className="footer-outer-conatiner with-top-line">
        <footer className="footer-container">
          <div className="column2">
            <h5>Contact</h5>
            <p>
              <strong>Email:</strong> appcrossgym@gmail.com
            </p>
            <div className="logo-white"></div>
          </div>

          <div className="column1">
            <h5>Follow us</h5>
            <a href="/">Linkedin</a>
            <a href="/">Twitter</a>
            <a href="/">Instagram</a>
            <a href="/">Podcast</a>
          </div>

          <div className="column3">
            <h5>Navigation</h5>

            <NavLink className="links" to="/">
              Home
            </NavLink>

        
          </div>
        </footer>

        {/* <p className="rights">crossGymApp All Rights Reserved</p> */}
      </div>
    </>
  );
};