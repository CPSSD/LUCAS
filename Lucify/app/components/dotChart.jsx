/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import { connect } from 'react-redux';
import { forEach, findLast, cloneDeep, find, sortBy, groupBy } from 'lodash';
import { setFilteredReviews, updateFilteredReviews } from '../actions/index';

const colours = ['#8b0000', '#ac0002', '#cf0002', '#f30001', '#ff4300', '#ff6e00', '#ff9000', '#ffae2c', '#ffc96e', '#ffe4a7', '#d3d3d3', '#00e500', '#00d600', '#00c700', '#00b800', '#00aa00', '#009b00', '#008d00', '#007f00', '#007200', '#006400'];

HighchartsMore(Highcharts);

class DotChart extends Component {
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

  getOptions() {
    const { datasetWeights } = this.props;
    const reviews = groupBy(datasetWeights, 'result');
    const { Genuine, Deceptive } = reviews;
    let allReviews;
    const categories = ['100', '90', '80', '70', '60', '50', '40', '30', '20', '10', '0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
    if (Genuine && Deceptive) {
      allReviews = Genuine.concat(Deceptive);
    } else if (Genuine) {
      allReviews = Genuine;
    } else {
      allReviews = Deceptive;
    }

    const sortedReviews = sortBy(allReviews, (review) => { return parseFloat(review.confidence); });
    const chartData = [];
    const options = {
      chart: {
        type: 'bubble',
      },
      series: [{
        data: chartData,
        events: {
          click: (event) => { this.filterReview(event.point); }
        },
        turboThreshold: 2000,
      }],
      title: {
        text: undefined,
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories,
        title: {
          enabled: true,
          useHTML: true,
          align: 'left',
          text: '<div class="dotchart-title"><span>Most Deceptive</span><span>Least Deceptive</span><span>Least Genuine</span><span>Most Genuine</span></div>'
        },
        labels: {
          format: '{value}%'
        },
      },
      yAxis: {
        min: 0,
        visible: false,
        tickInterval: 10
      },
      plotOptions: {
        bubble: {
          minSize: 25,
          maxSize: 25,
        }
      },
      tooltip: {
        useHTML: true,
        formatter: this.formatTooltip,
      },


    };

    forEach(sortedReviews, (review) => {
      const number = parseFloat(review.confidence);
      const confidence = this.floor(this.calculateConfidence(number));
      const trueConfidence = this.calculateConfidence(number);
      if (review.result === 'Genuine') {
        forEach(categories, (value, index) => {
          if (!(index <= 9)) {
            if (parseFloat(value) === confidence) {
              const clonedData = cloneDeep(chartData);
              const dataAtIndex = findLast(clonedData, (val) => { return val.x === index; });
              if (dataAtIndex) {
                dataAtIndex.y += 1;
                dataAtIndex.review = review;
                dataAtIndex.confidence = trueConfidence;
                chartData.push(dataAtIndex);
              } else {
                chartData.push({
                  x: index,
                  y: 1,
                  z: 0.5,
                  color: colours[index],
                  confidence: trueConfidence,
                  review,
                });
              }
            }
          }
        });
      } else {
        forEach(categories, (value, index) => {
          if (!(index >= 11)) {
            if (parseFloat(value) === confidence) {
              const clonedData = cloneDeep(chartData);
              const dataAtIndex = findLast(clonedData, (val) => { return val.x === index; });
              if (dataAtIndex) {
                dataAtIndex.y += 1;
                dataAtIndex.review = review;
                dataAtIndex.confidence = trueConfidence;
                chartData.push(dataAtIndex);
              } else {
                chartData.push({
                  x: index,
                  y: 1,
                  z: 0.5,
                  color: colours[index],
                  confidence: trueConfidence,
                  review,
                });
              }
            }
          }
        });
      }
    });

    forEach(categories, (value, index) => {
      if (!(find(chartData, (val) => { return val.x === index; }))) {
        chartData.push({ x: index, y: 0 });
      }
    });

    return options;
  }

  floor(number) {
    return Math.floor(number / 10) * 10;
  }

  calculateConfidence(confidence) {
    let positiveConfidence = Math.abs(confidence.toFixed(2));
    if (positiveConfidence > 1) {
      positiveConfidence = 1;
    }

    return Math.round(positiveConfidence * 100);
  }

  formatTooltip() {
    return `<div class='dotchart-tooltip'>
              <h1 class="title is-6 has-text-black">${this.point.review.result}</h1>
              <h3>Confidence: ${this.point.confidence}%</h3>
              <br>
              <div> ${this.point.review.review.substring(0, 140)}...</div>
            </div>`;
  }


  filterReview(point) {
    const { reviewsFiltered, setFilteredReviews, updateFilteredReviews, filteredReviews } = this.props;
    if (point.review) {
      if (!reviewsFiltered) {
        setFilteredReviews([point.review], true);
      } else {
        const reviewDuplicate = find(filteredReviews, (review) => { return review.review === point.review.review; });
        if (!reviewDuplicate) {
          updateFilteredReviews(point.review);
        }
      }
    }
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

const mapDispatchToProps = (dispatch) => {
  return {
    setFilteredReviews: (reviews, filtered) => dispatch(setFilteredReviews(reviews, filtered)),
    updateFilteredReviews: (reviews) => dispatch(updateFilteredReviews(reviews)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DotChart
);
