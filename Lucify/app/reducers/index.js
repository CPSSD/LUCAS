import { TOGGLE_REVIEW } from '../constants/action-types';

const initialState = {
  toggleReview: false
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_REVIEW:
      return { ...state, toggleReview: action.payload };
    default:
      return state;
  }
};
export default rootReducer;
