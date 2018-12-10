/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import CountUp from 'react-countup';
import cx from 'classnames';
import Slider from 'react-slick';
import { forEach, groupBy, map, pickBy, union } from 'lodash';
import { connect } from 'react-redux';
import ShowMore from '@tedconf/react-show-more';
import WordCloud from 'react-d3-cloud';


const googleLogo = require('../../public/google.svg');

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

  renderCarousel(business) {
    const photos = business.photos ? business.photos : [business.image_url];
    const businessPhotos = photos.map((photo, index) => {
      return (
        <img className="is-background" src={photo} alt="" width="100" height="100" key={index} />
      );
    });

    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div className="tile is-child is-12">
        <Slider {...settings}>
          {businessPhotos}
        </Slider>
      </div>
    );
  }

  renderBusiness(business) {
    return (
      <section className="section">
        <h1 className="title is-1"><a href={business.url} target="_blank" rel="noopener noreferrer" className="title is-4">{business.name}</a></h1>
        <div className="container tile is-ancestor">
          <div className="tile is-parent is-2">
            {this.renderCarousel(business)}
          </div>
          <div className="tile is-parent is-vertical is-10">
            <div className="level tile is-child columns">
              <div className="level-item has-text-centered column">
                <div>
                  <p className="heading">Rating</p>
                  <p className="title">{business.rating}/5</p>
                </div>
              </div>
              <div className="level-item has-text-centered column">
                <div>
                  <p className="heading">Price</p>
                  <p className="title">{business.price}</p>
                </div>
              </div>
              <div className="level-item has-text-centered column">
                <div>
                  <p className="heading">Phone</p>
                  <p>{business.phone}</p>
                </div>
              </div>
              <div className="level-item has-text-centered column">
                <div>
                  <p className="heading">Address</p>
                  <p>{business.location.display_address[0]}</p>
                  <p>{business.location.display_address[1]}</p>
                  <p>{business.location.display_address[2]}</p>
                  <p>{business.location.display_address[3]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  renderResults(weights) {
    if (!weights) {
      return (
        <h1>No Review Matched</h1>
      );
    }
    weights.sort((first, second) => this.compareConfidence(first, second));
    return (
      <div className="tile is-child">
        <ShowMore items={weights}>
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

  renderYelpResults(weights) {
    const { datasetWeightsLoaded } = this.props;
    if (!datasetWeightsLoaded) {
      return (
        <div className="tile is-child">
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
          <div className="heading">Please Wait getting Yelp reviews..</div>
        </div>
      );
    }
    return this.renderResults(weights);
  }

  renderWordCloud(weights, datasetWeights) {
    const featureWeights1 = map(weights, 'feature_weights');
    const featureWeights2 = map(datasetWeights, 'feature_weights');
    const mergedFeatureWeights = Object.assign(...union(featureWeights1,featureWeights2));
    const filteredFeatureWeights = pickBy(mergedFeatureWeights, (val) =>{
      return val !== 0;
    });
    const data = [];
    for (let key in filteredFeatureWeights) {
      const currentVal = this.calculateAccuracy(filteredFeatureWeights[key]);
      data.push({ text: key, value: currentVal});
    }
    return (<WordCloud
      data={data}
      width={900}
      height={300}
    />);
  }


  render() {
    const { weights, datasetWeights } = this.props;
    const sortedWeights = groupBy(weights, 'result');
    const sortedDatasetWeights = groupBy(datasetWeights, 'result');
    return (
      <div className="container">
        {this.props.business &&
          this.renderBusiness(this.props.business)
        }
        <div className="level">
          <div className="level-left">
            <div className="level-item has-text-centered">
              <p className="title">Best Reviews</p>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="level-item has-text-centered">
                <p className="title">Worst Reviews</p>
              </div>
            </div>
          </div>
        </div>
        <div className="level">
          <div className="level-item has-text-centered">
            <figure className="image logo">
              <img src={googleLogo} />
            </figure>
          </div>
        </div>
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            {this.renderResults(sortedWeights.Genuine)}
          </div>
          <div className="tile is-parent">
            {this.renderResults(sortedWeights.Deceptive)}
          </div>
        </div>
        <div className="level">
          <div className="level-item has-text-centered">
            <figure className="image logo">
              <img src={yelpLogo} />
            </figure>
          </div>
        </div>
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            {this.renderYelpResults(sortedDatasetWeights.Genuine)}

          </div>
          <div className="tile is-parent">
            {this.renderYelpResults(sortedDatasetWeights.Deceptive)}
          </div>
        </div>
        <div className="level">
          <div className="level-item has-text-centered">
            <p className="title">Word Cloud</p>
          </div>
        </div>
        <div>
          {this.renderWordCloud(weights, datasetWeights)}
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
    datasetWeights: state.datasetWeights
  };
};

export default connect(mapStateToProps, null)(Results);

