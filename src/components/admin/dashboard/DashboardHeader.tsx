import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreSelect } from "@/components/common/StoreSelect";
import { CustomDatePicker } from "../CustomDatePicker";
import { useAuth } from "@/hooks/useAuth";

export type Period = "today" | "week" | "month" | "year" | "custom";

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "7 days" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
  { value: "custom", label: "Custom" },
];

interface DashboardHeaderProps {
  period: Period;
  onPeriodChange: (p: Period) => void;
  storeId?: number;
  onStoreChange: (id?: number) => void;
  range: { from?: Date; to?: Date };
  onRangeChange: (r: { from?: Date; to?: Date }) => void;
}

export function DashboardHeader({ period, onPeriodChange, storeId, onStoreChange, range, onRangeChange }: DashboardHeaderProps) {
  const { user } = useAuth();
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">Welcome back, {user?.firstName}</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <StoreSelect value={storeId} onChange={onStoreChange} />
          <Tabs value={period} onValueChange={(v) => onPeriodChange(v as Period)}>
            <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
              {PERIODS.map((p) => (
                <TabsTrigger key={p.value} value={p.value}>{p.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      {period === "custom" && (
        <div className="flex lg:justify-end">
          <CustomDatePicker dateRange={{ from: range.from, to: range.to }} onDateRangeChange={onRangeChange} />
        </div>
      )}
    </div>
  );
}
