/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { connect } from 'react-redux';
import { sortBy, forEach, last, findIndex, find } from 'lodash';
import { setFilteredReviews, updateFilteredReviews } from '../actions/index';


HighchartsMore(Highcharts);

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

  getCategoies(reviews) {
    const startDate = moment(reviews[0].date);
    const endDate = moment(last(reviews).date);
    const dates = [];

    const month = moment(startDate);
    dates.push(month.format('YYYY-MM'));
    while (month < endDate) {
      month.add(1, 'month');
      dates.push(month.format('YYYY-MM'));
    }

    return dates;
  }

  getOptions() {
    const { reviews, datasetWeights } = this.props;
    const sortedReviews = sortBy(reviews, (review) => { return new Date(review.date); });
    const columnData = [];
    const lineData = [];
    const categories = this.getCategoies(sortedReviews);
    forEach(sortedReviews, (review) => {
      const monthOfReview = moment(review.date).format('YYYY-MM');
      const index = findIndex(categories, (value) => { return value === monthOfReview; });
      const dataAtIndex = find(columnData, (val) => { return val.x === index; });
      const dataAtLineIndex = find(lineData, (val) => { return val.x === index; });
      const weightedReviews = find(datasetWeights, (weightedReview) => { return weightedReview.review === review.text; });
      if (dataAtIndex) {
        dataAtIndex.y += 1;
        dataAtIndex.review.push(weightedReviews);
        const currentStars = dataAtLineIndex.y;
        const averageRating = (currentStars + review.stars) / dataAtIndex.y;
        dataAtLineIndex.y = Math.abs(averageRating.toFixed(2));
        dataAtLineIndex.review.push(weightedReviews);
      } else {
        columnData.push({ x: index, y: 1, review: [weightedReviews] });
        lineData.push({ x: index, y: review.stars, review: [weightedReviews] });
      }
    });

    const options = {
      chart: {
        type: 'column',
      },
      series: [{
        type: 'column',
        name: 'Reviews',
        yAxis: 1,
        data: columnData,
        events: {
          click: (event) => { this.filterReview(event.point); }
        },
      }, {
        type: 'spline',
        name: 'Average Rating',
        data: lineData,
        tooltip: {
          valueSuffix: ' Stars'
        },
        events: {
          click: (event) => { this.filterReview(event.point); }
        },
      }],
      title: {
        text: undefined,
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories,
        crosshair: true,
        title: {
          enabled: true,
          text: 'Date'
        },
      },
      yAxis: [{
        title: {
          text: 'Rating',
        },
        min: 0,
        max: 5,
        ceiling: 5,
      }, {
        title: {
          text: 'Review Count',
        },
        opposite: true
      }],
      plotOptions: {
        bubble: {
          minSize: 25,
          maxSize: 25,
        }
      },
      tooltip: {
        shared: true,
      },


    };

    return options;
  }

  filterReview(point) {
    const { setFilteredReviews } = this.props;
    if (point.review) {
      setFilteredReviews(point.review, true);
    }
  }

  formatTooltip() {
    return `<div class='dotchart-tooltip'>
              <h1 class="title is-6">${"test"}</h1>
              <h3>Confidence: ${"test"}%</h3>
              <br>
              <div>...</div>
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
