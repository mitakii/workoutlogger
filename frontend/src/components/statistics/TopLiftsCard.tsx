import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  bench: number;
  squat: number;
  deadlift: number;
};

const TopLiftsCard = ({ bench, squat, deadlift }: Props) => (
  <Card>
    <CardHeader className="pb-2 pt-4">
      <CardTitle className="text-sm">Top Lifts</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm">
      {[
        { label: "Bench", value: bench },
        { label: "Squat", value: squat },
        { label: "Deadlift", value: deadlift },
      ].map(({ label, value }) => (
        <div key={label} className="flex justify-between">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold">{value} kg</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default TopLiftsCard;
