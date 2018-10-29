import React from 'react';
import { connect } from 'react-redux';

import { toggleReview, toggleModal } from '../actions/index';

class Header extends React.Component {

  returnToReview() {
    this.props.toggleReview(false);
  }

  toggleModal() {
    this.props.toggleModal();
  }

  render() {
    return (
      <div className="hero-head">
        <nav className="navbar has-shadow">
          <div className="container">
            <div className="navbar-brand">
              {this.props.showResults &&
                <a href="#" role="button" className="navbar-item title header-title is-rounded is-3" onClick={() => this.returnToReview()}>
                  Lucify
                </a>
              }
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

const mapStateToProps = (state) => {
  return { showResults: state.toggleReview };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleReview: (value) => dispatch(toggleReview(value)),
    toggleModal: () => dispatch(toggleModal())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
