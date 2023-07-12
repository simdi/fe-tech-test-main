'use client';

import { useEffect, useState } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryLine,
  VictoryTheme
} from 'victory';
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Title } from "@/components/ui/title";
import { GridContainer } from "@/components/grid-container";
import { cn } from "@/lib/utils";

type XDataPlot = {
  x?: string;
  y: number;
}

export default function AwesomeChart() {
  const [data, setData] = useState<Array<null> | Array<XDataPlot>>([]);
  const [data2013, setData2013] = useState<Array<null> | Array<XDataPlot>>([]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const [res, res2013] = await Promise.all([
          fetch('https://api.frankfurter.app/2023-01-01..2023-01-31?from=GBP&to=USD'),
          fetch('https://api.frankfurter.app/2013-01-01..2013-01-31?from=GBP&to=USD')
        ]);
        const [resData, resData2013] = await Promise.all([
          res.json(),
          res2013.json()
        ]);

        if (resData && resData.rates) {
          const resDataReduced = Object.entries(resData.rates).reduce((acc: Array<XDataPlot>, curr: any) => {
            const [date, currency] = curr;
            const newDate = new Date(date);
            acc.push({
              // x: new Date(newDate).toDateString(),
              y: currency.USD
            });
            return acc;
          }, []);
          const resData2013Reduced = Object.entries(resData2013.rates).reduce((acc: Array<XDataPlot>, curr: any) => {
            const [date, currency] = curr;
            acc.push({
              x: new Date(new Date(date).setFullYear(2023)).toLocaleString().split(',')[0],
              y: currency.USD
            });
            return acc;
          }, []);
          console.log({ resDataReduced, resData2013Reduced });
          setData(resDataReduced);
          setData2013(resData2013Reduced);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  return (
    <GridContainer>
      <Title>My Awesome Chart</Title>

      <div className="flex h-full w-full flex-col">
      <Card className={cn("w-full bg-white")}>
          <CardContent>
            <VictoryChart
              theme={VictoryTheme.material}
              style={{
                background: { fill: "white" }
              }}
              domain={{
                // x: [new Date(2023, 1, 1), new Date(2023, 2, 1)],
                y: [1.1, 1.7]
              }}
              scale={{ x:"time", y:"linear" }}
              height={200}
              width={700}
            >
            <VictoryLabel text="My Awesome Chart" x={70} y={10} textAnchor="middle"/>
            <VictoryLegend
              x={500}
              y={25}
              width={200}
              orientation="horizontal"
              style={{
                border: { stroke: "black" },
                title: {fontSize: 4, padding: 5 },
                labels: { fontSize: 5},
              }}
              data={[
                { name: "Jan 2013: GBP to USD", symbol: { fill: "#d3d3d3" } },
                { name: "Jan 2023: GBP to USD", symbol: { fill: "#7373fc" } },
              ]}
            />
            <VictoryLine
              style={{
                data: { stroke: "#d3d3d3", strokeDasharray: 2, strokeWidth: 1 },
              }}
              data={data2013}
            />
            <VictoryLine
              style={{
                data: { stroke: "#7373fc", strokeWidth: 1 },
              }}
              data={data}
            />
            <VictoryAxis dependentAxis
              label="GBP to USD"
              style={{
                axisLabel: {fontSize: 7, padding: 30},
                tickLabels: {fontSize: 5, padding: 5},
              }}
            />
            <VictoryAxis
              label="Date"
              style={{
                axis: {stroke: "#756f6a"},
                axisLabel: {fontSize: 7, padding: 20},
                grid: { stroke: (tick: any) => tick },
                ticks: {stroke: "grey", size: 3 },
                tickLabels: {fontSize: 5, padding: 5}
              }}
              tickFormat={(t) => t}
            />
          </VictoryChart>
          </CardContent>
        </Card>
      </div>
    </GridContainer>
  );
}
