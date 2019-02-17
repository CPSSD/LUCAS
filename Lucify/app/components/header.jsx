import React from 'react';
import { connect } from 'react-redux';

import { toggleReview, toggleSearchReview, setBusiness, toggleModal } from '../actions/index';

const lucifyLogo = require('../../public/lucify.png');

class Header extends React.Component {

  toggleModal() {
    this.props.toggleModal();
  }

  render() {
    const { showReviewResults, showSearchResults } = this.props;
    const showResults = showReviewResults || showSearchResults;
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

const mapStateToProps = (state) => {
  return {
    showReviewResults: state.toggleReview,
    showSearchResults: state.toggleSearchReview
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleReview: (value) => dispatch(toggleReview(value)),
    toggleSearchReview: (value) => dispatch(toggleSearchReview(value)),
    toggleModal: () => dispatch(toggleModal()),
    setBusiness: (business) => dispatch(setBusiness(business))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
