/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { toggleModal } from '../actions/index';

class WhatIsModal extends React.Component {
  render() {
    const modalClasses = cx({
      "modal": true,
      "is-active": this.props.modalIsOpen,
    });

    return (
      <div className={modalClasses}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">What is this?</p>
            <button className="delete" onClick={() => this.props.toggleModal()}></button>
          </header>
          <section className="modal-card-body">
            <div className='content has-text-black'>
              <h2 className="is-bold">LUCAS</h2>
              <p>
                LUCAS is an API used to accurately determine if user-submitted content is falsified. 
                The primary use case is to detect opinion spam on websites that allow users to review products or services. 
                Using machine learning and deep learning techniques, we give a confidence score on whether or not we think a review is genuine.
                We can apply this to websites such as Amazon, TripAdvisor, Yelp, AirBnB, etc. and use it to create
                a more realistic, truthful measure of the quality of a product or service.
              </p>
              <h2>LUCIFY</h2>
              <p>
                To bring our API to the public, we have developed our flagship interface, Lucify. 
                This specialises on helping users assess falsified reviews on Yelp businesses. 
                This demonstrates our mission, which is to enable users to bypass the increasing online deception caused by opinion spam.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modalIsOpen: state.toggleModal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(toggleModal())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WhatIsModal);
