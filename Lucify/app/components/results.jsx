/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import Slider from 'react-slick';
import Rating from 'react-rating';
import { connect } from 'react-redux';
import DotChart from './dotChart';
import TrendChart from './trendChart';
import WordCloud from './wordCloud';
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
      <section className="has-background-link mb40 pl20 pr20">
        <div className="level">
          <div className="level-left">
            <div className="level-item has-text-centered pt20">
              <a href={business.url} target="_blank" rel="noopener noreferrer" className="title has-text-white">{business.name}</a>
            </div>
          </div>
        </div>
        <div className="container has-text-white tile is-ancestor is-fluid pb20">
          <div className="tile is-parent is-2">
            {this.renderCarousel(business)}
          </div>
          <div className="tile is-parent is-vertical is-10">
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
      <div className="is-12 box pb40 has-background-link">
        <div className="level">
          <div className="level-left">
            <p className="title has-text-white">Charts</p>
          </div>
          <div className="level-right">
            <i className="far fa-question-circle is-pulled-right fa-2x has-text-white"></i>
          </div>
        </div>
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
      <div className="container is-fluid mt20">
        {this.props.business &&
          this.renderBusiness(this.props.business)
        }
        {this.renderChartCarousel()}
        <Review />
        <WordCloud />
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

