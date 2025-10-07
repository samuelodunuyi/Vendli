
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialData } from "@/types/analytics";

interface FinancialSummaryProps {
  financialData: FinancialData;
}

export function FinancialSummary({ financialData }: FinancialSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Revenue</span>
              <span className="font-bold text-green-600">₦{financialData.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Expenses</span>
              <span className="font-bold text-red-600">₦{financialData.expenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Net Profit</span>
              <span className="font-bold text-blue-600">₦{financialData.profit.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accounts Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Accounts Receivable</span>
              <span className="font-bold">₦{financialData.accountsReceivable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Accounts Payable</span>
              <span className="font-bold">₦{financialData.accountsPayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Net Position</span>
              <span className="font-bold text-green-600">
                ₦{(financialData.accountsReceivable - financialData.accountsPayable).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
