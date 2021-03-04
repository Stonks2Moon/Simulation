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

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  private data: any[] = [];

  private nextPrice: any;

  private x1: any;
  private x2: any;
  private w: any;
  private z: any;
  private value: any = 0;
  private points: any = [];
  private t: any;

  boxMuller(r: any[]) {
    let phase = 0;
    if (!phase) {
      this.x1 = 2.0 * r[0] - 1.0;
      this.x2 = 2.0 * r[1] - 1.0;
      this.w = this.x1 * this.x1 + this.x2 * this.x2;
      if (this.w >= 1.0) {
        this.w = Math.sqrt((-2.0 * Math.log(this.w)) / this.w);
        this.z = this.x1 * this.w;
      } else {
        this.z = this.x2 * this.w;
      }
    } else {
      this.z = this.x2 * this.w;
    }

    if (this.z == this.z) {
      this.value += this.z;
      this.points.push([this.t, this.value]);
      this.points.map((point: any) => {
        this.calculations(point[1]);
        point = point.slice(-1);
      });
      this.points = this.points.slice(-1);
    }
    phase ^= 1;
  }

  calculations(result: number) {
    const base = 0;
    const scale = 30;

    if (base != 0) {
      result = base + result * (base / scale);
    }

    this.nextPrice = result;
  }

  generateNextPrice(): number {
    this.boxMuller([Math.random(), Math.random()]);
    return this.nextPrice + 30;
  }

  randomData() {
    now = new Date(+now + oneDay);
    value = this.generateNextPrice()
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        value,
      ],
    };
  }

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
              color: 'rgb(255, 125, 0)',
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
      this.data.push(this.randomData());
    }

    setInterval(() => {
      for (var i = 0; i < 5; i++) {
        this.data.shift();
        this.data.push(this.randomData());
      }

      // this.chartOptions.series[0].data = this.data;

      this.mergeData = { ...this.chartOptions };
    }, 1000);
  }
}
