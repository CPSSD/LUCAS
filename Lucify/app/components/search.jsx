import React from 'react';
import { connect } from 'react-redux';
import { forEach } from 'lodash';

import { toggleSearchReview, setReviewWeights, setBusiness } from '../actions/index';

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

  getBusinessReviews(business) {
    fetch('/api/yelp/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alias: business.alias
      })
    })
      .then((res) => res.json())
      .then((response) => {
        this.props.setBusiness(business);
        this.getReviewWeight(response);
      });
  }
  displayResults() {
    const businesses = [];
    forEach(this.state.yelpSearchResults, (business, index) => {
      businesses.push(
        <div key={`business-${index}`} className="box tile" onClick={() => this.getBusinessReviews(business)}>
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
      );
    });

    return businesses;
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
      const urlPattern = /(?<=biz\/)(.*?)(?=\?)/;
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
  render() {
    return (
      <div>
        <h1 className="pb10 pt10"> Or Paste Yelp Link</h1>
        <div className="field has-addons pb20">
          <div className="control width-100">
            <input className="input" type="text" placeholder="Search Yelp" value={this.state.yelpSearchTerm} onChange={(evt) => this.updateInputValue(evt)} />
          </div>
          <div className="control">
            <button className="button is-primary" onClick={() => this.searchYelp()}>
              Search
            </button>
          </div>
        </div>
        <div className="tile is-ancestor is-vertical">
          { this.state.showSearchResults && this.displayResults() }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { showResults: state.toggleReview };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSearchReview: (value) => dispatch(toggleSearchReview(value)),
    setReviewWeights: (weights) => dispatch(setReviewWeights(weights)),
    setBusiness: (business) => dispatch(setBusiness(business))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
