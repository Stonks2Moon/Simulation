import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { graphic } from 'echarts';

// var data = [Math.random() * 300];

// for (var i = 1; i < 20000; i++) {
//     var now = new Date(base += oneDay);
//     date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
//     data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
// }

let now = new Date(1997, 9, 3);
const oneDay = 24 * 3600 * 1000;
let value = Math.random() * 1000;
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
        const date = new Date(params.name);
        return (
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          ': ' +
          params.value[1]
        );
      },
      axisPointer: {
        animation: false,
      },
    },
    // dataZoom: [
    //   {
    //     type: 'inside',
    //   },
    //   {
    //     handleSize: '80%',
    //     handleStyle: {
    //       color: '#fff',
    //     },
    //   },
    // ],
    xAxis: {
      type: 'time',
      splitLine: {
        show: true,
        lineStyle: {
          opacity: .05
        }
      },
      axisLabel: {
        color: 'rgb(255,255,255)'
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: true,
        lineStyle: {
          opacity: .05
        }
      },
      axisLabel: {
        color: 'rgb(255,255,255)'
      }
    },
    series: [
      {
        data: this.data,
        smooth: true,
        sampling: 'average',
        itemStyle: {
          color: 'rgb(255, 125, 50)',
        },
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 125, 50)',
            },
            {
              offset: 1,
              color: 'rgb(145, 71, 0)',
            },
          ]),
        },
        type: 'line',
        showSymbol: false,
      },
    ],
  };

  mergeData = {}

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

      this.mergeData = { ...this.chartOptions };
    }, 1000);
  }
}
