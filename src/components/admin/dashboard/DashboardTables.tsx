import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, Star, TrendingDown } from "lucide-react";

interface DashboardTablesProps {
  topCategories: { name: string; sold: number }[];
  topProducts: { name: string; sold: number }[];
  lowProducts: { name: string; sold: number }[];
  topStores: { name: string; sales: number }[];
  topCustomers: { name: string; orders: number }[];
}

export function DashboardTables({
  topCategories,
  topProducts,
  lowProducts,
  topStores,
  topCustomers,
}: DashboardTablesProps) {
  return (
    <div className="space-y-6">
      {/* Bottom Section with Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Top Selling Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategories.slice(0, 5).map((cat) => (
                <div key={cat.name} className="flex justify-between items-center">
                  <span className="text-sm">{cat.name}</span>
                  <span className="text-sm font-semibold">{cat.sold} Sold</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.slice(0, 5).map((prod) => (
                <div key={prod.name} className="flex justify-between items-center">
                  <span className="text-sm">{prod.name}</span>
                  <span className="text-sm font-semibold">{prod.sold} Sold</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="h-5 w-5 mr-2" />
              Low Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowProducts.slice(0, 5).map((prod) => (
                <div key={prod.name} className="flex justify-between items-center">
                  <span className="text-sm">{prod.name}</span>
                  <span
                    className={`text-sm font-semibold ${
                      prod.sold <= 2
                        ? "text-red-600"
                        : prod.sold <= 10
                        ? "text-orange-600"
                        : ""
                    }`}
                  >
                    {prod.sold} Sold
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Performance and Customer Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Stores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Top Performing Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStores.slice(0, 5).map((store) => (
                <div key={store.name} className="flex justify-between items-center">
                  <span className="text-sm">{store.name}</span>
                  <span className="text-sm font-semibold">
                    ₦{store.sales.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCustomers.slice(0, 5).map((cust) => (
                <div key={cust.name} className="flex justify-between items-center">
                  <span className="text-sm">{cust.name}</span>
                  <span className="text-sm font-semibold">
                    {cust.orders} Orders
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
