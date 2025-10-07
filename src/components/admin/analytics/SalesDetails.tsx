
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SalesData } from "@/types/analytics";

interface SalesDetailsProps {
  salesData: SalesData;
}

export function SalesDetails({ salesData }: SalesDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sales} units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₦{product.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{transaction.id}</div>
                  <div className="text-sm text-gray-500">{transaction.time} • {transaction.items} item(s)</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₦{transaction.amount.toLocaleString()}</div>
                  <Badge variant={transaction.method === 'Card' ? 'default' : 'secondary'}>
                    {transaction.method}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
