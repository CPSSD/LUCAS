import React from 'react';
import { connect } from 'react-redux';
import { forEach } from 'lodash';
import cx from 'classnames';
import PlacesAutocomplete from 'react-places-autocomplete';

import { toggleSearchReview, setReviews, toggleSingleReview, setBusiness, setDatasetReviewWeights, datasetWeightsLoaded, setFilteredReviews } from '../actions/index';

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
    forEach(this.state.yelpSearchResults, (business, index) => {
      businesses.push(
        <div key={`business-${index}`} className="card mb10" onClick={() => this.getReviewsFromDB(business)}>
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
    return (
      <div className="container is-fluid">
        <div className="field has-addons pb20">
          <div className="control width-100">
            <input className="input" type="text" placeholder="Search Yelp or paste a Yelp link" value={this.state.yelpSearchTerm} onChange={(evt) => this.updateInputValue(evt)} onKeyPress={(event) => this.handleKeyPress(event)} />
          </div>
          <div className="pr5 pl5 is-vertical-center">Near</div>
          {this.place()}
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

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSearchReview: (value) => dispatch(toggleSearchReview(value)),
    toggleSingleReview: (value) => dispatch(toggleSingleReview(value)),
    datasetWeightsLoaded: (value) => dispatch(datasetWeightsLoaded(value)),
    setReviews: (reviews) => dispatch(setReviews(reviews)),
    setDatasetReviewWeights: (weights) => dispatch(setDatasetReviewWeights(weights)),
    setBusiness: (business) => dispatch(setBusiness(business)),
    setFilteredReviews: (reviews, filtered) => dispatch(setFilteredReviews(reviews, filtered)),
  };
};

export default connect(null, mapDispatchToProps)(Search);
