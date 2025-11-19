'use client';

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreFilter } from "@/components/admin/StoreFilter";
import { StoreFilter as StoreFilterType } from "@/types/store";

import { SalesMetrics } from "@/components/admin/analytics/SalesMetrics";
import { FinancialMetrics } from "@/components/admin/analytics/FinancialMetrics";
import { InventoryMetrics } from "@/components/admin/analytics/InventoryMetrics";
import { SalesCharts } from "@/components/admin/analytics/SalesCharts";
import { FinancialCharts } from "@/components/admin/analytics/FinancialCharts";
import { InventoryCharts } from "@/components/admin/analytics/InventoryCharts";
import { SalesDetails } from "@/components/admin/analytics/SalesDetails";
import { FinancialSummary } from "@/components/admin/analytics/FinancialSummary";
import { useGetSalesStatisticsQuery, SalesStatistics } from "@/redux/services/stores.services";

interface SalesStatsQueryParams {
  storeId?: number;
  categoryId?: number;
  dateRangeTimeline?: "last7days" | "last30days" | "last90days" | "thisYear";
}

export function SalesAnalytics() {
  const [filters, setFilters] = useState<StoreFilterType>({});

  const queryParams: SalesStatsQueryParams = useMemo(
    () => ({
      storeId: filters.storeId,
      categoryId: filters.categoryId,
      dateRangeTimeline: filters.timeline,
    }),
    [filters]
  );

  const { data, isLoading, isError } = useGetSalesStatisticsQuery(queryParams);

  if (isLoading) return <div>Loading sales statistics...</div>;
  if (isError) return <div>Error fetching sales statistics.</div>;
  if (!data) return <div>No sales statistics available.</div>;

  const stats: SalesStatistics = data;

  return (
    <div className="space-y-6">
      <StoreFilter filters={filters} onFiltersChange={setFilters} />

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <SalesMetrics stats={stats} />
          <SalesCharts stats={stats} />
          <SalesDetails stats={stats} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <FinancialMetrics stats={stats} />
          <FinancialCharts stats={stats} />
          <FinancialSummary stats={stats} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <InventoryMetrics stats={stats} />
          <InventoryCharts stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
