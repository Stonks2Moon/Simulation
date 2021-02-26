import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
var now = new Date(1997, 9, 3);
var oneDay = 24 * 3600 * 1000;
var value = Math.random() * 1000;
function randomData() {
  now = new Date(+now + oneDay);
  value = value + Math.random() * 21 - 10;
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
      Math.round(value),
    ],
  };
}
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  private data: any[] = [];

  chartOptions: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        params = params[0];
        var date = new Date(params.name);
        return (
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          ' : ' +
          params.value[1]
        );
      },
      axisPointer: {
        animation: false,
      },
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        data: this.data,
        type: 'line',
        showSymbol: false,
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {
    for (var i = 0; i < 1000; i++) {
      this.data.push(randomData());
    }

    setInterval(() => {
    
    
      for (var i = 0; i < 5; i++) {
        this.data.shift();
        this.data.push(randomData());
      }

      // this.chartOptions.series[0].data = this.data;

      this.chartOptions = {...this.chartOptions}

    }, 1000);
  }
}
