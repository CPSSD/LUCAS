import { TOGGLE_REVIEW, TOGGLE_SEARCH_REVIEW, TOGGLE_MODAL, SET_WEIGHTS, SET_BUSINESS } from '../constants/action-types';

const initialState = {
  toggleReview: false,
  toggleSearchReview: false,
  toggleModal: false,
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_REVIEW:
      return { ...state, toggleReview: action.payload };
    case TOGGLE_SEARCH_REVIEW:
      return { ...state, toggleSearchReview: action.payload };
    case TOGGLE_MODAL:
      return { ...state, toggleModal: !state.toggleModal };
    default:
      return state;
    case SET_WEIGHTS:
      return { ...state, weights: action.payload };
    case SET_BUSINESS:
      return { ...state, business: action.payload };
  }
};
export default rootReducer;
