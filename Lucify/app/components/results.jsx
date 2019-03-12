/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import Slider from 'react-slick';
import Rating from 'react-rating';
import { map, pickBy, union } from 'lodash';
import { connect } from 'react-redux';
import WordCloud from 'react-d3-cloud';
import DotChart from './dotChart';
import TrendChart from './trendChart';
import Review from './reviews';
import { resultsLoading } from '../actions/index';



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

class Results extends Component {

  componentDidMount() {
    this.props.resultsLoading();
  }

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
        <img className="is-background" src={photo} alt="" width="100" height="200" key={index} />
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
      <section className="section box mt20">
        <div className="container tile is-ancestor is-fluid">
          <div className="tile is-parent is-2">
            {this.renderCarousel(business)}
          </div>
          <div className="tile is-parent is-vertical is-10">
            <div className="tile is-child">
              <a href={business.url} target="_blank" rel="noopener noreferrer" className="title is-4">{business.name}</a>
            </div>
            <div className="level tile is-child columns">
              <div className="level-item has-text-centered column">
                <div>
                  <p className="heading">Rating</p>
                  <Rating
                    initialRating={business.rating}
                    emptySymbol="far fa-star"
                    fullSymbol="fas fa-star"
                    fractions={2}
                    readonly
                  />
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
 
  renderWordCloud(datasetWeights) {
    const featureWeights = map(datasetWeights, 'feature_weights');
    const mergedFeatureWeights = Object.assign(...union(featureWeights));
    const filteredFeatureWeights = pickBy(mergedFeatureWeights, (val) => {
      return val !== 0;
    });
    const data = [];
    for (let key in filteredFeatureWeights) {
      const currentVal = this.calculateAccuracy(filteredFeatureWeights[key]);
      data.push({ text: key, value: currentVal});
    }

    const fontSizeMapper = (word) => Math.log2(word.value) * 10;

    return (
      <WordCloud
        data={data}
        fontSizeMapper={fontSizeMapper}
      />
    );
  }


  renderChartCarousel() {
    const settings = {
      dots: true,
      draggable: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };

    return (
      <div className="tile is-child is-12 box pb40">
        <Slider {...settings}>
          <div className="level">
            <DotChart />
          </div>
          <div className="level">
            <TrendChart />
          </div>
        </Slider>
      </div>
    );
  }


  render() {
    return (
      <div className="container is-fluid box mt20 has-background-link">
        {this.props.business &&
          this.renderBusiness(this.props.business)
        }
        <div className="level">
          <div className="level-left">
            <div className="level-item has-text-centered pt20">
              <p className="title">Graphs</p>
            </div>
          </div>
        </div>
        {this.renderChartCarousel()}
        <Review />
        <div className="level pt40">
          <div className="level-left">
            <div className="level-item has-text-centered pt20">
              <p className="title">Word Cloud</p>
            </div>
          </div>
        </div>
        <div className="box">
          {/* {this.renderWordCloud(this.props.datasetWeights)} */}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resultsLoading: () => dispatch(resultsLoading()),
  };
};


const mapStateToProps = (state) => {
  return {
    datasetWeights: state.datasetWeights,
    business: state.business,
    datasetWeightsLoaded: state.datasetWeightsLoaded,
    filteredReviews: state.filteredReviews
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);

