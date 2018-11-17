/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import CountUp from 'react-countup';
import cx from 'classnames';
import { forEach } from 'lodash';
import { connect } from 'react-redux';


class Results extends Component {
  renderAccuracy(accuracy) {
    const accuracyClasses = cx({
      'is-size-1': true,
      'has-text-warning': accuracy >= 50 && accuracy < 70,
      'has-text-danger': accuracy < 50,
      'has-text-success': accuracy > 70
    });
    return (
      <p className={accuracyClasses}><CountUp delay={0.4} duration={3} end={accuracy} />%</p>
    );
  }

  renderVerdict(verdict) {
    const verdictClasses = cx({
      'is-size-1': true,
      'has-text-danger': verdict === 'Deceptive',
      'has-text-success': verdict === 'Truthful',
    });

    const iconClasses = cx({
      fas: true,
      mr20: true,
      'fa-times-circle': verdict === 'Deceptive',
      'fa-check-circle': verdict === 'Truthful',
    });

    return (
      <p className={verdictClasses}>
        <span className="pl10"><i className={iconClasses}></i></span>
        <span>
          {verdict}
        </span>
      </p>
    );
  }
  render() {
    const { weights, business } = this.props;
    const resultsArray = [];
    forEach(weights, (weight, index) => {
      const accuracy = weight.classProbs[0][0].toFixed(2) * 100;
      const verdict = weight.result;
      resultsArray.push(
        <div className="is-fluid pt20" key={`result-${index}`}>
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
                        {this.renderVerdict(verdict)}
                      </div>
                    </div>
                  </div>
                  <div className="tile is-child">
                    <div className="card">
                      <div className="card-header">
                        <p className="card-header-title is-2">Confidence Score</p>
                      </div>
                      <div className="card-content">
                        {this.renderAccuracy(accuracy)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        {business &&
          <div className="box tile">
            <div className="tile is-parent is-2">
              <figure className="image is-64x64 tile is-child">
                <img className="is-rounded" src={business.image_url} />
              </figure>
            </div>
            <div className="tile is-parent is-vertical">
              <div className="tile is-child">
                <a href={business.url} target="_blank" rel="noopener noreferrer" className="title">{business.name}</a>
              </div>
              <div className="tile is-child">
                <div>Rating: {business.rating}</div>
              </div>
            </div>
          </div>
        }
        <div>
          {resultsArray}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    weights: state.weights.weights,
    business: state.business
  };
};

export default connect(mapStateToProps, null)(Results);

