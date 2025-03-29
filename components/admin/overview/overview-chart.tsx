"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type ChartDataType = {
  month: string;
  totalSales: number;
};
const OverviewChart = ({ data }: { data: ChartDataType[] }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="totalSales"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar
            dataKey="totalSales"
            barSize={40}
            fill="gold"
            radius={[40, 40, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default OverviewChart;
