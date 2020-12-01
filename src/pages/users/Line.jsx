import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts';
//引入柱状图
import 'echarts/lib/chart/bar';
//引入折线图
import 'echarts/lib/chart/line';
// 引入提示框、标题等组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
class Line extends Component {
  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('forms'));
    // 绘制图表
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例',
      },
      tooltip: {},
      legend: {
        data: ['销量'],
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
        },
        {
          name: '销量2',
          type: 'line',
          data: [15, 30, 46, 20, 20, 30],
        },
      ],
    });
  }
  render() {
    return <div id="forms" style={{ width: '650px', height: '350px' }}></div>;
  }
}

export default Line;
