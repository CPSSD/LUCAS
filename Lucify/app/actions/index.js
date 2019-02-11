import { TOGGLE_REVIEW, TOGGLE_SINGLE_REVIEW, TOGGLE_SEARCH_REVIEW, TOGGLE_MODAL, SET_WEIGHTS, SET_BUSINESS, SET_REVIEW_WEIGHTS, DATASET_WEIGHTS_LOADED, SET_FILTERED_REIEWS } from '../constants/action-types';

export const toggleReview = (value) => ({ type: TOGGLE_REVIEW, payload: value });
export const toggleSingleReview = (value) => ({ type: TOGGLE_SINGLE_REVIEW, payload: value });
export const toggleSearchReview = (value) => ({ type: TOGGLE_SEARCH_REVIEW, payload: value });
export const toggleModal = () => ({ type: TOGGLE_MODAL, payload: {} });
export const setReviewWeights = (weights) => ({ type: SET_WEIGHTS, payload: weights });
export const setDatasetReviewWeights = (weights) => ({ type: SET_REVIEW_WEIGHTS, payload: weights });
export const setFilteredReviews = (reviews) => ({ type: SET_FILTERED_REIEWS, payload: reviews });
export const datasetWeightsLoaded = (value) => ({ type: DATASET_WEIGHTS_LOADED, payload: value });
export const setBusiness = (business) => ({ type: SET_BUSINESS, payload: business });
