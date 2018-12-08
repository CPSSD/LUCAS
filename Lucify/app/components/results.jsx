/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import CountUp from 'react-countup';
import cx from 'classnames';
import { forEach } from 'lodash';
import { connect } from 'react-redux';

const PALETTE = [
  '#e0312f',
  '#e65b22',
  '#ed9217',
  '#e2a822',
  '#000000',
  '#b0c323',
  '#75bb25',
  '#47d131',
  '#46bc48'
];

class Results extends Component {
  getWordColour(confidence) {
    const fixedConfidence = confidence ? confidence.toFixed(2) : 0;
    switch (true) {
      case (fixedConfidence > 0.75):
        return PALETTE[0];
      case (fixedConfidence > 0.5 && fixedConfidence < 0.75):
        return PALETTE[1];
      case (fixedConfidence > 0.25 && fixedConfidence < 0.5):
        return PALETTE[2];
      case (fixedConfidence > 0 && fixedConfidence < 0.25):
        return PALETTE[3];
      case (fixedConfidence === 0):
        return PALETTE[4];
      case (fixedConfidence < 0 && fixedConfidence > -0.25):
        return PALETTE[5];
      case (fixedConfidence < -0.25 && fixedConfidence > -0.5):
        return PALETTE[6];
      case (fixedConfidence < -0.5 && fixedConfidence > -0.75):
        return PALETTE[7];
      case (fixedConfidence < -0.75):
        return PALETTE[8];
      default:
        return PALETTE[4];
    }
  }

  calculateAccuracy(confidence) {
    let positiveConfidence = Math.abs(confidence.toFixed(2));
    if (positiveConfidence > 1) {
      positiveConfidence = 1;
    }
    return positiveConfidence * 100;
  }

  compareConfidence(first, second) {
    const firstAccuracy = this.calculateAccuracy(first.confidence);
    const secondAccuracy = this.calculateAccuracy(second.confidence);
    if (firstAccuracy < secondAccuracy) {
      return 1;
    } if (firstAccuracy > secondAccuracy) {
      return -1;
    }
    return 0;
  }

  renderAccuracy(accuracy) {
    const accuracyClasses = cx({
      pr10: true,
      pl10: true,
      'is-2': true,
      'has-text-warning': accuracy >= 50 && accuracy < 70,
      'has-text-danger': accuracy < 50,
      'has-text-success': accuracy > 70
    });
    return (
      <p className={accuracyClasses}><CountUp delay={0.4} duration={3} end={accuracy} />%</p>
    );
  }

  renderVerdict(verdict, index) {
    const verdictClasses = cx({
      pl10: true,
      'has-text-danger': verdict === 'Deceptive',
      'has-text-success': verdict === 'Genuine',
    });

    const iconClasses = cx({
      fas: true,
      mr20: true,
      'has-text-danger': verdict === 'Deceptive',
      'has-text-success': verdict === 'Genuine',
      'fa-times-circle': verdict === 'Deceptive',
      'fa-check-circle': verdict === 'Genuine',
    });

    return (
      <p className="card-header-title is-2">
        Review {index + 1}:
        <span className={verdictClasses}> {verdict}</span>
        <span className="pl10"><i className={iconClasses}></i></span>
      </p>
    );
  }

  renderReview(featureWeights, review) {
    const splitReview = review.split(' ');
    const reviewText = [];
    forEach(splitReview, (value, index) => {
      const wordValue = featureWeights[value];
      const color = this.getWordColour(wordValue);
      reviewText.push(
        <span key={`${value}-${index}`} style={{ color: color }}>{value}</span>
      );
      reviewText.push(<span key={`${value}-${index}-2`}> </span>);
    });
    return (
      reviewText
    );
  }

  render() {
    const { weights, business } = this.props;
    const resultsArray = [];
    weights.sort((first, second) => this.compareConfidence(first, second));
    forEach(weights, (weight, index) => {
      const { confidence, result, feature_weights, review} = weight;
      resultsArray.push(
        <div className="is-fluid pt20" key={`result-${index}`}>
          <div className="tile is-ancestor">
            <div className="tile is-parent">
              <div className="tile is-child">
                <div className="card">
                  <div className="card-header">
                    {this.renderVerdict(result, index)}
                    <div className="card-header-title is-3">
                      Confidence:
                      {this.renderAccuracy(this.calculateAccuracy(confidence))}
                    </div>
                  </div>
                  <div className="card-content">
                    {this.renderReview(feature_weights, review)}
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
          <div className="card mb10">
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-64x64">
                    <img src={business.image_url} />
                  </figure>
                </div>
                <div className="media-content columns">
                  <div className="column is-4">
                    <a href={business.url} target="_blank" rel="noopener noreferrer" className="title is-4">{business.name}</a>
                    <div className="has-text-success is-size-4">{business.price}</div>
                  </div>
                  <div className="column is-2">Rating: {business.rating}/5</div>
                  <div className="column is-3">
                    <div>Address:</div>
                    <div>{business.location.address1}</div>
                    <div>{business.location.display_address[1]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {resultsArray}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    weights: state.weights,
    business: state.business
  };
};

export default connect(mapStateToProps, null)(Results);

