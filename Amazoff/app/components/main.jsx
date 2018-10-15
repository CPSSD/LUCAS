import React from 'react';

const logo = require('../../public/logo.svg');

const Main = () => (
  <div className="hero-body">
    <div className="container has-text-centered main-title-container">
      <h1 className="title">
        <img src={logo} alt="Logo" />
      </h1>
      <h2 className="subtitle">
        The one stop shop for all your fake review Needs
      </h2>
    </div>
    <div className="main-fakereview-input">
      <textarea className="textarea" placeholder="Give us your review"></textarea>
    </div>
  </div>
);

export default Main;
