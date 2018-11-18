import React from 'react';
import posed from 'react-pose';
import { connect } from 'react-redux';

import { toggleReview, setReviewWeights } from '../actions/index';
import Results from './results';
import Search from './search';

const DEFAULT_HEIGHT = 50;

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
    applyAtEnd: {
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
  constructor(props) {
    super(props);

    this.state = {
      height: DEFAULT_HEIGHT,
      placeholder: 'Enter your Review',
      value: null,
    };
  }

  componentDidUpdate() {
    this.setFilledTextareaHeight();
  }

  setFilledTextareaHeight() {
    this.ghost.className = 'textarea textarea--ghost display-block';
    if (this.ghost.clientHeight > 0 && this.state.height !== this.ghost.clientHeight) {
      this.setState({
        height: this.ghost.clientHeight,
      });
    }

    this.ghost.className = 'textarea textarea--ghost display-none';
  }

  setValue(event) {
    const { value } = event.target;

    this.setState({ value });
  }

  getExpandableField() {
    const isOneLine = this.state.height <= DEFAULT_HEIGHT;
    const { height, placeholder } = this.state;
    return (
      <textarea
        className="textarea main-fakereview-textarea mb20 mt20"
        name="textarea"
        id="textarea"
        autoFocus
        placeholder={placeholder}
        style={{
          height,
          resize: isOneLine ? 'none' : null
        }}
        onChange={(e) => this.setValue(e)}
      />
    );
  }

  getGhostField() {
    return (
      <div
        className="textarea textarea--ghost display-block"
        ref={(c) => this.ghost = c}
        aria-hidden="true"
      >
        {`${this.state.value} \u200b`}
      </div>
    );
  }

  sendRequest() {
    const { setReviewWeights, toggleReview} = this.props;
    fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review: this.state.value
      })
    })
      .then((res) => res.json())
      .then((response) => {
        setReviewWeights([response]);
        toggleReview(true);
      });
  }

  render() {
    const { showReviewResults, showSearchResults } = this.props;
    const showResults = showReviewResults || showSearchResults;
    return (
      <div className="hero-body has-text-centered">
        <VisibilityContainer className="has-text-centered" pose={!showResults ? 'visible' : 'hidden'}>
          <div className="has-text-centered main-title-container pt20 pb20">
            <h1 className="title main-title is-rounded pb10">
              Lucify
            </h1>
            <h2 className="subtitle pt20">
              This is the flagship app, demonstrating the power of the LUCAS API.
            </h2>
          </div>
        </VisibilityContainer>
        <VisibilityContainer pose={!showSearchResults ? 'visible' : 'hidden'}>
          <ResultsContainer pose={showReviewResults ? 'visible' : 'hidden'}>
            {showReviewResults &&
              <p className="title is-1 pt20">Your Review</p>
            }
          </ResultsContainer>
          {this.getExpandableField()}
          <button className="button is-primary is-rounded is-medium" onClick={() => this.sendRequest()}>
            <span>
              Submit Review
            </span>
            <span className="pl10"><i className="fas fa-arrow-circle-right"></i></span>
          </button>
          <VisibilityContainer className="has-text-centered" pose={!showReviewResults ? 'visible' : 'hidden'}>
            <Search />
          </VisibilityContainer>
        </VisibilityContainer>
        <ResultsContainer pose={showResults ? 'visible' : 'hidden'}>
          {showResults &&
            <Results />
          }
        </ResultsContainer>
        {this.getGhostField()}
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
    setReviewWeights: (weights) => dispatch(setReviewWeights(weights))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

