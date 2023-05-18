// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Micro from '@amcharts/amcharts5/themes/Micro';
import * as am5map from '@amcharts/amcharts5/map';
import { GranularityEnum, MapChartConfig } from 'lfx-insights';
import moment from 'moment';
import { TimeUnit } from '@amcharts/amcharts5/.internal/core/util/Time';
import { am5geodataWorldLow } from './geo-data';

// TODO: move these to charts.d.ts
interface CreateLinearSeriesOptions {
  data?: any[];
  field?: string;
  name?: string;
  color?: string;
  bullets?: boolean;
}

interface LegendOptions {
  iconSize?: number;
}

interface CreateYAxisOptions {
  max?: number;
  numberFormat?: string;
  label?: string;
}

export function createLinearSeries(
  root: am5.Root,
  chart: am5xy.XYChart,
  xAxis: am5xy.DateAxis<am5xy.AxisRenderer>,
  yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>,
  { data = [], field = 'value', name = 'Series', color = '#ff3185', bullets = false }: CreateLinearSeriesOptions = {}
) {
  const series = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name,
      xAxis,
      yAxis,
      valueYField: field,
      valueXField: 'date',
      stroke: am5.color(color)
    })
  );

  series.strokes.template.setAll({
    strokeWidth: 2
  });

  if (bullets) {
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 6,
          strokeWidth: 2,
          fill: am5.color('#fff'),
          stroke: am5.color(color)
        })
      })
    );
  }

  series.data.setAll(data);
  series.appear(1000);
  return series;
}

export const createColumnSeries = (
  root: am5.Root,
  chart: am5xy.XYChart,
  xAxis: am5xy.DateAxis<am5xy.AxisRenderer>,
  yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>,
  data: any[],
  name = '',
  field = '',
  color = ''
) => {
  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name,
      xAxis,
      yAxis,
      valueYField: field,
      valueXField: 'date'
    })
  );
  series.columns.template.setAll({
    width: am5.percent(20),
    stroke: am5.color(color),
    fill: am5.color(color)
  });
  series.data.setAll(data);
};

export function createLegend(root: am5.Root, chart: am5xy.XYChart, { iconSize = 30 }: LegendOptions = {}) {
  const legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    })
  );
  // Note: all chart legend label have same style
  legend.labels.template.setAll({
    fontSize: 12,
    fontFamily: 'Open Sans, Source Sans Pro, sans-serif',
    fill: am5.color('#333333')
  });
  // all
  legend.markers.template.setAll({
    width: iconSize,
    height: iconSize
  });
  // column series
  legend.markerRectangles.template.setAll({
    cornerRadiusTL: 100,
    cornerRadiusTR: 100,
    cornerRadiusBL: 100,
    cornerRadiusBR: 100
  });
  legend.data.setAll(chart.series.values);
}

export function createTooltip(root: am5.Root, chart: am5xy.XYChart, series: am5xy.XYSeries, granularity: GranularityEnum) {
  // Add tooltip

  const tooltip = am5.Tooltip.new(root, {
    autoTextColor: false,
    getFillFromSprite: false,
    getStrokeFromSprite: true,
    pointerOrientation: 'horizontal',
    labelText: '[bold]{valueX}[/]'
  });

  tooltip.get('background')?.setAll({
    fill: am5.color('#000000')
  });

  tooltip.label.setAll({
    fill: am5.color('#ffffff'),
    fontSize: 12,
    fontFamily: 'Open Sans, Source Sans Pro, sans-serif'
  });

  tooltip.label.getDateFormatter().setAll({
    dateFormat: 'MMM dd'
  });

  tooltip.label.adapters.add('text', (text, target) => {
    if (target.dataItem?.dataContext && (target.dataItem?.dataContext as any).date) {
      const date = (target.dataItem?.dataContext as any).date;
      let newText = mapDate(date, granularity);
      chart.series.each((subSeries) => {
        const stroke = subSeries.get('stroke')?.toString();
        const fill = subSeries.get('fill')?.toString();
        const color = stroke ? stroke : fill;
        newText += '\n[' + color + ']●[/] [width:100px]' + subSeries.get('name') + '[/] [bold]{' + subSeries.get('valueYField') + '}';
      });
      return newText;
    }
    return text;
  });

  series.set('tooltip', tooltip);
}

function mapDate(date: any, granularity: GranularityEnum) {
  switch (granularity) {
    case GranularityEnum.day:
      return `[bold]${moment(date).format('MMM DD')}[/]`;
    case GranularityEnum.week:
      return `[bold]${moment(date).startOf('week').add(1, 'day').format('MMM DD') + ' - ' + moment(date).endOf('week').add(1, 'day').format('MMM DD')}[/]`;
    case GranularityEnum.month:
      return `[bold]${moment(date).startOf('month').format('MMM DD') + ' - ' + moment(date).endOf('month').format('MMM DD')}[/]`;
    case GranularityEnum.year:
      return `[bold]${moment(date).startOf('year').format('MMM DD') + ' - ' + moment(date).endOf('year').format('MMM DD')}[/]`;
    default:
      return `[bold]${moment(date).startOf('week').add(1, 'day').format('MMM DD') + ' - ' + moment(date).endOf('week').add(1, 'day').format('MMM DD')}[/]`;
  }
}

export function createChartRoot(parentDiv = '', isMicro = false) {
  const root: am5.Root = am5.Root.new(parentDiv);

  const myTheme = am5.Theme.new(root);
  myTheme.rule('Grid').setAll({
    strokeOpacity: 0
  });

  root.setThemes([am5themes_Animated.new(root), myTheme]);
  if (isMicro) {
    root.setThemes([am5themes_Micro.new(root)]);
  }

  // remove footer logo
  // eslint-disable-next-line no-underscore-dangle
  root._logo?.children.clear();

  return root;
}

export function createChart(root: am5.Root, withPadding = true) {
  const chart: am5xy.XYChart = root.container.children.push(
    am5xy.XYChart.new(root, {
      layout: root.verticalLayout,
      paddingBottom: withPadding ? undefined : 0,
      paddingRight: withPadding ? undefined : 0,
      paddingLeft: withPadding ? undefined : 0,
      maxTooltipDistance: -1
    })
  );

  return chart;
}

export function createYAxis(root: am5.Root, chart: am5xy.XYChart, { max = undefined, numberFormat = undefined, label = undefined }: CreateYAxisOptions = {}) {
  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      max,
      numberFormat,
      min: 0,
      extraMax: 0.1,
      renderer: am5xy.AxisRendererY.new(root, {
        fill: am5.color('#807f83'),
        stroke: am5.color('#807f83'),
        minGridDistance: 25,
        strokeOpacity: 1,
        strokeWidth: 1
      })
    })
  );
  // Note: all chart y-axis label have same style
  if (label) {
    const yAxisLabel = am5.Label.new(root, {
      rotation: -90,
      text: label,
      fontSize: 12,
      fontFamily: 'Open Sans, Source Sans Pro, sans-serif',
      fill: am5.color('#333333'),
      y: am5.p50,
      centerX: am5.p50
      //x: am5.p0,
      //centerY: am5.p0
    });

    yAxis.children.unshift(yAxisLabel);
  }

  const yRenderer = yAxis.get('renderer');
  yRenderer.labels.template.setAll({
    fill: am5.color('#807f83'),
    fontSize: 12
  });

  chart.appear(1000, 100);
  return yAxis;
}

export function createXAxis(root: am5.Root, chart: am5xy.XYChart, granularity: GranularityEnum) {
  const xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      markUnitChange: false,
      groupData: true,
      extraMax: 0.008,
      endLocation: 0,
      dateFormats: {
        day: 'MMM\ndd',
        week: 'MMM\ndd',
        month: 'MMM\nyy ',
        year: 'yyyy'
      },
      baseInterval: {
        timeUnit: granularity as TimeUnit,
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        stroke: am5.color('#807f83'),
        minGridDistance: 28,
        strokeOpacity: 1,
        strokeWidth: 1
      })
    })
  );

  xAxis.get('renderer').labels.template.setAll({
    fill: am5.color('#807f83'),
    fontSize: 12,
    textAlign: 'center',
    location: 0
  });

  return xAxis;
}

export function createMapChart(root: am5.Root): am5map.MapChart {
  const chart = root.container.children.push(
    am5map.MapChart.new(root, {
      projection: am5map.geoNaturalEarth1(),
      panX: 'none',
      panY: 'none',
      maxZoomLevel: 1
    })
  );

  return chart;
}

export function createPolygonSeries(root: am5.Root, chart: am5map.MapChart) {
  const polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodataWorldLow as GeoJSON.GeoJSON,
      exclude: ['AQ'],
      fill: am5.color('#d6d6d6')
    })
  );

  polygonSeries.mapPolygons.template.setAll({
    interactive: true
  });

  polygonSeries.mapPolygons.template.states.create('hover', {
    fill: am5.color('#797979')
  });
  polygonSeries.mapPolygons.template.states.create('active', {
    fill: am5.color('#797979')
  });

  return polygonSeries;
}

export function createSeriesTarget(yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>, series: am5xy.SmoothedXLineSeries | am5xy.ColumnSeries, value: number) {
  // add series range
  const seriesRangeDataItem = yAxis.makeDataItem({ value, endValue: value });
  series.createAxisRange(seriesRangeDataItem);
  seriesRangeDataItem.get('grid')?.setAll({
    strokeOpacity: 1,
    visible: true,
    stroke: am5.color('#807f83'),
    strokeDasharray: 7
  });
}

function setPolygonState(stateName = 'default', polygonSeries: am5map.MapPolygonSeries, circle: am5.Circle) {
  const dataItem = circle.dataItem;
  if (!dataItem) {
    return;
  }
  const dataContext = dataItem.dataContext as { id: string };
  const polygonItem = polygonSeries.getDataItemById(dataContext.id);
  if (!polygonItem) {
    return;
  }
  const polygon = polygonItem.get('mapPolygon');
  polygon.states.applyAnimate(stateName);
}

export function createBubbleSeries(root: am5.Root, chart: am5map.MapChart, polygonSeries: am5map.MapPolygonSeries, config: MapChartConfig) {
  const pointSeries = chart.series.push(
    am5map.MapPointSeries.new(root, {
      valueField: config.series.valueField,
      calculateAggregates: config.series.calculateAggregates || true,
      polygonIdField: config.series.idField
    })
  );

  const circleTemplate = am5.Template.new({}) as am5.Template<am5.Circle>;
  circleTemplate.events.on('pointerover', (ev) => {
    const circle = ev.target;
    setPolygonState('hover', polygonSeries, circle);
  });
  circleTemplate.events.on('pointerout', (ev) => {
    const circle = ev.target;
    setPolygonState('default', polygonSeries, circle);
  });

  pointSeries.bullets.push(bubbleMapPointTemplate(circleTemplate, config.tooltipHTML || ''));
  pointSeries.set('heatRules', [
    {
      target: circleTemplate,
      dataField: config.series.valueField,
      min: config.min || 0,
      max: config.max || 30,
      key: 'radius'
    }
  ]);

  return pointSeries;
}

export function mapAnnotations(template: string, values: any): string {
  let output = template;

  Object.keys(values).forEach((key) => {
    if (key === 'changeDirection') {
      output = output.replace('{changeDirection}', values.changeDirection === 'negative' ? 'text-red' : 'text-green');
    } else {
      output = output.replace(`{${key}}`, values[key]);
    }
  });

  return output;
}

let isFirstBubble = true;
const bubbleMapPointTemplate =
  (circleTemplate: am5.Template<am5.Circle>, tooltipHtml = '') =>
  (root: am5.Root) => {
    const container = am5.Container.new(root, {});
    const tooltip = createBulletMapTooltip(root);
    if (!tooltip) {
      return;
    }
    createBubble(root, container, tooltip, circleTemplate, false, tooltipHtml);
    if (isFirstBubble) {
      createBubble(root, container, tooltip, circleTemplate, true, tooltipHtml);
      isFirstBubble = false;
    }

    return am5.Bullet.new(root, {
      sprite: container,
      dynamic: true
    });
  };
function createBulletMapTooltip(root: am5.Root) {
  const tooltip = am5.Tooltip.new(root, {
    pointerOrientation: 'left',
    keepTargetHover: true,
    getFillFromSprite: false,
    labelText: '[bold]{name}[/]\n{valueX.formatDate()}: {valueY}'
  });

  const template = tooltip.get('background');
  if (!template) {
    return;
  }
  template.setAll({
    fill: am5.color('#000')
  });

  return tooltip;
}

function createBubble(
  root: am5.Root,
  container: am5.Container,
  tooltip: am5.Tooltip,
  circleTemplate: am5.Template<am5.Circle>,
  isAnimated = false,
  tooltipHtml = ''
) {
  const circle = container.children.push(
    am5.Circle.new(
      root,
      {
        radius: 20,
        fillOpacity: 0.7,
        fill: am5.color('#46b6c7'),
        cursorOverStyle: 'pointer',
        tooltip,
        tooltipX: am5.percent(100),
        tooltipHTML: tooltipHtml
      },
      circleTemplate
    )
  );

  if (isAnimated) {
    circle.animate({
      key: 'scale',
      from: 1,
      to: 1.4,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic),
      loops: Infinity
    });
    circle.animate({
      key: 'opacity',
      from: 1,
      to: 0,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic),
      loops: Infinity
    });
  }

  return circle;
}

export function formatWeekLabel(dateString = '2022-06-01') {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  const previousMonday = new Date(date.getTime() - (date.getDay() - 1) * 86400000);
  const previousMondayMonth = previousMonday.toLocaleDateString('en-US', { month: 'short' });
  const previousMondayDay = previousMonday.toLocaleDateString('en-US', { day: 'numeric' });

  const nextSunday = new Date(date.getTime() + (7 - date.getDay()) * 86400000);
  const nextSundayMonth = nextSunday.toLocaleDateString('en-US', { month: 'short' });
  const nextSundayDay = nextSunday.toLocaleDateString('en-US', { day: 'numeric' });

  let template = ``;

  if (previousMondayMonth === nextSundayMonth) {
    template = `${previousMondayMonth}\n${previousMondayDay}-${nextSundayDay}`;
  } else {
    template = `${previousMondayMonth}${previousMondayDay}-\n${nextSundayMonth} ${nextSundayDay}`;
  }

  return template;
}
