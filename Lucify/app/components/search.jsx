import React from 'react';
import { connect } from 'react-redux';
import { forEach, chunk } from 'lodash';
import cx from 'classnames';
import PlacesAutocomplete from 'react-places-autocomplete';
import Rating from 'react-rating';

import { toggleSearchReview, setReviews, toggleSingleReview, setBusiness, setDatasetReviewWeights, datasetWeightsLoaded, setFilteredReviews, resultsLoading, setUserData } from '../actions/index';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yelpSearchTerm: '',
      address: '',
    };
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
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
        this.props.toggleSearchReview(true);
        this.props.datasetWeightsLoaded(true);
      });
  }

  getUserData(reviews) {
    const userIds = reviews.map((review) => review.user_id);
    fetch('/api/dataset/getUserData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userIds,
      })
    })
      .then((res) => res.json())
      .then((response) => {
        this.props.setUserData(response);
      });
  }

  getReviewsFromDataset(id) {
    fetch('/api/dataset/getReviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_id: id,
      })
    })
      .then((res) => res.json())
      .then((response) => {
        this.getUserData(response);
        this.props.setReviews(response);
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

  getReviewsFromDB(business) {
    this.props.resultsLoading();
    const { id, categories } = business;
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
        business_id: id,
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (!response) {
          this.props.setBusiness(business);
          this.getRandomBusiness(query.join());
        } else {
          this.props.setBusiness(business);
          this.getReviewsFromDataset(response.business_id);
        }
      });
  }

  handleClick = (e) => {
    this.dropdownClasses = cx({
      'dropdown-menu': true,
      'activate-dropdown': this.node.contains(e.target),
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
          term: this.state.yelpSearchTerm,
          location: this.state.address,
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
          this.getReviewsFromDB(response);
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
    const chunkedResults = chunk(this.state.yelpSearchResults, 3);
    forEach(chunkedResults, (chunk, index) => {
      businesses.push(
        <div key={`chunk-${index}`} className="columns">
          {chunk.map((business) => {
            return (
              <div key={`business-${business.name}`} className="card mb10 column mr10 ml10" onClick={() => this.getReviewsFromDB(business)}>
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={business.image_url} />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <div className="business-name">
                        <a href={business.url} target="_blank" rel="noopener noreferrer" className="title is-4 mr10">{business.name}</a>
                        <div className="has-text-success is-size-4">{business.price}</div>
                      </div>
                      <Rating
                        initialRating={business.rating}
                        emptySymbol="far fa-star"
                        fullSymbol="fas fa-star"
                        fractions={2}
                        readonly
                      />
                      <div>
                        <div>{business.location.address1}</div>
                        <div>{business.location.display_address[1]}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    });

    return (
      <div className="has-background-link pt20 pl20 pr20">
        <div className="level">
          <div className="level-left">
            <div className="level-item has-text-centered pt20">
              <p className="title">Search Results</p>
            </div>
          </div>
        </div>
        <div className="has-text-black">
          <div className="pt20">{businesses}</div>
        </div>
      </div>
    );
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.searchYelp();
    }
  }

  handleChange = (address) => {
    this.dropdownClasses = cx({
      'dropdown-menu': true,
      'activate-dropdown': address ? true : false,
    });
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.dropdownClasses = cx({
      'dropdown-menu': true,
      'activate-dropdown': false,
    });
    this.setState({ address });
  };

  place() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        googleCallbackName="googleApi"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="dropdown pr10">
            <div className="dropdown-trigger">
              <input
                ref={(node) => { this.node = node; }}
                aria-controls="dropdown-menu"
                onKeyPress={(event) => this.handleKeyPress(event)}
                {...getInputProps({
                  placeholder: 'Location',
                  className: 'input',
                })}
              />
            </div>
            <div className={`${this.dropdownClasses}`} id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? 'dropdown-item is-active'
                    : 'dropdown-item';

                  return (
                    <a
                      {...getSuggestionItemProps((suggestion), {
                        className,
                      })}
                    >
                      {suggestion.description}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }

  render() {
    return ([
      <div className="box search-box" key="search">
        <div className="field has-addons pr20 pl20">
          <div className="control width-100">
            <input className="input" type="text" placeholder="Search Yelp or paste a Yelp link" value={this.state.yelpSearchTerm} onChange={(evt) => this.updateInputValue(evt)} onKeyPress={(event) => this.handleKeyPress(event)} />
          </div>
          <div className="pr5 pl5 is-vertical-center">Near</div>
          {this.place()}
        </div>
        <div className="control">
          <button className="button is-primary is-fullwidth" onClick={() => this.searchYelp()}>
            Search/Analyze
            <i className="fas fa-search ml10"></i>
          </button>
        </div>
      </div>,
      <div key="results">
        {this.state.showSearchResults && this.displaySearchResults()}
      </div>
    ]);
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSearchReview: (value) => dispatch(toggleSearchReview(value)),
    toggleSingleReview: (value) => dispatch(toggleSingleReview(value)),
    datasetWeightsLoaded: (value) => dispatch(datasetWeightsLoaded(value)),
    setReviews: (reviews) => dispatch(setReviews(reviews)),
    setDatasetReviewWeights: (weights) => dispatch(setDatasetReviewWeights(weights)),
    setBusiness: (business) => dispatch(setBusiness(business)),
    setFilteredReviews: (reviews, filtered) => dispatch(setFilteredReviews(reviews, filtered)),
    resultsLoading: () => dispatch(resultsLoading()),
    setUserData: (data) => dispatch(setUserData(data)),
  };
};

export default connect(null, mapDispatchToProps)(Search);
