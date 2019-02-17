import React from 'react';
import { connect } from 'react-redux';
import { forEach, chunk } from 'lodash';
import cx from 'classnames';
import PlacesAutocomplete from 'react-places-autocomplete';
import Rating from 'react-rating';

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
    const array = [
      {
        "_id": "5c0bd3a334439e9b8c4e14a5",	
        "user_id": "QKYH1FUlRRVD-qXfUxS13A",	
        "stars": 1,
        "date": "2017-01-30",
        "text": "GEICO for auto is great! But they are really really bad for home insurance through Homesite, would never ever recommend them. One small claim drove my price from $850 a year to almost $2000 a year. I feel like I was never insured and their payout was just like a bank loan that I am paying back. also just an FYI and to be fair to agents of geico I got my policy through phone call directly with geico not any particular street location agent."
      },
      {
        "_id": "5c0bd44434439e9b8c7a15e8",
        "user_id": "54aYSgDy5bVobEyWbbyE_g",
        "stars": 1,
        "date": "2018-06-28",
        "text": "So disappointed in this greedy company. They raised our auto rates 8.9% in January. When I called to ask why, I was told that it had nothing to do with our driving records (which are perfect) but it was due to them \"re-evaluating\" premiums of all Arizona drivers.  Today I get an e-mail that says our rates are going up ANOTHER 8.9.% in August. I call them and get the exact same answer. \"Oh, it's not you, it's the other drivers.\"  Well, then why am I THE ONE PAYING HIGHER RATES?\"   So, I'm off to get quotes from the dozens of other insurance companies that are competing for our multi-line policies."
      },
      {
        "_id": "5c0bd44c34439e9b8c7bceec",
        "user_id": "nwDS6tgA4_HZ7mtyxzX1Ug",
        "stars": 1,
        "date": "2018-06-28",
        "text": "Held my family hostage for over two years as a accident could not be settled. Increased our rates for those 24 months to absurd levels due to increased \"risk\". Will not return under any circumstances."
      },
      {
        "_id": "5c0bd44c34439e9b8c7c066b",
        "user_id": "KeUFQ3T8tCZatAezFf-zsw",
        "stars": 1,
        "date": "2017-12-11",
        "text": "This review has nothing to do with the location in Arizona.\n\nGot insurance quote over the phone as the on-line system would not accept more than one car. The selling agent was finally able to provide a written quote. I provided DLs as requested. I called back the next day to purchase the policy. Even with the reference number they had they hard finding the quote. The amount they wanted me to pay was $300 dollars more than the written quote I had. They were unwilling to address the difference until I pushed the issue. They said it was a compute \"glitch\". I purchase insurance from someone else. Use caution when dealing with this company."
      },
      {
        "_id": "5c0bd44d34439e9b8c7c5b2f",
        "user_id": "5lnLq6koTB0WmfJSwsugcA",
        "stars": 1,
        "date": "2017-03-10",
        "text": "Geico advertises \"Piece of Mind\" when you insure with them.  We have our home and cars insured with them.  However, they have sent me 2 notices of cancellation of my homeowners policy for nonpayment. The first notice I immediately got on the phone to clear up the problem,  I was told by a very nice man that it was a mistake and that indeed our insurance was paid in full for the year and they were very sorry this happened.  OK, I can accept that,\n\nYesterday, about three weeks after receiving the first notice,  I get a pink envelope in the mail saying I only have a few days before the insurance on my home is cancelled and I must submit the full payment immediately.  Back to the phone to call and see why I am getting a second notice of nonpayment.  I very nice lady helped me, again assured me that it was a mistake and our policy was current and paid in full.  At my request, she did email me a statement showing the policy is current and was paid in full for the year, 10 days before the due date more than a month earlier.  \nThere is no \"piece of mind\" when you are continually being told the insurance on your home is being cancelled.  It causes stress,  not tranquility!  After this experience and then reading other reviews on Yelp about his company's home owners insurance, I am getting busy to replace them."
      },
      {
        "_id": "5c0bd563a763851657008e22",
        "user_id": "QKYH1FUlRRVD-qXfUxS13A",
        "stars": 1,
        "date": "2017-01-30",
        "text": "GEICO for auto is great! But they are really really bad for home insurance through Homesite, would never ever recommend them. One small claim drove my price from $850 a year to almost $2000 a year. I feel like I was never insured and their payout was just like a bank loan that I am paying back. also just an FYI and to be fair to agents of geico I got my policy through phone call directly with geico not any particular street location agent."
      },
      {
        "_id": "5c0bd5d7a7638516572c8f5e",
        "user_id": "54aYSgDy5bVobEyWbbyE_g",
        "stars": 1,
        "date": "2018-06-28",
        "text": "So disappointed in this greedy company. They raised our auto rates 8.9% in January. When I called to ask why, I was told that it had nothing to do with our driving records (which are perfect) but it was due to them \"re-evaluating\" premiums of all Arizona drivers.  Today I get an e-mail that says our rates are going up ANOTHER 8.9.% in August. I call them and get the exact same answer. \"Oh, it's not you, it's the other drivers.\"  Well, then why am I THE ONE PAYING HIGHER RATES?\"   So, I'm off to get quotes from the dozens of other insurance companies that are competing for our multi-line policies."
      },
      {
        "_id": "5c0bd5dba7638516572e4864",
        "user_id": "nwDS6tgA4_HZ7mtyxzX1Ug",
        "stars": 1,
        "date": "2018-06-28",
        "text": "Held my family hostage for over two years as a accident could not be settled. Increased our rates for those 24 months to absurd levels due to increased \"risk\". Will not return under any circumstances."
      },
      {
        "_id": "5c0bd5dba7638516572e7fe7",
        "user_id": "KeUFQ3T8tCZatAezFf-zsw",
        "stars": 1,
        "date": "2017-12-11",
        "text": "This review has nothing to do with the location in Arizona.\n\nGot insurance quote over the phone as the on-line system would not accept more than one car. The selling agent was finally able to provide a written quote. I provided DLs as requested. I called back the next day to purchase the policy. Even with the reference number they had they hard finding the quote. The amount they wanted me to pay was $300 dollars more than the written quote I had. They were unwilling to address the difference until I pushed the issue. They said it was a compute \"glitch\". I purchase insurance from someone else. Use caution when dealing with this company."
      },
      {
        "_id": "5c0bd5dca7638516572ed4ad",
        "user_id": "5lnLq6koTB0WmfJSwsugcA",
        "stars": 1,
        "date": "2017-03-10",
        "text": "Geico advertises \"Piece of Mind\" when you insure with them.  We have our home and cars insured with them.  However, they have sent me 2 notices of cancellation of my homeowners policy for nonpayment. The first notice I immediately got on the phone to clear up the problem,  I was told by a very nice man that it was a mistake and that indeed our insurance was paid in full for the year and they were very sorry this happened.  OK, I can accept that,\n\nYesterday, about three weeks after receiving the first notice,  I get a pink envelope in the mail saying I only have a few days before the insurance on my home is cancelled and I must submit the full payment immediately.  Back to the phone to call and see why I am getting a second notice of nonpayment.  I very nice lady helped me, again assured me that it was a mistake and our policy was current and paid in full.  At my request, she did email me a statement showing the policy is current and was paid in full for the year, 10 days before the due date more than a month earlier.  \nThere is no \"piece of mind\" when you are continually being told the insurance on your home is being cancelled.  It causes stress,  not tranquility!  After this experience and then reading other reviews on Yelp about his company's home owners insurance, I am getting busy to replace them."
      },
      {
        "_id": "5c0bd5eca76385165733e8fa",
        "user_id": "ZoPuRzKseZY39lkVoK_J5g",
        "stars": 1,
        "date": "2015-08-18",
        "text": "Geico is my insurance and I had a wreck. I took my car to their recommended facility for repairs. It became obvious that they were working together for short cuts. They did a 2 wheel alignment on a car that requires a 4 wheel alignment because that is all that Geico would cover. My car had to return to the shop not once or twice but 4 times due to faulty repair work. At one point, a piece of my car fell off when we were driving home."
      },
      {
        "_id": "5c0bd61aa763851657453c27",
        "user_id": "q1aKikqKRs3RBaHuvXd6CA",
        "stars": 1,
        "date": "2018-05-20",
        "text": "I am very happy to report that i am no longer with Geico. i switched to Root insurance and am saving $59 a month. Root bases your rates on your driving not on the people who cause the accidents like Geico does. They are so dishonest that they unbeknownst to me were reporting to other insurance companies that the two not at fault accidents that i was involved in were my fault so i would get high quotes and couldnt leave but continued to lie to me that it shows not my fault. They subrogated both accidents and were reimbursed in full yet everytime i came up for renewal afterwards they raised my rates $15.00 per month the first time i got hit and $20.00 per month after the second accident in which i was rearended by an unlicensed driver who fortunately did have collision coverage with A All ins. SWITCH TO ROOT, YOU WILL BE THRILLED WITH THEIR RATES!"
      },	
      {
        "_id": "5c0bd652a76385165758ec43",	
        "user_id": "SkeqMYpoLPJZ2_gqkpKN7Q",	
        "stars": 5,	
        "date": "2017-08-16",	
        "text": "I got rear ended on Saturday.  No one was hurt and we were not traveling fast so the damage was not extensive.   I tapped the car in front of me slightly as well.  The young woman who hit me was very apologetic and accepted responsibility.  She also had Geico insurance.  The collision was at 11 AM and by 3 PM I had been contacted by someone from Geico.  They had an appointment set up for my car at Bill Luke on Monday.   When I took it in they were ready to go and were so helpful, courteous and FAST! I am so impressed and it is Wednesday and I have my car back.  All the work was done within 48 hours!  I have never had that seamless and easy work done on my car.  They also kept me posted on the status of the work throughout the short time it was there.  I just picked it up and my mind is still blown at how quickly Geico acted and facilitated the repairs.  Thank you."	
      }
    ];
    // fetch('/api/dataset/getReviews', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     business_id: id,
    //   })
    // })
    //   .then((res) => res.json())
    //   .then((response) => {
    //     this.props.setReviews(response);
    //     this.getDatasetReviewWeights(response);
    //   });
    this.props.setReviews(array);
    this.getDatasetReviewWeights(array);
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
    return (
      <div className="container is-fluid box">
        <div className="field has-addons pb20">
          <div className="control width-100">
            <input className="input" type="text" placeholder="Search Yelp or paste a Yelp link" value={this.state.yelpSearchTerm} onChange={(evt) => this.updateInputValue(evt)} onKeyPress={(event) => this.handleKeyPress(event)} />
          </div>
          <div className="pr5 pl5 is-vertical-center">Near</div>
          {this.place()}
          <div className="control">
            <button className="button is-primary" onClick={() => this.searchYelp()}>
              <i className="fas fa-search mr5"></i>
              Search
            </button>
          </div>
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
