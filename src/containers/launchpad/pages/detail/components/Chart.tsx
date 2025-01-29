import { ChartDataUnit, useChartData } from "containers/launchpad/hooks";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ParsedPresale } from "remotes/graphql/launchpad/chain";
import styled from "@emotion/styled";

  const BUY_CANDLE_COLOR = '#2EB335'
  const SELL_CANDLE_COLOR = '#ED333D'

export function Chart({ presale }: { presale: ParsedPresale }) {

  const [unit, setUnit] = useState(ChartDataUnit.MINITE_15);
  const query = useChartData(presale, unit);
  const data = useMemo(() => {
    let last;
    const list = (
      query.data?.map((item) => {
        const open = isNaN(item.open) || item.open === Infinity ? 0 : item.open;
        const close =
          isNaN(item.close) || item.close === Infinity ? 0 : item.close;
        const data = {
          Date:
            "periodStartUnix" in item ? item.periodStartUnix * 1000 : item.date,
          Open: open === close && !!last ? last.Close : open,
          High: isNaN(item.high) || item.high === Infinity ? 0 : item.high,
          Low: isNaN(item.low) || item.low === Infinity ? 0 : item.low,
          Close: close,
        };
        last = data;
        return data;
      }) ?? []
    ).filter((i) => !(!i.Open && !i.High && !i.Close && !i.Low));
    return list;
  }, [query.data]);
  const ref = useRef<ReturnType<typeof renderChart>>();

  useLayoutEffect(() => {
    ref.current = renderChart(presale.name, setUnit);
    ref.current?.updateData(data);
    return () => {
      ref.current?.root.dispose();
    };
  }, [data, presale.name]);

  return (
    <Container className="bg-black">
      <div
        id="chartcontrols"
        style={{ height: "auto", padding: "5px 45px 0 15px" }}
      ></div>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
      <div style={{ width: "100px", height: "30px", position: "absolute", bottom: "25px", background: "#0f0f0f" }}></div>
    </Container>
  );
}

const Container = styled.div`
  padding: 24px 24px 32px 24px;
  border-radius: 16px;
  border: 2px solid #272727;
  position: relative;
`;

const renderChart = (
  name: string,
  onUnitChange: (unit: ChartDataUnit) => void
) => {
  const am5 = require("@amcharts/amcharts5");
  const am5xy = require("@amcharts/amcharts5/xy");
  const am5stock = require("@amcharts/amcharts5/stock");
  const root = am5.Root.new("chartdiv");
  const am5themes_Dark = require("@amcharts/amcharts5/themes/Dark");

  root.setThemes([am5themes_Dark.default.new(root)]);

  const myTheme = am5.Theme.new(root);

  myTheme.rule("Grid", ["scrollbar", "minor"]).setAll({
    visible: false,
  });

  // root.setThemes([am5themes_Animated.new(root), myTheme]);

  // Create a stock chart
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/stock/#Instantiating_the_chart
  let stockChart = root.container.children.push(
    am5stock.StockChart.new(root, {
      paddingRight: 0,
      stockPositiveColor: am5.color(BUY_CANDLE_COLOR),
      stockNegativeColor: am5.color(SELL_CANDLE_COLOR),
    })
  );

  // Set global number format
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/
  root.numberFormatter.set("numberFormat", "#,###.00000000000");

  // Create a main stock panel (chart)
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/stock/#Adding_panels
  let mainPanel = stockChart.panels.push(
    am5stock.StockPanel.new(root, {
      wheelY: "zoomX",
      panX: true,
      panY: true,
    })
  );

  // Create value axis
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  let valueAxis = mainPanel.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom",
      }),
      extraMin: 0.1, // adds some space for for main series
      tooltip: am5.Tooltip.new(root, {}),
      numberFormat: "#,###.00000000000",
      extraTooltipPrecision: 2,
    })
  );

  let dateAxis = mainPanel.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "minute",
        count: 1,
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true,
      }),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  // Add series
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  let valueSeries = mainPanel.series.push(
    am5xy.CandlestickSeries.new(root, {
      name: name,
      clustered: false,
      valueXField: "Date",
      valueYField: "Close",
      highValueYField: "High",
      lowValueYField: "Low",
      openValueYField: "Open",
      xAxis: dateAxis,
      yAxis: valueAxis,
      legendRangeValueText: "",
    })
  );

  // Set main value series
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series
  stockChart.set("stockSeries", valueSeries);

  // Add a stock legend
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/stock/stock-legend/
  let valueLegend = mainPanel.plotContainer.children.push(
    am5stock.StockLegend.new(root, {
      stockChart: stockChart,
    })
  );

  // Create volume axis
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
    inside: true,
    pan: "zoom",
  });

  volumeAxisRenderer.labels.template.set("forceHidden", true);
  volumeAxisRenderer.grid.template.set("forceHidden", true);

  let volumeValueAxis = mainPanel.yAxes.push(
    am5xy.ValueAxis.new(root, {
      numberFormat: "#.#a",
      height: am5.percent(20),
      y: am5.percent(100),
      centerY: am5.percent(100),
      renderer: volumeAxisRenderer,
    })
  );

  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  let volumeSeries = mainPanel.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Volume",
      clustered: false,
      valueXField: "Date",
      valueYField: "Volume",
      xAxis: dateAxis,
      yAxis: volumeValueAxis,
      legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]",
    })
  );

  volumeSeries.columns.template.setAll({
    strokeOpacity: 0,
    fillOpacity: 0.5,
  });

  // color columns by stock rules
  volumeSeries.columns.template.adapters.add("fill", function (fill, target) {
    let dataItem = target.dataItem;
    if (dataItem) {
      return stockChart.getVolumeColor(dataItem);
    }
    return fill;
  });

  // Set main series
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series
  stockChart.set("volumeSeries", volumeSeries);

  // Add cursor(s)
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  mainPanel.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      yAxis: valueAxis,
      xAxis: dateAxis,
      snapToSeries: [valueSeries],
      snapToSeriesBy: "y!",
    })
  );

  // Add scrollbar
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
  let scrollbar = mainPanel.set(
    "scrollbarX",
    am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50,
    })
  );
  stockChart.children.push(scrollbar);

  let sbDateAxis = scrollbar.chart.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "minute",
        count: 1,
      },
      groupData: true,
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true,
      }),
    })
  );

  let sbValueAxis = scrollbar.chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  let sbSeries = scrollbar.chart.series.push(
    am5xy.LineSeries.new(root, {
      valueYField: "Close",
      valueXField: "Date",
      xAxis: sbDateAxis,
      yAxis: sbValueAxis,
    })
  );

  sbSeries.fills.template.setAll({
    visible: true,
    fillOpacity: 0.3,
  });

  // Set up series type switcher
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/stock/toolbar/series-type-control/
  let seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
    stockChart: stockChart,
  });

  seriesSwitcher.events.on("selected", function (ev) {
    setSeriesType(ev.item.id);
  });

  function getNewSettings(series) {
    let newSettings: any[] = [];
    am5.array.each(
      [
        "name",
        "valueYField",
        "highValueYField",
        "lowValueYField",
        "openValueYField",
        "calculateAggregates",
        "valueXField",
        "xAxis",
        "yAxis",
        "legendValueText",
        "legendRangeValueText",
        "stroke",
        "fill",
      ],
      function (setting) {
        newSettings[setting] = series.get(setting);
      }
    );
    return newSettings;
  }

  function setSeriesType(seriesType) {
    // Get current series and its settings
    let currentSeries = stockChart.get("stockSeries");
    let newSettings = getNewSettings(currentSeries);

    // Remove previous series
    let data = currentSeries.data.values;
    mainPanel.series.removeValue(currentSeries);

    // Create new series
    let series;
    switch (seriesType) {
      case "line":
        series = mainPanel.series.push(am5xy.LineSeries.new(root, newSettings));
        break;
      case "candlestick":
      case "procandlestick":
        // newSettings.clustered = false;
        series = mainPanel.series.push(
          am5xy.CandlestickSeries.new(root, newSettings)
        );
        if (seriesType == "procandlestick") {
          series.columns.template.get("themeTags").push("pro");
        }
        break;
      case "ohlc":
        // newSettings.clustered = false;
        series = mainPanel.series.push(am5xy.OHLCSeries.new(root, newSettings));
        break;
    }

    // Set new series as stockSeries
    if (series) {
      valueLegend.data.removeValue(currentSeries);
      series.data.setAll(data);
      stockChart.set("stockSeries", series);
      let cursor = mainPanel.get("cursor");
      if (cursor) {
        cursor.set("snapToSeries", [series]);
      }
      valueLegend.data.insertIndex(0, series);
    }
  }

  const periodSelector = am5stock.PeriodSelector.new(root, {
    stockChart: stockChart,
    periods: [
      { timeUnit: "hour", count: 3, name: "1M", value: ChartDataUnit.MINUTE_1 },
      {
        timeUnit: "hour",
        count: 6,
        name: "15M",
        value: ChartDataUnit.MINITE_15,
      },
      { timeUnit: "day", count: 1, name: "1H", value: ChartDataUnit.HOUR_1 },
      { timeUnit: "day", count: 3, name: "4H", value: ChartDataUnit.HOUR_4 },
      { timeUnit: "day", count: 5, name: "1D", value: ChartDataUnit.DAY },
    ],
  });

  periodSelector.events.on("periodselected", (e) => {
    onUnitChange(e.period.value);
  });

  // Stock toolbar
  // -------------------------------------------------------------------------------
  // https://www.amcharts.com/docs/v5/charts/stock/toolbar/
  am5stock.StockToolbar.new(root, {
    container: document.getElementById("chartcontrols"),
    stockChart: stockChart,
    controls: [
      am5stock.IndicatorControl.new(root, {
        stockChart: stockChart,
        legend: valueLegend,
      }),
      periodSelector,
      seriesSwitcher,
      am5stock.DrawingControl.new(root, {
        stockChart: stockChart,
      }),
      am5stock.DataSaveControl.new(root, {
        stockChart: stockChart,
      }),
      am5stock.ResetControl.new(root, {
        stockChart: stockChart,
      }),
      am5stock.SettingsControl.new(root, {
        stockChart: stockChart,
      }),
    ],
  });
  valueSeries.appear(1000);

  const updateData = (data) => {
    let currentSeries = stockChart.get("stockSeries");
    valueLegend.data.removeValue(currentSeries);
    valueSeries.data.setAll(data);
    volumeSeries.data.setAll(data);
    sbSeries.data.setAll(data);
  };
  return {
    root,
    valueSeries,
    volumeSeries,
    sbSeries,
    updateData,
  };
};
