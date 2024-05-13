import React from "react";
import ReactApexChart from "react-apexcharts";

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    return (
      <ReactApexChart
        // options={this.state.chartOptions}
        // series={this.state.chartData}
        options={this.props.chartOptions}
        series={this.props.chartData}
        type='line'
        width='100%'
        height='100%'
      />
    );
  }
}

export default LineChart;
