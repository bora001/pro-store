"use client";

import { CONSTANTS } from "@/lib/constants";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type ChartDataType = {
  month: string;
  totalSales: number;
};
const BAR_SIZE = 40;
const axisProps = {
  fontSize: 12,
  tickLine: false,
  axisLine: false,
  stroke: "#888888",
};

const OverviewChart = ({ data }: { data: ChartDataType[] }) => {
  return (
    <div className="relative h-[350px] mt-3">
      <div
        className={`absolute h-full bg-white z-50 w-[${CONSTANTS.HEADER_HEIGHT}px] left-0 top-0`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <YAxis
              dataKey="totalSales"
              {...axisProps}
              tickFormatter={(value) => `$${value}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-full overflow-x-scroll w-auto">
        <div
          style={{
            minWidth: `${data.length * (BAR_SIZE + 20)}px`,
            height: "100%",
            marginLeft: `${CONSTANTS.HEADER_HEIGHT}px`,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" {...axisProps} />
              <Bar
                fill="gold"
                dataKey="totalSales"
                barSize={BAR_SIZE}
                radius={[BAR_SIZE, BAR_SIZE, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;
