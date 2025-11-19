import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PiggyBank, Wallet, CreditCard, Receipt, Banknote } from "lucide-react";
import { SalesStatistics } from "@/redux/services/stores.services";

interface FinancialMetricsProps {
  stats: SalesStatistics;
}

export function FinancialMetrics({ stats }: FinancialMetricsProps) {
  // latest receipts (use last salesTrend value as proxy)
  const latestReceipts = stats.salesTrend?.values?.slice(-1)[0] ?? 0;
  const totalPendingRemit = (stats.cashRemittanceByStore ?? []).reduce((s, r) => s + (r.amount || 0), 0);

  const profitMargin = stats.totalSales ? ((stats.totalSales - (stats.totalSales * 0.3)) / stats.totalSales) * 100 : 0; 
  // NOTE: we don't have explicit expenses/profit in SalesStatistics; this is a fragile proxy — kept minimal

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(stats.totalSales || 0).toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">Period total</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <PiggyBank className="h-4 w-4" /> Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{Math.round(stats.averageOrderValue || 0).toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{profitMargin.toFixed(1)}% proxy margin</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Latest Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(latestReceipts || 0).toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">Latest period</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Banknote className="h-4 w-4" /> Pending Remittance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₦{(totalPendingRemit || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Across stores</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
