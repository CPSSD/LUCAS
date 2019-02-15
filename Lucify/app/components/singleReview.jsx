import React from 'react';
import posed from 'react-pose';
import { connect } from 'react-redux';

import { toggleReview, toggleSingleReview, setReviewWeights } from '../actions/index';

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
    applyAtStart: {
      display: 'none',
    },
  }
});

class SingleReview extends React.Component {
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
    const { setReviewWeights, toggleReview } = this.props;
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

  returnToSearch() {
    const { toggleSingleReview, showSingleReview } = this.props;
    this.props.toggleReview(false);
    toggleSingleReview(!showSingleReview);
  }

  render() {
    const { showSingleReview, showReviewResults, showSearchResults } = this.props;
    const showResults = showReviewResults || showSearchResults;
    return (
      <div className="container is-fluid">
        <VisibilityContainer pose={showSingleReview && !showResults ? 'visible' : 'hidden'}>
          {this.getExpandableField()}
          <button className="button is-primary is-rounded is-medium" onClick={() => this.sendRequest()}>
            <span>
              Submit Review
            </span>
            <span className="pl10"><i className="fas fa-arrow-circle-right"></i></span>
          </button>
        </VisibilityContainer>
        <VisibilityContainer pose={showSingleReview && !showResults ? 'visible' : 'hidden'}>
          <a role="button" onClick={() => this.returnToSearch()} className="pt10 single-review-button">Return to Search</a>
          {this.getGhostField()}
        </VisibilityContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showReviewResults: state.toggleSearch,
    showSingleReview: state.toggleSingleReview,
    showSearchResults: state.toggleSearchReview,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleReview: (value) => dispatch(toggleReview(value)),
    toggleSingleReview: (value) => dispatch(toggleSingleReview(value)),
    setReviewWeights: (weights) => dispatch(setReviewWeights(weights))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleReview);

