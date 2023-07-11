'use client';

import { useEffect } from "react";

import { Title } from "@/components/ui/title";
import { GridContainer } from "@/components/grid-container";

export default function AwesomeChart() {
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

      <div className="flex h-full w-full flex-col">Display your awesome chart here...</div>
    </GridContainer>
  );
}
