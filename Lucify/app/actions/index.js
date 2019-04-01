import {
  TOGGLE_REVIEW,
  TOGGLE_SINGLE_REVIEW,
  TOGGLE_SEARCH_REVIEW,
  TOGGLE_MODAL,
  SET_REVIEWS,
  SET_BUSINESS,
  SET_REVIEW_WEIGHTS,
  DATASET_WEIGHTS_LOADED,
  SET_FILTERED_REIEWS,
  RESET_FILTERED_REVIEWS,
  UPDATE_FILTERED_REVIEWS,
  LOADING,
  SET_USER_DATA
} from '../constants/action-types';

export const toggleReview = (value) => ({ type: TOGGLE_REVIEW, payload: value });
export const toggleSingleReview = (value) => ({ type: TOGGLE_SINGLE_REVIEW, payload: value });
export const toggleSearchReview = (value) => ({ type: TOGGLE_SEARCH_REVIEW, payload: value });
export const toggleModal = () => ({ type: TOGGLE_MODAL, payload: {} });
export const setReviews = (reviews) => ({ type: SET_REVIEWS, payload: reviews });
export const setDatasetReviewWeights = (weights) => ({ type: SET_REVIEW_WEIGHTS, payload: weights });
export const setFilteredReviews = (reviews, filtered) => ({ type: SET_FILTERED_REIEWS, payload: { reviews, filtered } });
export const datasetWeightsLoaded = (value) => ({ type: DATASET_WEIGHTS_LOADED, payload: value });
export const setBusiness = (business) => ({ type: SET_BUSINESS, payload: business });
export const setUserData = (data) => ({ type: SET_USER_DATA, payload: data });
export const resetFilteredReviews = () => ({ type: RESET_FILTERED_REVIEWS });
export const updateFilteredReviews = (reviews) => ({ type: UPDATE_FILTERED_REVIEWS, payload: reviews });
export const resultsLoading = () => ({ type: LOADING });
