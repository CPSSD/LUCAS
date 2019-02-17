/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import posed from 'react-pose';
import { connect } from 'react-redux';

import Results from './results';
import Search from './search';
import SingleReview from './singleReview';

const lucifyLogo = require('../../public/lucify.png');

const VisibilityContainer = posed.div({
  visible: {
    opacity: 1,
    transition: {
      opacity: { ease: 'easeOut', duration: 300 },
    },
    applyAtStart: { display: 'block', height: '100%' },
  },
  hidden: {
    opacity: 0,
    transition: { ease: 'easeOut', duration: 500 },
    applyAtStart: {
      display: 'none',
    },
  }
});


const ResultsContainer = posed.div({
  visible: {
    opacity: 1,
    delay: 400,
  },
  hidden: {
    opacity: 0,
  }
});
class Main extends React.Component {
  render() {
    const { showReviewResults, showSearchResults, showSingleReview } = this.props;
    const showResults = showReviewResults || showSearchResults;
    return (
      <div className="hero-body has-text-centered">
        <VisibilityContainer className="has-text-centered" pose={!showResults ? 'visible' : 'hidden'}>
          <div className="has-text-centered container main-title-container pt20 pb20 is-fluid">
            <h1 className="title main-title pb10">
              <figure className="image is-128x128">
                <img src={`${lucifyLogo}`} />
              </figure>
              Lucify
            </h1>
            <h2 className="subtitle pt20">
              This is the flagship app, demonstrating the power of the LUCAS API.
            </h2>
          </div>
        </VisibilityContainer>
        <ResultsContainer pose={showReviewResults ? 'visible' : 'hidden'}>
          {showReviewResults &&
            <p className="title is-1 pt20">Your Review</p>
          }
        </ResultsContainer>
        <VisibilityContainer className="has-text-centered" pose={!showSearchResults ? 'visible' : 'hidden'}>
          <Search />
        </VisibilityContainer>
        <ResultsContainer pose={showResults ? 'visible' : 'hidden'}>
          {showResults &&
            <Results />
          }
        </ResultsContainer>
        <SingleReview />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showReviewResults: state.toggleReview,
    showSearchResults: state.toggleSearchReview,
    showSingleReview: state.toggleSingleReview,
  };
};

export default connect(mapStateToProps, null)(Main);

