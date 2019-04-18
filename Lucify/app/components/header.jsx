import React from 'react';
import { connect } from 'react-redux';

import { toggleModal } from '../actions/index';

const lucifyLogo = require('../../public/lucify.png');

class Header extends React.Component {

  toggleModal() {
    this.props.toggleModal();
  }

  render() {
    return (
      <div className="hero-head">
        <nav className="navbar">
          <div className="container is-fluid">
            <div className="navbar-brand">
              <a href="/" role="button" className="navbar-item title header-title is-rounded is-3">
                <figure className="image is-32x32 mr5">
                  <img src={`${lucifyLogo}`} />
                </figure>
                Lucify
              </a>
            </div>
            <div id="navbarMenuHeroA" className="navbar-menu">
              <div className="navbar-end">
                <a className="navbar-item">
                  <button className="button is-primary" onClick={() => this.toggleModal()}>What is this?</button>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(toggleModal()),
  };
};

export default connect(null, mapDispatchToProps)(Header);
