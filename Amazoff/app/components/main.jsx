import React from 'react';

const logo = require('../../public/lucasoff.png');

const Main = () => (
  <div className="hero-body">
    <div className="container has-text-centered main-title-container">
      <h1 className="title">
        <img className="logo" src={logo} alt="Logo" />
      </h1>
      <h2 className="subtitle">
        This is the flagship app, demonstrating the power of the LUCAS API.
      </h2>
    </div>
    <div className="main-fakereview-input">
      <textarea className="textarea" placeholder="Enter your review here..."></textarea>
    </div>
  </div>
);

export default Main;
