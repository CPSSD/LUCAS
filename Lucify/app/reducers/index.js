import { TOGGLE_REVIEW, TOGGLE_MODAL } from '../constants/action-types';

const initialState = {
  toggleReview: false,
  toggleModal: false,
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_REVIEW:
      return { ...state, toggleReview: action.payload };
    case TOGGLE_MODAL:
      return { ...state, toggleModal: !state.toggleModal };
    default:
      return state;
  }
};
export default rootReducer;
