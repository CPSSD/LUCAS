import React from 'react';
import { connect } from 'react-redux';
import { forEach, groupBy } from 'lodash';

import { toggleSearchReview, setReviewWeights, toggleSingleReview, setBusiness, setDatasetReviewWeights, datasetWeightsLoaded, setFilteredReviews } from '../actions/index';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yelpSearchTerm: '',
    };
  }

  getReviewWeight(reviews) {
    fetch('/api/review/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reviews
      })
    })
      .then((res) => res.json())
      .then((response) => {
        this.props.setReviewWeights(response);
        this.props.toggleSearchReview(true);
      });
  }

  getDatasetReviewWeights(reviews) {
    fetch('/api/review/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reviews
      })
    })
      .then((res) => res.json())
      .then((response) => {
        this.props.setDatasetReviewWeights(response);
        this.props.setFilteredReviews(response, false);
        this.props.datasetWeightsLoaded(true);
      });
  }

  getReviewsFromGoogle(response) {
    const placeId = JSON.parse(response).candidates[0].place_id;
    fetch('/api/places/details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        placeId
      })
    })
      .then((res) => res.json())
      .then((reviewRes) => {
        const { reviews } = JSON.parse(reviewRes).result;
        this.getReviewWeight(reviews);
      });
  }

  getReviewsFromDataset(business_id) {
    fetch('/api/dataset/getReviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_id,
      })
    })
      .then((res) => res.json())
      .then((response) => {
        this.getDatasetReviewWeights(response);
      });
  }

  getRandomBusiness(categories) {
    fetch('/api/dataset/getBusiness', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categories,
      })
    })
      .then((res) => res.json())
      .then((response) => {
        this.getReviewsFromDataset(response.business_id);
      });
  }

  getReviewsFromDB(business_id,categories) {
    const query = [];
    forEach(categories, (category) => {
      query.push(category.title);
    });
    fetch('/api/dataset/getBusiness', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_id,
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (!response) {
          this.getRandomBusiness(query.join());
        } else {
          this.getReviewsFromDataset(response.business_id);
        }
      });
  }

  getBusinessReviews(business) {
    this.getReviewsFromDB(business.id, business.categories);
    fetch('/api/places/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: [business.name, business.location.display_address].join()
      })
    })
      .then((res) => res.json())
      .then((response) => {
        this.props.setBusiness(business);
        this.getReviewsFromGoogle(response);
      });
  }

  searchYelp() {
    const pattern = /^(https:\/\/www.yelp.(com|ie))/;
    if (!pattern.test(this.state.yelpSearchTerm)) {
      fetch('/api/yelp/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          term: this.state.yelpSearchTerm
        })
      })
        .then((res) => res.json())
        .then((response) => {
          this.setState({ yelpSearchResults: response, showSearchResults: true });
        });
    } else {
      const urlPattern = /(?<=biz\/)(.*?)(?=(\?|$))/;
      const alias = urlPattern.exec(this.state.yelpSearchTerm);
      fetch('/api/yelp/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alias: alias[0]
        })
      })
        .then((res) => res.json())
        .then((response) => {
          this.getBusinessReviews(response);
        });
    }
  }
  

  updateInputValue(evt) {
    this.setState({
      yelpSearchTerm: evt.target.value
    });
  }

  displaySearchResults() {
    const businesses = [];
    forEach(this.state.yelpSearchResults, (business, index) => {
      businesses.push(
        <div key={`business-${index}`} className="card mb10" onClick={() => this.getBusinessReviews(business)}>
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
      );
    });

    return businesses;
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.searchYelp();
    }
  }

  render() {
    return (
      <div className="container is-fluid">
        <div className="field has-addons pb20">
          <div className="control width-100">
            <input className="input" type="text" placeholder="‘Search Yelp or enter a link to a Yelp business page" value={this.state.yelpSearchTerm} onChange={(evt) => this.updateInputValue(evt)} onKeyPress={(event) => this.handleKeyPress(event)} />
          </div>
          <div className="control">
            <button className="button is-primary" onClick={() => this.searchYelp()}>
              Search
            </button>
          </div>
        </div>
        <div>
          <a role="button" onClick={() => this.props.toggleSingleReview(!this.props.showSingleReview)} className="pb10 single-review-button">or submit your own review</a>
        </div>
        <div className="mt30">
          { this.state.showSearchResults && this.displaySearchResults() }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showResults: state.toggleReview,
    showSingleReview: state.toggleSingleReview
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSearchReview: (value) => dispatch(toggleSearchReview(value)),
    toggleSingleReview: (value) => dispatch(toggleSingleReview(value)),
    datasetWeightsLoaded: (value) => dispatch(datasetWeightsLoaded(value)),
    setReviewWeights: (weights) => dispatch(setReviewWeights(weights)),
    setDatasetReviewWeights: (weights) => dispatch(setDatasetReviewWeights(weights)),
    setBusiness: (business) => dispatch(setBusiness(business)),
    setFilteredReviews: (reviews, filtered) => dispatch(setFilteredReviews(reviews, filtered)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
