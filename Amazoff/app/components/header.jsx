import React from 'react';

const Header = () => (
  <div className="hero-head">
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <span className="navbar-burger burger" data-target="navbarMenuHeroA">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <div id="navbarMenuHeroA" className="navbar-menu">
          <div className="navbar-end">
            <a className="navbar-item is-active">
              Home
            </a>
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
