/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import Slider from 'react-slick';
import { map, pickBy, union } from 'lodash';
import { connect } from 'react-redux';
import WordCloud from 'react-d3-cloud';
import DotChart from './dotChart';
import Review from './reviews';

class Results extends Component {

  calculateAccuracy(confidence) {
    const number = parseFloat(confidence);
    let positiveConfidence = Math.abs(number.toFixed(2));
    if (positiveConfidence > 1) {
      positiveConfidence = 1;
    }
    return positiveConfidence * 100;
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
        <div className="container tile is-ancestor is-fluid">
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
    const { filteredReviews } = this.props;
    return (
      <div className="container is-fluid">
        {this.props.business &&
          this.renderBusiness(this.props.business)
        }
        <div className="level">
          {filteredReviews &&
            <DotChart />
          }
        </div>
        <Review />
        <div className="level">
          <div className="level-item has-text-centered">
            <p className="title">Word Cloud</p>
          </div>
        </div>
        {/* <div>
          {this.renderWordCloud(weights, datasetWeights)}
        </div> */}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    weights: state.weights,
    business: state.business,
    datasetWeightsLoaded: state.datasetWeightsLoaded,
    filteredReviews: state.filteredReviews
  };
};

export default connect(mapStateToProps, null)(Results);

