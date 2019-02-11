/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import CountUp from 'react-countup';
import cx from 'classnames';
import { forEach } from 'lodash';
import { connect } from 'react-redux';
import ShowMore from '@tedconf/react-show-more';

const yelpLogo = require('../../public/yelp.svg');

const PALETTE = [
  '#8b0000',
  '#cd3205',
  '#f67527',
  '#ffbe73',
  '#000000',
  '#81e973',
  '#3abf2f',
  '#0f910a',
  '#006400'
];

class Review extends Component {
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

  setFontWeight(confidence) {
    const fixedConfidence = confidence ? Math.abs(confidence.toFixed(2)) + 1 : 0;
    if (500 * fixedConfidence > 900) {
      return 900;
    }
    return 500 * fixedConfidence;
  }

  calculateAccuracy(confidence) {
    const number = parseFloat(confidence);
    let positiveConfidence = Math.abs(number.toFixed(2));
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

  renderVerdict(verdict) {
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
        <span key={`${value}-${index}`} style={{ color, fontWeight: this.setFontWeight(wordValue) }}>{value}</span>
      );
      reviewText.push(<span key={`${value}-${index}-2`}> </span>);
    });
    return (
      reviewText
    );
  }

  renderResults(weights, type) {
    const { filteredReviews } = this.props;
    const { datasetWeightsLoaded } = this.props;
    const reviews = filteredReviews ? filteredReviews : weights;
    if (!datasetWeightsLoaded) {
      return (
        <div className="tile is-child">
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
          <div className="heading">Please Wait getting Yelp reviews..</div>
        </div>
      );
    }
    if (!reviews[type]) {
      return (
        <h1>No Review Matched</h1>
      );
    }
    reviews[type].sort((first, second) => this.compareConfidence(first, second));
    return (
      <div className="tile is-child">
        <ShowMore items={reviews[type]}>
          {({ current, onMore }) => (
            <div>
              {current.map((weight, index) => {
                const {
                  confidence, result, feature_weights, review
                } = weight;
                if (review !== '') {
                  return (
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
                              <div className="card-content review">
                                {this.renderReview(feature_weights, review)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              <button
                className="button is-outlined is-primary mt20"
                disabled={!onMore}
                onClick={() => onMore()}
              >
                Show More
              </button>
            </div>
          )}
        </ShowMore>
      </div>
    );
  }

  render() {
    const { datasetWeights } = this.props;
    return (
      <div>
        <div className="level">
          <div className="level-left">
            <div className="level-item has-text-centered">
              <p className="title">Most Genuine</p>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="level-item has-text-centered">
                <p className="title">Most Deceptive</p>
              </div>
            </div>
          </div>
        </div>
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            {this.renderResults(datasetWeights, 'Genuine')}
          </div>
          <div className="tile is-parent">
            {this.renderResults(datasetWeights, 'Deceptive')}
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    weights: state.weights,
    business: state.business,
    datasetWeightsLoaded: state.datasetWeightsLoaded,
    datasetWeights: state.datasetWeights,
    filteredReviews: state.filteredReviews,
  };
};

export default connect(mapStateToProps, null)(Review);

