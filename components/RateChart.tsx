"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

const COLORS = ["#FFD400", "#3DFF6E", "#3DA5FF", "#FF3B3B", "#FFFFFF", "#B983FF"];

export default function RateChart({
  data,
  platforms,
  labels
}: {
  data: { tenure: string; [platform: string]: string | number }[];
  platforms: string[];
  labels: Record<string, string>;
}) {
  return (
    <div className="border-2 border-line p-5 h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#333333" vertical={false} />
          <XAxis
            dataKey="tenure"
            stroke="#8A8A8A"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#FFFFFF" }}
          />
          <YAxis stroke="#8A8A8A" fontSize={12} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            contentStyle={{
              background: "#000000",
              border: "2px solid #FFFFFF",
              borderRadius: 0,
              fontSize: 12
            }}
            labelStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#8A8A8A", fontSize: 12, fontWeight: 600 }}>
                {labels[value] || value}
              </span>
            )}
          />
          {platforms.map((p, i) => (
            <Bar key={p} dataKey={p} fill={COLORS[i % COLORS.length]} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
