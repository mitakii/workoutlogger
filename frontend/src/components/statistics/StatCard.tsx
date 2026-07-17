import { Card, CardContent } from "@/components/ui/card";

type Props = {
  label: string;
  value: string | number;
  sub?: string;
};

const StatCard = ({ label, value, sub }: Props) => (
  <Card>
    <CardContent className="pt-4 pb-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </CardContent>
  </Card>
);

export default StatCard;
