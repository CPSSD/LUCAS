import {
  TOGGLE_REVIEW,
  TOGGLE_SINGLE_REVIEW,
  TOGGLE_MODAL,
  SET_REVIEWS,
  SET_BUSINESS,
  SET_REVIEW_WEIGHTS,
  SET_FILTERED_REIEWS,
  RESET_FILTERED_REVIEWS,
  UPDATE_FILTERED_REVIEWS,
  LOADING,
  SET_USER_DATA
} from '../constants/action-types';

const initialState = {
  toggleReview: false,
  toggleSingleReview: false,
  toggleSearchReview: false,
  datasetWeightsLoaded: false,
  toggleModal: false,
  resultsLoading: false,
  reviewsFiltered: false,
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_REVIEW:
      return { ...state, toggleReview: action.payload };
    case TOGGLE_SINGLE_REVIEW:
      return { ...state, toggleSingleReview: action.payload };
    case TOGGLE_MODAL:
      return { ...state, toggleModal: !state.toggleModal };
    case LOADING:
      return { ...state, resultsLoading: !state.resultsLoading };
    default:
      return state;
    case SET_REVIEWS:
      return { ...state, reviews: action.payload };
    case SET_USER_DATA:
      return { ...state, userData: action.payload };
    case SET_REVIEW_WEIGHTS:
      return { ...state, datasetWeights: action.payload, datasetWeightsLoaded: true };
    case SET_FILTERED_REIEWS:
      return { ...state, filteredReviews: action.payload.reviews, reviewsFiltered: action.payload.filtered };
    case RESET_FILTERED_REVIEWS:
      return { ...state, filteredReviews: state.datasetWeights, reviewsFiltered: false };
    case UPDATE_FILTERED_REVIEWS:
      return { ...state, filteredReviews: [...state.filteredReviews, action.payload] };
    case SET_BUSINESS:
      return { ...state, business: action.payload };
  }
};
export default rootReducer;
