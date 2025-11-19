import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomDatePicker } from "../CustomDatePicker";
import { useGetStoresQuery } from "@/redux/services/stores.services";
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DashboardHeaderProps {
  currentUser: {
    firstName: string;
    lastName: string;
  };
  selectedStore: number | null;
  onStoreChange: (value: number | null) => void;
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  customDateRange: DateRange;
  onCustomDateRangeChange: (range: DateRange) => void;
}

const stores = [
  "All Stores",
  "Victoria Island Store",
  "Ikeja Store",
  "Lekki Store",
  "Ajah Store",
  "Egbeda Store",
  "Ikorodu Store",
  "Maryland Store",
  "Jabi Store",
  "Dugbe Store",
  "Wuse Store",
];

const getPeriodLabel = (period: string) => {
  switch (period) {
    case "today":
      return "Today";
    case "week":
      return "This Week";
    case "month":
      return "This Month";
    case "year":
      return "This Year";
    case "custom":
      return "Custom Date";
    default:
      return "Today";
  }
};

export function DashboardHeader({
  currentUser,
  selectedStore,
  onStoreChange,
  selectedPeriod,
  onPeriodChange,
  customDateRange,
  onCustomDateRangeChange,
}: DashboardHeaderProps) {
  const { data: storesData, isLoading } = useGetStoresQuery();
  console.log(storesData);

  if (isLoading) {
    return <p>Loading stores...</p>; // or a spinner
  }

  return (
    <div className="space-y-4">
      {/* Header with Time Period Tabs and Store Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Welcome {currentUser.firstName} {currentUser.lastName}
        </h2>
        <div className="flex items-center gap-4">
          <Select
            value={selectedStore !== null ? String(selectedStore) : "__all__"}
            onValueChange={(value) => {
              if (value === "__all__") {
                onStoreChange(null);
              } else {
                onStoreChange(Number(value));
              }
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Stores" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="__all__">All Stores</SelectItem>

              {storesData?.stores.map((store) => (
                <SelectItem key={store.storeId} value={String(store.storeId)}>
                  {store.storeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs
            value={selectedPeriod}
            onValueChange={onPeriodChange}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="year">This Year</TabsTrigger>
              <TabsTrigger value="custom">Custom Date</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Custom Date Picker - Show only when custom tab is selected */}
      {selectedPeriod === "custom" && (
        <div className="flex justify-end">
          <CustomDatePicker
            dateRange={customDateRange}
            onDateRangeChange={onCustomDateRangeChange}
          />
        </div>
      )}

      {/* Current Filter Display */}
      <div className="text-sm text-gray-600">
        Showing data for{" "}
        <span className="font-semibold">{getPeriodLabel(selectedPeriod)}</span>
        {selectedStore !== null && (
          <span>
            •{" "}
            <span className="font-semibold">
              {
                storesData?.stores.find((s) => s.storeId === selectedStore)
                  ?.storeName
              }
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
