'use client';

import { useEffect, useState } from "react";
import {
  VictoryChart,
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
          </VictoryChart>
          </CardContent>
        </Card>
      </div>
    </GridContainer>
  );
}
