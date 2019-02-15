import {
  TOGGLE_REVIEW,
  TOGGLE_SINGLE_REVIEW,
  TOGGLE_SEARCH_REVIEW,
  TOGGLE_MODAL, SET_WEIGHTS,
  SET_BUSINESS,
  SET_REVIEW_WEIGHTS,
  DATASET_WEIGHTS_LOADED,
  SET_FILTERED_REIEWS,
  RESET_FILTERED_REVIEWS,
  UPDATE_FILTERED_REVIEWS,
} from '../constants/action-types';

const initialState = {
  toggleReview: false,
  toggleSingleReview: false,
  toggleSearchReview: false,
  datasetWeightsLoaded: false,
  toggleModal: false,
  reviewsFiltered: false,
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_REVIEW:
      return { ...state, toggleReview: action.payload };
    case TOGGLE_SINGLE_REVIEW:
      return { ...state, toggleSingleReview: action.payload };
    case TOGGLE_SEARCH_REVIEW:
      return { ...state, toggleSearchReview: action.payload };
    case DATASET_WEIGHTS_LOADED:
      return { ...state, datasetWeightsLoaded: action.payload };
    case TOGGLE_MODAL:
      return { ...state, toggleModal: !state.toggleModal };
    default:
      return state;
    case SET_WEIGHTS:
      return { ...state, weights: action.payload };
    case SET_REVIEW_WEIGHTS:
      return { ...state, datasetWeights: action.payload };
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
