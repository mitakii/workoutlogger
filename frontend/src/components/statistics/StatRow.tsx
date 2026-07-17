type Props = {
  label: string;
  value: string | number;
};

const StatRow = ({ label, value }: Props) => (
  <div className="flex justify-between py-2">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold">{value}</span>
  </div>
);

export default StatRow;
