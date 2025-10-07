
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StoreTransfer } from "@/hooks/useStoreManagement";

interface StoreTransfersTabProps {
  transfers: StoreTransfer[];
}

export function StoreTransfersTab({ transfers }: StoreTransfersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{transfer.productName}</div>
                  <div className="text-sm text-gray-600">
                    {transfer.fromStore} → {transfer.toStore}
                  </div>
                  <div className="text-sm text-gray-500">
                    Quantity: {transfer.quantity} | Requested: {transfer.requestDate}
                  </div>
                </div>
                <Badge variant={transfer.status === 'completed' ? 'default' : 'secondary'}>
                  {transfer.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
