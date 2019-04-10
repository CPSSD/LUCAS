/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { connect } from 'react-redux';
import { sortBy, forEach, find } from 'lodash';
import { setFilteredReviews, updateFilteredReviews } from '../actions/index';

class TrendChart extends Component {
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
    const { reviews, datasetWeights } = this.props;
    const sortedReviews = sortBy(reviews, (review) => { return new Date(review.date); });
    const columnData = [];
    const lineData = [];
    forEach(sortedReviews, (review) => {
      const index = parseInt(moment(review.date).format('x'));
      const weightedReviews = find(datasetWeights, (weightedReview) => { return weightedReview.review === review.text; });
      columnData.push({ x: index, y: 1, review: weightedReviews, stars: review.stars });
      lineData.push({ x: index, y: review.stars, review: weightedReviews });
    });

    const options = {
      chart: {
        type: 'column',
        zoomType: 'xy'
      },
      series: [{
        type: 'column',
        name: 'Reviews',
        data: columnData,
        events: {
          click: (event) => { this.filterReview(event.point, columnData); }
        },
        turboThreshold: 2000,
        dataGrouping: {
          groupPixelWidth: 50,
          forced: true,
          units: [
            ['month', [1, 3, 6],
              'year', [1]]
          ]
        }
      }, {
        type: 'line',
        name: 'Average Rating',
        data: lineData,
        dataGrouping: {
          groupPixelWidth: 50,
          forced: true,
          units: [
            ['month', [1, 3, 6],
              'year', [1]]
          ]
        }
      }],
      title: {
        text: undefined,
      },
      legend: {
        enabled: false
      },
      xAxis: {
        crosshair: true,
        title: {
          enabled: true,
          text: 'Date'
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: this.formatTooltip,
      },


    };

    return options;
  }

  filterReview(point, data) {
    const { dataGroup } = point;
    const { setFilteredReviews } = this.props;
    const reviews = [];
    let count = 0;
    if (dataGroup) {
      const { start, length } = dataGroup;
      while (count < length) {
        reviews.push(data[start + count].review);
        count += 1;
      }
      if (reviews) {
        setFilteredReviews(reviews, true);
      }
    }
  }

  formatTooltip() {
    return `<div class='dotchart-tooltip'>
              <h1 class="title is-6 has-text-black">Reviews: ${this.points[0].y}</h1>
              <br>
              <h1 class="title is-6 has-text-black">Average Rating: ${this.points[1].y} Stars</h1>
            </div>`;
  }

  render() {
    return (
      <div className="level-item">
        {this.props.reviews ?
          <HighchartsReact
            highcharts={Highcharts}
            ref={this.chartComponent}
            options={this.getOptions()}
            constructorType={'stockChart'}
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
    reviews: state.reviews,
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

export default connect(mapStateToProps, mapDispatchToProps)(TrendChart);
