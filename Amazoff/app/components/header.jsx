import React from 'react';

const Header = () => (
  <div className="hero-head">
    <nav className="navbar has-shadow">
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            Home
          </a>
        </div>
        <div id="navbarMenuHeroA" className="navbar-menu">
          <div className="navbar-end">
            <a className="navbar-item">
              What is it?
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
);

export default Header;
