import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesStatistics } from "@/redux/services/stores.services";

interface FinancialSummaryProps {
  stats: SalesStatistics;
}

export function FinancialSummary({ stats }: FinancialSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Period Revenue</span>
              <span className="font-bold text-green-600">₦{(stats.totalSales || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Order</span>
              <span className="font-bold">₦{Math.round(stats.averageOrderValue || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Total Orders</span>
              <span className="font-bold text-blue-600">{stats.totalOrders}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accounts / Cash</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Pending Remittance</span>
              <span className="font-bold">₦{((stats.cashRemittanceByStore ?? []).reduce((s, r) => s + (r.amount || 0), 0)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Top Category</span>
              <span className="font-bold">{(stats.salesByCategory?.[0]?.categoryName) ?? "—"}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Products</span>
              <span className="font-bold">{stats.totalProducts}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
