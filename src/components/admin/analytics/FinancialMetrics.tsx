
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PiggyBank, Wallet, CreditCard, Receipt, Banknote } from "lucide-react";
import { FinancialData } from "@/types/analytics";

interface FinancialMetricsProps {
  financialData: FinancialData;
  dailyReceiptsData: Array<{
    date: string;
    inStore: number;
    online: number;
    wholesale: number;
  }>;
  cashRemittanceData: Array<{
    store: string;
    pending: number;
    completed: number;
    failed: number;
  }>;
}

export function FinancialMetrics({ financialData, dailyReceiptsData, cashRemittanceData }: FinancialMetricsProps) {
  const profitMargin = ((financialData.profit / financialData.revenue) * 100);
  const todaysReceipts = dailyReceiptsData[6];
  const totalDailyReceipts = todaysReceipts.inStore + todaysReceipts.online + todaysReceipts.wholesale;
  const totalPendingRemittance = cashRemittanceData.reduce((sum, store) => sum + store.pending, 0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{financialData.revenue.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">This month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{financialData.profit.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{profitMargin.toFixed(1)}% margin</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{financialData.cashFlow.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">Positive</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Bank Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{financialData.bankBalance.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Available funds</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Daily Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalDailyReceipts.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1">Today's total</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Pending Remittance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₦{totalPendingRemittance.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Across all stores</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
