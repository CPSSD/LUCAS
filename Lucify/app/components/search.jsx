import React from 'react';
import { connect } from 'react-redux';
import { forEach, chunk } from 'lodash';
import cx from 'classnames';
import PlacesAutocomplete from 'react-places-autocomplete';
import Rating from 'react-rating';
import Accordion from './accordion';

import { setReviews, toggleSingleReview, setBusiness, setDatasetReviewWeights, setFilteredReviews, resultsLoading, setUserData } from '../actions/index';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.model = 'svm';
    this.name = 'Select Model';
    this.state = {
      isActive: false,
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
        reviews,
        model: this.model,
      })
    })
      .then((res) => res.json())
      .then((response) => {
        const name = this.name === 'Select Model' ? 'SVM' : this.name;
        this.props.setFilteredReviews(response, false, name);
        this.props.setDatasetReviewWeights(response);
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
        const stats = response.map((stat) => stat['_source']);
        this.props.setUserData(stats);
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
        const result = response.map((res) => res['_source']);
        this.getUserData(result);
        this.props.setReviews(result);
        this.getDatasetReviewWeights(result);
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
        this.getReviewsFromDataset(response['_source'].business_id);
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
        const { hits, total } = response;
        if (total === 0) {
          this.props.setBusiness(business);
          this.getRandomBusiness(query.join());
        } else {
          this.props.setBusiness(business);
          this.getReviewsFromDataset(hits[0]['_source'].business_id);
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

  renderAdvancedTitle() {
    return (
      <span>Advanced Options <i className="fas fa-angle-right"></i></span>
    )
  }

  setModel(model, name) {
    this.model = model;
    this.name = name;
    this.setState({ isActive: !this.state.isActive });
  }

  toggleDropdown() {
    this.setState({ isActive: !this.state.isActive });
  }

  getClasses() {
    const classes = cx({
      dropdown: true,
      'is-active': this.state.isActive,
    });
    return classes;
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
        <Accordion className="accordion has-text-left pl20 mb10">
          <div data-header={this.renderAdvancedTitle()} className="mt10">
            <div className={this.getClasses()}>
              <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={() => this.toggleDropdown()}>
                  <span>{this.name}</span>
                  <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                  <div className="dropdown-item" onClick={() => this.setModel("nb", 'Naive Bayes')}>
                    Naive Bayes
                  </div>
                  <div className="dropdown-item" onClick={() => this.setModel("lr", 'Logistic Regression')}>
                    Logistic Regression
                  </div>
                  <div className="dropdown-item" onClick={() => this.setModel("svm", 'SVM')}>
                    SVM
                  </div>
                  <div className="dropdown-item" onClick={() => this.setModel("ffnn", 'FFNN')}>
                    FFNN
                  </div>
                  <div className="dropdown-item" onClick={() => this.setModel("cnn", 'CNN')}>
                    CNN
                  </div>
                  <div className="dropdown-item" onClick={() => this.setModel("lstm", 'LSTM')}>
                    LSTM
                  </div>
                  <div className="dropdown-item" onClick={() => this.setModel("bert", 'BERT')}>
                    BERT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Accordion>
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
    toggleSingleReview: (value) => dispatch(toggleSingleReview(value)),
    setReviews: (reviews) => dispatch(setReviews(reviews)),
    setDatasetReviewWeights: (weights) => dispatch(setDatasetReviewWeights(weights)),
    setBusiness: (business) => dispatch(setBusiness(business)),
    setFilteredReviews: (reviews, filtered, model) => dispatch(setFilteredReviews(reviews, filtered, model)),
    resultsLoading: () => dispatch(resultsLoading()),
    setUserData: (data) => dispatch(setUserData(data)),
  };
};

export default connect(null, mapDispatchToProps)(Search);
