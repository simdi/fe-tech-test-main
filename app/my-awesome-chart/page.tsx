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
  x: string;
  y: number;
}

type Point = {
  [date:string]: { USD: number }
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
        console.log({ resData, resData2013 });
        if (resData && resData.rates) {
          const resDataReduced = Object.entries(resData.rates).reduce((acc: Array<XDataPlot>, curr: any) => {
            const [date, currency] = curr;
            const newDate = new Date(date);
            acc.push({
              x: new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()).toDateString(),
              y: currency.USD
            });
            return acc;
          }, []);
          const resData2013Reduced = Object.entries(resData2013.rates).reduce((acc: Array<XDataPlot>, curr: any) => {
            const [date, currency] = curr;
            acc.push({
              x: new Date(new Date(date).setFullYear(2023)).toDateString(),
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
            minDomain={{ y: 1.1 }}
            maxDomain={{ y: 1.7 }}
            theme={VictoryTheme.material}
            style={{
              background: { fill: "white" }
            }}
            height={200}
          >
            <VictoryLabel text="My Awesome Chart" x={70} y={10} textAnchor="middle"/>
            <VictoryLegend
              x={50}
              y={10}
              width={200}
              orientation="horizontal"
              style={{ border: { stroke: "black" }, title: {fontSize: 4 } }}
              data={[
                { name: "Jan 2013: GBP to USD", symbol: { fill: "#c43a31" } },
                { name: "Jan 2023: GBP to USD", symbol: { fill: "blue" } },
              ]}
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31" },
              }}
              data={data2013}
            />
            <VictoryLine
              style={{
                data: { stroke: "blue" },
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
                grid: { stroke: ({ tick }) => tick },
                ticks: {stroke: "grey", size: 5},
                tickLabels: {fontSize: 5, padding: 5}
              }}
              tickValues={[2.11, 3.9, 6.1, 8.05]}
            />
          </VictoryChart>
          </CardContent>
        </Card>
      </div>
    </GridContainer>
  );
}
