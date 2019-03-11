/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import CountUp from 'react-countup';
import ShowMoreText from 'react-show-more-text';
import Slider from 'react-slick';
import cx from 'classnames';
import { forEach, chunk } from 'lodash';
import { connect } from 'react-redux';
import { resetFilteredReviews } from '../actions/index';

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

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div onClick={onClick} className={"arrow-prev"}>
      <i className="fas fa-chevron-left"></i>
    </div>
  );
}

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div onClick={onClick} className={"arrow-next"}>
      <i className="fas fa-chevron-right"></i>
    </div>
  );
}

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

  resetData() {
    this.props.resetFilteredReviews();
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
      <p className={accuracyClasses}>{accuracy}%</p>
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

  renderCards(reviews) {
    if (!reviews) { return null; }
    return reviews.map((reviewInfo, index) => {
      const { confidence, result, feature_weights, review } = reviewInfo;
      return (
        <div className="tile is-child pr5 pl5 pb5" key={`card-${index}`}>
          <div className="card">
            <div className="card-header">
              {this.renderVerdict(result, index)}
              <div className="card-header-title is-3">
                Confidence: {this.renderAccuracy(this.calculateAccuracy(confidence))}
              </div>
            </div>
            <div className="card-content review">
              <ShowMoreText
                lines={3}
                more="Show more"
                less="Show less"
              >
                {this.renderReview(feature_weights, review)}
              </ShowMoreText>
            </div>
          </div>
        </div>
      );
    });
  }

  renderReviews(reviews) {
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };
    reviews.sort((first, second) => this.compareConfidence(first, second));
    const chunkedReviews = chunk(reviews, 4);
    const reviewHTML = chunkedReviews.map((reviews, index) => {
      const chunkedSlide = chunk(reviews, 2);
      return (
        <div className="is-fluid pt20" key={`result-${index}`}>
          <div className="tile is-ancestor is-vertical">
            <div className="tile is-parent width-100">
              {this.renderCards(chunkedSlide[0])}
            </div>
            <div className="tile is-parent width-100">
              {this.renderCards(chunkedSlide[1])}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="tile is-child is-12 box pb40">
        <Slider {...settings}>
          {reviewHTML}
        </Slider>
      </div>
    );
  }

  renderResults() {
    const { filteredReviews, datasetWeightsLoaded } = this.props;
    if (!datasetWeightsLoaded) {
      return (
        <div className="tile is-child">
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
          <div className="heading">Please Wait getting Yelp reviews..</div>
        </div>
      );
    }

    return (
      <div className="tile is-ancestor">
        <div className="tile is-parent width-100">
          {this.renderReviews(filteredReviews)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="level baseline">
          <div className="level-left">
            <div className="level-item has-text-centered pt20">
              <p className="title">Reviews</p>
            </div>
          </div>
          <div className="level-right">
            <a className="button is-danger" onClick={() => this.resetData()}>Reset</a>
          </div>
        </div>
        {this.renderResults()}
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

const mapDispatchToProps = (dispatch) => {
  return {
    resetFilteredReviews: () => dispatch(resetFilteredReviews()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Review);

