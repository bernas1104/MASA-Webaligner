interface ChartOptionsProps {
  tooltip: {
    trigger: string;
    triggerOn?: string;
    position?: Function;
  };
  title: {
    top?: string;
    left?: string;
    text: string;
  };
  toolbox: {
    feature: {
      dataZoom: {
        title: {
          zoom: string;
          back: string;
        };
        yAxisIndex: string;
      };
      restore: {
        title: string;
      };
      saveAsImage: {
        title: string;
      };
    };
  };
  xAxis: {
    type: string;
    boundaryGap: boolean;
    data: number[];
    max: number;
    min: number;
  };
  yAxis: {
    type: string;
    boundaryGap: [number, string];
    max: number;
  };
  dataZoom: [
    {
      type: string;
      start: number;
      end: number;
    },
    {
      start: number;
      end: number;
      handleIcon: string;
      handleSize: string;
      handleStyle: {
        color: string;
        shadowBlur: number;
        shadowColor: string;
        shadowOffsetX: number;
        shadowOffsetY: number;
      };
    },
  ];
  series: [
    {
      name: string;
      type: string;
      smooth: boolean;
      symbol: string;
      sampling: string;
      itemStyle: {
        color: string;
      };
      data: number[];
    },
  ];
}

interface ChartArgs {
  xAxis?: number[];
  yAxis?: number[];
  description?: string[];
  range?: number;
}

export default function ChartOptions({
  xAxis,
  yAxis,
  description,
  range,
}: ChartArgs): ChartOptionsProps {
  return {
    tooltip: {
      trigger: 'none',
      position(pt: number[]) {
        return [pt[0], '10%', { contentSize: [100, 50], viewSize: [80, 30] }];
      },
    },
    title: {
      top: '0',
      left: '10%',
      text:
        description !== undefined ? `${description[0]}\n${description[1]}` : '',
    },
    toolbox: {
      feature: {
        dataZoom: {
          title: {
            zoom: 'Area zooming',
            back: 'Restore area zooming',
          },
          yAxisIndex: 'none',
        },
        restore: {
          title: 'Restore',
        },
        saveAsImage: {
          title: 'Save As Image...',
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxis || [],
      max: range !== undefined ? range + 1000 : 1,
      min: range !== undefined ? -1000 : 0,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      max: range !== undefined ? range + 1000 : 1,
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
        handleIcon:
          'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
      },
    ],
    series: [
      {
        name: 's1 pos',
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          color: 'rgb(255, 70, 131)',
        },
        data: yAxis || [],
      },
    ],
  };
}
