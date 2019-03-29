/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import ReactDom from 'react-dom';
import cx from 'classnames';
import Highcharts from 'highcharts';
import HCWordCloud from 'highcharts/modules/wordcloud';
import HighchartsReact from 'highcharts-react-official';
import { connect } from 'react-redux';
import { union, pickBy, map } from 'lodash';

HCWordCloud(Highcharts);

const colours = ['#8b0000', '#ac0002', '#cf0002', '#f30001', '#ff4300', '#ff6e00', '#ff9000', '#ffae2c', '#ffc96e', '#ffe4a7', '#000000', '#00e500', '#00d600', '#00c700', '#00b800', '#00aa00', '#009b00', '#008d00', '#007f00', '#007200', '#006400'];


class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.chartComponent = React.createRef();
    this.state = {
      showModal: false,
    };
  }

  componentDidMount() {
    const container = this.chartComponent.current.container.current;
    container.style.height = '100%';
    container.style.width = '100%';
    this.chartComponent.current.chart.reflow();
  }

  calculateAccuracy(confidence) {
    const number = parseFloat(confidence);
    let positiveConfidence = number.toFixed(2);
    if (positiveConfidence > 1) {
      positiveConfidence = 1;
    } else if(positiveConfidence < -1) {
      positiveConfidence = -1;
    }
    return Math.round(positiveConfidence * 100);
  }

  getColor(weight) {
    const fixedConfidence = weight ? weight.toFixed(2) : 0;
    if (fixedConfidence <= -1) {
      return colours[0];
    } else if (fixedConfidence <= -0.9) {
      return colours[1];
    } else if (fixedConfidence <= -0.8) {
      return colours[2];
    } else if (fixedConfidence <= -0.7) {
      return colours[3];
    } else if (fixedConfidence <= -0.6) {
      return colours[4];
    } else if (fixedConfidence <= -0.5) {
      return colours[5];
    } else if (fixedConfidence <= -0.4) {
      return colours[6];
    } else if (fixedConfidence <= -0.3) {
      return colours[7];
    } else if (fixedConfidence <= -0.2) {
      return colours[8];
    } else if (fixedConfidence <= -0.1) {
      return colours[9];
    } else if (fixedConfidence < 0.1) {
      return colours[10];
    } else if (fixedConfidence < 0.2) {
      return colours[11];
    } else if (fixedConfidence < 0.3) {
      return colours[12];
    } else if (fixedConfidence < 0.4) {
      return colours[13];
    } else if (fixedConfidence < 0.5) {
      return colours[14];
    } else if (fixedConfidence < 0.6) {
      return colours[15];
    } else if (fixedConfidence < 0.7) {
      return colours[16];
    } else if (fixedConfidence < 0.8) {
      return colours[17];
    } else if (fixedConfidence < 0.9) {
      return colours[18];
    } else if (fixedConfidence < 1) {
      return colours[19];
    } else if (fixedConfidence >= 1) {
      return colours[20];
    }
  }

  getOptions() {
    const { filteredReviews } = this.props;
    const featureWeights = map(filteredReviews, 'feature_weights');
    const mergedFeatureWeights = Object.assign(...union(featureWeights));
    const filteredFeatureWeights = pickBy(mergedFeatureWeights, (val) => {
      return val !== 0;
    });
    const data = [];
    for (let key in filteredFeatureWeights) {
      const currentVal = Math.abs(this.calculateAccuracy(filteredFeatureWeights[key]));
      const weighting = filteredFeatureWeights[key] < 0 ? 'Negative' : 'Positive';
      data.push({ name: key, weight: currentVal, color: this.getColor(filteredFeatureWeights[key]), weighting  });
    }
    const options = {
      chart: {
        type: 'wordcloud',
      },
      series: [{
        data,
        rotation: {
          from: 0,
          orientations: 1,
          to: 0,
        },
      }],
      title: {
        text: undefined,
      },
      legend: {
        enabled: false
      },
      tooltip: {
        useHTML: true,
        formatter: this.formatTooltip,
      },
    };

    return options;
  }

  formatTooltip() {
    return `<div class='dotchart-tooltip'>
              <h1 class="title is-6 has-text-black">${this.point.name}</h1>
              <br>
              <h1 class="title is-6 has-text-black">${this.point.weighting}</h1>
              <span style="color:${this.point.color}">●</span> Weight: <b>${this.point.weight}%</b><br/>
            </div>`;
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  renderModal() {
    const modalClasses = cx({
      modal: true,
      'is-active': this.state.showModal,
    });
    return (
      ReactDom.createPortal(
        <div className={modalClasses}>
          <div className="modal-background" onClick={() => { this.toggleModal(); }}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">What is this?</p>
            </header>
            <section className="modal-card-body">
              <div className="content has-text-black">
                <h2 className="is-bold">Word Cloud</h2>
                <p>
                  The Word Cloud is a supplemental data visualization that visiualises how different words affect the review and our confidence in it.
                  The Word Cloud will update based on the applied filters on the 2 main data visualizations and will show a breakdown of the most impactful words across the reviews.
                </p>
              </div>
            </section>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => { this.toggleModal(); }}></button>
        </div>, document.body
      )
    );
  }

  render() {
    return (
      <div className="has-background-link mb20 pb40">
        <div className="level pt20 pl20 pr20">
          <div className="level-left">
            <p className="title has-text-white">WordCloud</p>
          </div>
          <div className="level-right">
            <span onClick={() => this.toggleModal()}><i className="far fa-question-circle is-pulled-right fa-2x has-text-white ml10"></i></span>dded Section tooltips
          </div>
        </div>
        <div className="pl20 pr20">
          {this.props.filteredReviews ?
            <HighchartsReact
              highcharts={Highcharts}
              ref={this.chartComponent}
              options={this.getOptions()}
            />
            :
            null
          }
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    filteredReviews: state.filteredReviews,
    datasetWeights: state.datasetWeights,
    reviewsFiltered: state.reviewsFiltered
  };
};


export default connect(mapStateToProps, null)(WordCloud);
