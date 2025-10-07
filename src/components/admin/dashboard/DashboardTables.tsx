
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, Star, TrendingDown } from "lucide-react";

const topPerformingStores = [
  { name: "Victoria Island Store", sales: 8500000 },
  { name: "Lekki Store", sales: 7200000 },
  { name: "Ikeja Store", sales: 6800000 },
  { name: "Maryland Store", sales: 5400000 },
  { name: "Jabi Store", sales: 4900000 },
  { name: "Ajah Store", sales: 4200000 },
  { name: "Wuse Store", sales: 3800000 },
  { name: "Dugbe Store", sales: 3200000 },
  { name: "Ikorodu Store", sales: 2900000 },
  { name: "Egbeda Store", sales: 2100000 }
];

export function DashboardTables() {
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
              <div className="flex justify-between items-center">
                <span className="text-sm">Beverage</span>
                <span className="text-sm font-semibold">234 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Dairy</span>
                <span className="text-sm font-semibold">196 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Meat</span>
                <span className="text-sm font-semibold">177 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Electronics</span>
                <span className="text-sm font-semibold">154 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Flowers</span>
                <span className="text-sm font-semibold">141 Sold</span>
              </div>
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
              <div className="flex justify-between items-center">
                <span className="text-sm">Red Bull</span>
                <span className="text-sm font-semibold">109 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Butter</span>
                <span className="text-sm font-semibold">87 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sausage</span>
                <span className="text-sm font-semibold">69 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Headset</span>
                <span className="text-sm font-semibold">55 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sun Flower</span>
                <span className="text-sm font-semibold">49 Sold</span>
              </div>
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
              <div className="flex justify-between items-center">
                <span className="text-sm">HP Ink</span>
                <span className="text-sm font-semibold text-red-600">0 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Nescafe</span>
                <span className="text-sm font-semibold text-red-600">2 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Green Tea</span>
                <span className="text-sm font-semibold text-orange-600">9 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Nutella</span>
                <span className="text-sm font-semibold text-orange-600">11 Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Flashlight</span>
                <span className="text-sm font-semibold text-orange-600">18 Sold</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Performance and Customer Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Store */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Top Performing Store
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformingStores.slice(0, 5).map((store) => (
                <div key={store.name} className="flex justify-between items-center">
                  <span className="text-sm">{store.name}</span>
                  <span className="text-sm font-semibold">₦{store.sales.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Yetunde</span>
                <span className="text-sm font-semibold">49 Orders</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Chioma</span>
                <span className="text-sm font-semibold">37 Orders</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tunde</span>
                <span className="text-sm font-semibold">29 Orders</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Adams</span>
                <span className="text-sm font-semibold">23 Orders</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Shade</span>
                <span className="text-sm font-semibold">19 Orders</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
