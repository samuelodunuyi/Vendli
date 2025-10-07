
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store as StoreIcon, MapPin, Phone, Mail, Edit, TrendingUp, Users } from "lucide-react";
import { Store } from "@/types/store";

interface ActiveStoreDetailsProps {
  store: Store;
  onEditStore: (storeId: string) => void;
  onViewAnalytics: (storeId: string) => void;
  onManageStaff: () => void;
}

export function ActiveStoreDetails({
  store,
  onEditStore,
  onViewAnalytics,
  onManageStaff
}: ActiveStoreDetailsProps) {
  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <StoreIcon className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-xl">{store.name}</CardTitle>
          </div>
          <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
            {store.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {store.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              {store.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              {store.email}
            </div>
            <div className="border-t pt-3">
              <div className="text-sm text-gray-600 mb-1">Manager</div>
              <div className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                {store.manager}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ₦{store.monthlyRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-green-700">Monthly Revenue</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ₦{store.totalSales.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Total Sales</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEditStore(store.id)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Store
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewAnalytics(store.id)}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            View Analytics
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onManageStaff}
          >
            <Users className="h-4 w-4 mr-1" />
            Manage Staff
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
