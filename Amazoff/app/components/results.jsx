/* eslint-disable no-console */
import React, { Component } from 'react';
import CountUp from 'react-countup';
import { connect } from 'react-redux';
import cx from 'classnames';

import { toggleReview } from '../actions/index';


class Results extends Component {

  returnToReview() {
    this.props.toggleReview(false);
  }

  renderAccuracy() {
    const accuracyClasses = cx({
      'is-size-1': true,
      'has-text-warning': this.props.accuracy > 50 && this.props.accuracy < 70,
      'has-text-danger': this.props.accuracy < 50,
      'has-text-success': this.props.accuracy > 70
    });
    return (
      <p className={accuracyClasses}><CountUp delay={0.4} duration={4} end={this.props.accuracy} />%</p>
    );
  }

  render() {
    return (
      <div className="is-fluid pt20">
        <div className="tile is-ancestor has-text-centered">
          <div className="tile is-vertical">
            <div className="box tile is-parent">
              <div className="tile is-child">
                <p className="title is-1">Your Review</p>
                <p className="subtitle results-review-text">{this.props.text}</p>
                <button className="button is-link is-medium has-text-centered" onClick={() => this.returnToReview()}>
                  <span>
                    Edit Your Review
                  </span>
                  <span className="pl10"><i className="fas fa-arrow-circle-right"></i></span>
                </button>
              </div>
            </div>
            <div className="tile is-parent is is-vertical">
              <div className="tile is-parent">
                <div className="tile is-child pr20">
                  <div className="card">
                    <div className="card-header">
                      <p className="card-header-title is-2">Accuracy</p>
                    </div>
                    <div className="card-content">
                      {this.renderAccuracy()}
                    </div>
                  </div>
                </div>
                <div className="tile is-child">
                  <div className="card">
                    <div className="card-header">
                      <p className="card-header-title is-2">Verdict</p>
                    </div>
                    <div className="card-content">
                      <p className="subtitle is-4">{this.props.result}</p>
                    </div>
                  </div>
                </div>
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

