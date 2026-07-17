import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  current: number;
  longest: number;
};

const StreakCard = ({ current, longest }: Props) => (
  <Card>
    <CardHeader className="pb-2 pt-4">
      <CardTitle className="text-sm">Streak</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <div>
        <p className="text-xs text-muted-foreground">Current</p>
        <p className="text-xl font-bold">
          {current}
          <span className="text-sm font-normal text-muted-foreground ml-1">wks</span>
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Longest</p>
        <p className="text-xl font-bold">
          {longest}
          <span className="text-sm font-normal text-muted-foreground ml-1">wks</span>
        </p>
      </div>
    </CardContent>
  </Card>
);

export default StreakCard;
