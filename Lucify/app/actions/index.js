import { TOGGLE_REVIEW, TOGGLE_MODAL } from '../constants/action-types';

export const toggleReview = (value) => ({ type: TOGGLE_REVIEW, payload: value });
export const toggleModal = () => ({ type: TOGGLE_MODAL, payload: {} });