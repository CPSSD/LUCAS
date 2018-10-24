/* eslint-disable no-console */
import React, { Component } from 'react';
import CountUp from 'react-countup';
import { connect } from 'react-redux';

import { toggleReview } from '../actions/index';


class Results extends Component {

  returnToReview() {
    this.props.toggleReview(false);
  }

  render() {
    return (
      <div className="is-fluid has-text-centered pt20">
        <div className="tile is-ancestor">
          <div className="tile is-vertical">
            <div className="tile is-parent">
              <div className="tile is-child">
                <p className="title is-1">Your Review</p>
                <p className="subtitle">{this.props.text}</p>
                <button className="button is-link is-medium" onClick={() => this.returnToReview()}>
                  <span>
                    Edit Your Review
                  </span>
                  <span className="pl10"><i className="fas fa-arrow-circle-right"></i></span>
                </button>
              </div>
            </div>
            <div className="tile is-parent">
              <div className="tile is-child">
                <p className="title is-1">Results</p>
              </div>
            </div>
            <div className="tile is-parent">
              <div className="tile is-child">
                <p className="title is-2">Accuracy</p>
                <p className="subtitle is-4"><CountUp delay={0.4} duration={4} end={this.props.accuracy} />%</p>
              </div>
              <div className="tile is-child">
                <p className="title is-2">Verdict</p>
                <p className="subtitle is-4">{this.props.result}</p>
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Results);

