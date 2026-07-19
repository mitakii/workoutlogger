import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  type TooltipContentProps,
} from "recharts";

export type ProgressionPoint = {
  date: string;
  weight: number;
};

type Props = {
  data: ProgressionPoint[];
};

const fmtLabel = (date: string) =>
  new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" });

const WeightProgressionTooltip = ({ active, payload }: TooltipContentProps) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as ProgressionPoint;

  return (
    <div className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs shadow-sm space-y-0.5">
      <p className="text-muted-foreground">{fmtLabel(point.date)}</p>
      <p className="font-medium text-card-foreground">{point.weight} kg</p>
    </div>
  );
};

const WeightProgressionChart = ({ data }: Props) => {
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tickFormatter={fmtLabel}
            interval={labelEvery - 1}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
            dy={6}
          />
          <Tooltip
            content={(props) => <WeightProgressionTooltip {...props} />}
            cursor={{ stroke: "var(--border)" }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: "var(--primary)",
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightProgressionChart;
