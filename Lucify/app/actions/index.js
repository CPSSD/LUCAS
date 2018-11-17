import { TOGGLE_REVIEW, TOGGLE_SEARCH_REVIEW, TOGGLE_MODAL, SET_WEIGHTS, SET_BUSINESS } from '../constants/action-types';

export const toggleReview = (value) => ({ type: TOGGLE_REVIEW, payload: value });
export const toggleSearchReview = (value) => ({ type: TOGGLE_SEARCH_REVIEW, payload: value });
export const toggleModal = () => ({ type: TOGGLE_MODAL, payload: {} });
export const setReviewWeights = (weights) => ({ type: SET_WEIGHTS, payload: weights });
export const setBusiness = (business) => ({ type: SET_BUSINESS, payload: business })