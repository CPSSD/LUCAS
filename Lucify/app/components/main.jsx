import React from 'react';
import posed from 'react-pose';
import { connect } from 'react-redux';

import { toggleReview } from '../actions/index';
import Results from './results';

const logo = require('../../public/lucasoff.png');

const DEFAULT_HEIGHT = 50;

const ReviewContainer = posed.div({
  visible: {
    opacity: 1,
    applyAtStart: { display: 'block' },
    delay: 400,
  },
  hidden: {
    opacity: 0,
    applyAtEnd: { display: 'none' },
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
        const { classProbs, result } = response;
        this.setState({ accuracy: classProbs[0][0].toFixed(2) * 100, result });
        this.props.toggleReview(true);
      });
  }

  render() {
    return (
      <div className="hero-body has-text-centered">
        <ReviewContainer className="has-text-centered" pose={!this.props.showResults ? 'visible' : 'hidden'}>
          <div className="has-text-centered main-title-container pt20 pb20">
            <h1 className="title main-title is-rounded">
              Lucify
            </h1>
            <h2 className="subtitle pt20">
              This is the flagship app, demonstrating the power of the LUCAS API.
          </h2>
          </div>
        </ReviewContainer>
        {this.getExpandableField()}
        <button className="button is-link is-medium" onClick={() => this.sendRequest()}>
          <span>
            Submit Review
          </span>
          <span className="pl10"><i className="fas fa-arrow-circle-right"></i></span>
        </button>
        {this.getGhostField()}
        <ResultsContainer pose={this.props.showResults ? 'visible' : 'hidden'}>
          {this.props.showResults &&
            <Results
              accuracy={this.state.accuracy}
              result={this.state.result}
              text={this.state.value}
            />
          }
        </ResultsContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { showResults: state.toggleReview };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleReview: (value) => dispatch(toggleReview(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

