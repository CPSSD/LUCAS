import React from 'react';
import { connect } from 'react-redux';

class Header extends React.Component {
  render() {
    return ( 
    <div className="hero-head">
      <nav className="navbar has-shadow">
        <div className="container">
          <div className="navbar-brand">
          {this.props.showResults &&
            <a className="navbar-item title header-title is-rounded is-3" href="/">
              Lucify
            </a>
          }
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
    )
  }
};

const mapStateToProps = (state) => {
  return { showResults: state.toggleReview };
};

export default connect(mapStateToProps, null)(Header);
