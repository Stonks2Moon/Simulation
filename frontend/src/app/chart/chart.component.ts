import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { EChartsOption, graphic, SeriesOption } from 'echarts';

import { Szenario } from '../app.component';
import { eachMinuteOfInterval } from 'date-fns';

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
export class ChartComponent implements OnChanges, OnInit {
  @Input()
  szenarios: Szenario[] | null = null;

  @Input()
  selectedSzenario: number | null = null;

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
    xAxis: {
      type: 'time',
      name: 'Time',
      nameTextStyle: {
        color: '#FFF',
      },
      splitLine: {
        show: true,
        lineStyle: {
          opacity: 0.05,
        },
      },
      axisLabel: {
        color: 'rgb(255,255,255)',
      },
    },
    yAxis: {
      name: 'Delta',
      nameTextStyle: {
        color: '#FFF',
      },
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: true,
        lineStyle: {
          opacity: 0.05,
        },
      },
      axisLabel: {
        color: 'rgb(255,255,255)',
      },
    },
    series: [
      {
        data: [],
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

  mergeData = {};

  ngOnChanges() {
    if (this.szenarios === null || this.selectedSzenario === null) return;
    const data = this.szenarios?.find(({ id }) => id === this.selectedSzenario);
    if (!data) return;

    const sorted = data.data
      .map(({ time }) => new Date(time))
      .sort((a, b) => b.getTime() - a.getTime());

    const interval = eachMinuteOfInterval({
      start: sorted[sorted.length - 1],
      end: sorted[0],
    });

    const chartData = interval.map((d) => {
      const point = data.data.find(
        ({ time }) => new Date(time).getTime() === d.getTime()
      );

      const delta = point?.delta || 0;

      return {
        name: d.toString(),
        value: [
          [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/') +
            ` ${d.getUTCHours()}:${d.getMinutes()}`,
          delta,
        ],
      };
    });

    (this.chartOptions.series as SeriesOption[])[0].data = chartData;

    this.mergeData = { ...this.chartOptions };
  }

  ngOnInit() {
    this.mergeData = { ...this.chartOptions };
  }
}
