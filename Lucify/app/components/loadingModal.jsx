/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import ReactLoading from 'react-loading';

import { resultsLoading } from '../actions/index';

class Loading extends React.Component {
  render() {
    const modalClasses = cx({
      "modal": true,
      "is-active": this.props.resultsLoading,
    });

    return (
      <div className={modalClasses}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <section className="modal-card-body loading-body tile is-ancestor">
            <div className="tile is-parent is-vertical is-vertical-center">
              <ReactLoading type="spin" className="loading tile is-child" height={128} width={128}/>
              <div className="tile is-child title">Fetching results...</div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    resultsLoading: state.resultsLoading
  };
};

export default connect(mapStateToProps, null)(Loading);
