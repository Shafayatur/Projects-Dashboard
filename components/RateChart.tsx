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

const COLORS = ["#D9A94E", "#2E9B6F", "#6B8FA6", "#C4644A", "#9A7FC4", "#8AA6D9"];

export default function RateChart({
  data,
  platforms,
  labels
}: {
  data: { bucket: string; [platform: string]: string | number }[];
  platforms: string[];
  labels: Record<string, string>;
}) {
  return (
    <div className="border border-border bg-surface rounded-lg p-5 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#2A2F2B" vertical={false} />
          <XAxis
            dataKey="bucket"
            stroke="#9AA49C"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#2A2F2B" }}
          />
          <YAxis
            stroke="#9AA49C"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              background: "#171B18",
              border: "1px solid #2A2F2B",
              borderRadius: 8,
              fontSize: 12
            }}
            labelStyle={{ color: "#EDEDE6" }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#9AA49C", fontSize: 12 }}>{labels[value] || value}</span>
            )}
          />
          {platforms.map((p, i) => (
            <Bar key={p} dataKey={p} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
