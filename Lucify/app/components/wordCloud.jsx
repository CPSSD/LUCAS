/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HCWordCloud from 'highcharts/modules/wordcloud';
import HighchartsReact from 'highcharts-react-official';
import { connect } from 'react-redux';
import { union, pickBy, map } from 'lodash';

HCWordCloud(Highcharts);

const colours = ['#8b0000', '#ac0002', '#cf0002', '#f30001', '#ff4300', '#ff6e00', '#ff9000', '#ffae2c', '#ffc96e', '#ffe4a7', '#d3d3d3', '#00e500', '#00d600', '#00c700', '#00b800', '#00aa00', '#009b00', '#008d00', '#007f00', '#007200', '#006400'];


class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.chartComponent = React.createRef();
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
    return positiveConfidence * 100;
  }

  getColor(weight) {
    const fixedConfidence = weight ? weight.toFixed(2) : 0;
    switch (true) {
      case (fixedConfidence <= -1):
        return colours[0];
      case (fixedConfidence > -1 && fixedConfidence <= -0.9):
        return colours[1];
      case (fixedConfidence > -0.9 && fixedConfidence <= -0.8):
        return colours[2];
      case (fixedConfidence > -0.8 && fixedConfidence <= -0.7):
        return colours[3];
      case (fixedConfidence > -0.7 && fixedConfidence <= -0.6):
        return colours[4];
      case (fixedConfidence > -0.6 && fixedConfidence <= -0.5):
        return colours[5];
      case (fixedConfidence > -0.5 && fixedConfidence <= -0.4):
        return colours[6];
      case (fixedConfidence > -0.4 && fixedConfidence <= -0.3):
        return colours[7];
      case (fixedConfidence > -0.3 && fixedConfidence <= -0.2):
        return colours[8];
      case (fixedConfidence > -0.2 && fixedConfidence <= -0.1):
        return colours[9];
      case (fixedConfidence > -1 && fixedConfidence < 0.1):
        return colours[10];
      case (fixedConfidence > 0.1 && fixedConfidence <= 0.2):
        return colours[11];
      case (fixedConfidence > 0.2 && fixedConfidence <= 0.3):
        return colours[12];
      case (fixedConfidence > 0.3 && fixedConfidence <= 0.4):
        return colours[13];
      case (fixedConfidence > 0.4 && fixedConfidence <= 0.5):
        return colours[14];
      case (fixedConfidence > 0.5 && fixedConfidence <= 0.6):
        return colours[15];
      case (fixedConfidence > 0.6 && fixedConfidence <= 0.7):
        return colours[16];
      case (fixedConfidence > 0.7 && fixedConfidence <= 0.8):
        return colours[17];
      case (fixedConfidence > 0.8 && fixedConfidence <= 0.9):
        return colours[18];
      case (fixedConfidence > 0.9 && fixedConfidence <= 1):
        return colours[19];
      case (fixedConfidence >= 1):
        return colours[20];
      default:
        return colours[10];
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
              <h1 class="title is-6">${this.point.weighting}</h1>
              <span style="color:${this.point.color}">●</span> Weight: <b>${this.point.weight}%</b><br/>
            </div>`;
  }

  render() {
    return (
      <div className="level-item">
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
