/* eslint-disable no-console */
import React, { Component } from 'react';
import CountUp from 'react-countup';
import cx from 'classnames';

class Results extends Component {

  renderAccuracy() {
    const accuracyClasses = cx({
      'is-size-1': true,
      'has-text-warning': this.props.accuracy >= 50 && this.props.accuracy < 70,
      'has-text-danger': this.props.accuracy < 50,
      'has-text-success': this.props.accuracy > 70
    });
    return (
      <p className={accuracyClasses}><CountUp delay={0.4} duration={3} end={this.props.accuracy} />%</p>
    );
  }

  renderVerdict() {
    const verdictClasses = cx({
      'is-size-1': true,
      'has-text-danger': this.props.result === 'Deceptive',
      'has-text-success': this.props.result === 'Truthful',
    });

    const iconClasses = cx({
      'fas': true,
      'mr20': true,
      'fa-times-circle': this.props.result === 'Deceptive',
      'fa-check-circle': this.props.result === 'Truthful',
    });

    return (
      <p className={verdictClasses}>
        <span className="pl10"><i className={iconClasses}></i></span>
        <span>
          {this.props.result}
        </span>
      </p>
    );
  }

  render() {
    return (
      <div className="is-fluid pt20">
        <div className="tile is-ancestor has-text-centered">
          <div className="tile is-vertical">
            <div className="tile is-parent is is-vertical">
              <div className="tile is-parent">
                <div className="tile is-child">
                  <div className="card">
                    <div className="card-header">
                      <p className="card-header-title is-2">Verdict</p>
                    </div>
                    <div className="card-content">
                      {this.renderVerdict()}
                    </div>
                  </div>
                </div>
                <div className="tile is-child">
                  <div className="card">
                    <div className="card-header">
                      <p className="card-header-title is-2">Confidence Score</p>
                    </div>
                    <div className="card-content">
                      {this.renderAccuracy()}
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

export default Results;

