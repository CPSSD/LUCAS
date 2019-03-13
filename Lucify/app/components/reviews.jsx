/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import ShowMoreText from 'react-show-more-text';
import Slider from 'react-slick';
import cx from 'classnames';
import { forEach, chunk } from 'lodash';
import { connect } from 'react-redux';
import { resetFilteredReviews } from '../actions/index';

const colours = [
  '#8b0000',
  '#ac0002',
  '#cf0002',
  '#f30001',
  '#ff4300',
  '#ff6e00',
  '#ff9000',
  '#ffae2c',
  '#ffc96e',
  '#ffe4a7',
  '#000000',
  '#00e500',
  '#00d600',
  '#00c700',
  '#00b800',
  '#00aa00',
  '#009b00',
  '#008d00',
  '#007f00',
  '#007200',
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
  getColour(confidence) {
    const fixedConfidence = confidence ? confidence.toFixed(2) : 0;
    if (fixedConfidence <= -1) {
      return colours[0];
    } else if (fixedConfidence <= -0.9) {
      return colours[1];
    } else if (fixedConfidence <= -0.8) {
      return colours[2];
    } else if (fixedConfidence <= -0.7) {
      return colours[3];
    } else if (fixedConfidence <= -0.6) {
      return colours[4];
    } else if (fixedConfidence <= -0.5) {
      return colours[5];
    } else if (fixedConfidence <= -0.4) {
      return colours[6];
    } else if (fixedConfidence <= -0.3) {
      return colours[7];
    } else if (fixedConfidence <= -0.2) {
      return colours[8];
    } else if (fixedConfidence <= -0.1) {
      return colours[9];
    } else if (fixedConfidence < 0.1) {
      return colours[10];
    } else if (fixedConfidence < 0.2) {
      return colours[11];
    } else if (fixedConfidence < 0.3) {
      return colours[12];
    } else if (fixedConfidence < 0.4) {
      return colours[13];
    } else if (fixedConfidence < 0.5) {
      return colours[14];
    } else if (fixedConfidence < 0.6) {
      return colours[15];
    } else if (fixedConfidence < 0.7) {
      return colours[16];
    } else if (fixedConfidence < 0.8) {
      return colours[17];
    } else if (fixedConfidence < 0.9) {
      return colours[18];
    } else if (fixedConfidence < 1) {
      return colours[19];
    } else if (fixedConfidence >= 1) {
      return colours[20];
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
    return Math.round(positiveConfidence * 100);
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

  renderAccuracy(accuracy, colour) {
    const accuracyClasses = cx({
      pr10: true,
      pl10: true,
      'is-2': true,
    });
    return (
      <p className={accuracyClasses} style={{ color: colour }}>{accuracy}%</p>
    );
  }

  renderVerdict(verdict, colour) {
    const verdictClasses = cx({
      pl10: true,
    });

    const iconClasses = cx({
      fas: true,
      mr20: true,
      'fa-times-circle': verdict === 'Deceptive',
      'fa-check-circle': verdict === 'Genuine',
    });
    return (
      <p className="card-header-title is-2">
        <span className={verdictClasses} style={{ color: colour }}> {verdict}</span>
        <span className="pl10"><i className={iconClasses} style={{color: colour }}></i></span>
      </p>
    );
  }

  renderReview(featureWeights, review) {
    const splitReview = review.split(' ');
    const reviewText = [];
    forEach(splitReview, (value, index) => {
      const wordValue = featureWeights[value];
      const color = this.getColour(wordValue);
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
      const updaedConfidence = result === 'Deceptive' ? -parseFloat(confidence) : parseFloat(confidence);
      const colour = this.getColour(parseFloat(updaedConfidence));

      return (
        <div className="tile is-child pr5 pl5 pb5" key={`card-${index}`}>
          <div className="card" style={{ borderTop: `10px solid ${colour}` }}>
            <div className="card-header">
              {this.renderVerdict(result, colour)}
              <div className="card-header-title is-3">
                Confidence: {this.renderAccuracy(this.calculateAccuracy(confidence), colour)}
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
      <div className="has-background-link mb20 pl20 pr20 pb40">
        <div className="level pt20">
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

