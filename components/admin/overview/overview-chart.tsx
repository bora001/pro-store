"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type ChartDataType = {
  month: string;
  totalSales: number;
};
const OverviewChart = ({ data }: { data: ChartDataType[] }) => {
  const axisProps = {
    fontSize: 12,
    tickLine: false,
    axisLine: false,
    stroke: "#888888",
  };
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="month" {...axisProps} />
        <YAxis
          dataKey="totalSales"
          {...axisProps}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          fill="gold"
          dataKey="totalSales"
          barSize={40}
          radius={[40, 40, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OverviewChart;
