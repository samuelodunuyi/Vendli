
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store as StoreIcon, MapPin, Phone, Mail, Plus, Edit, TrendingUp } from "lucide-react";
import { Store } from "@/types/store";

const mockStores: Store[] = [
  {
    id: "store1",
    name: "Victoria Island Store",
    location: "1004 Victoria Island, Lagos",
    manager: "Adebayo Ogundimu",
    phone: "+234 901 234 5678",
    email: "vi.store@company.com",
    status: "active",
    openingDate: "2020-01-15",
    totalSales: 45000000,
    monthlyRevenue: 3750000,
  },
  {
    id: "store2",
    name: "Ikeja Store",
    location: "Allen Avenue, Ikeja, Lagos",
    manager: "Fatima Ahmed",
    phone: "+234 902 345 6789",
    email: "ikeja.store@company.com",
    status: "active",
    openingDate: "2021-03-20",
    totalSales: 32000000,
    monthlyRevenue: 2800000,
  },
  {
    id: "store3",
    name: "Lekki Store",
    location: "Phase 1, Lekki, Lagos",
    manager: "Chidi Okwu",
    phone: "+234 903 456 7890",
    email: "lekki.store@company.com",
    status: "active",
    openingDate: "2022-06-10",
    totalSales: 28000000,
    monthlyRevenue: 2400000,
  },
  {
    id: "store4",
    name: "Ajah Store",
    location: "Ajah, Lagos",
    manager: "Blessing Nwosu",
    phone: "+234 904 567 8901",
    email: "ajah.store@company.com",
    status: "active",
    openingDate: "2022-08-15",
    totalSales: 25000000,
    monthlyRevenue: 2100000,
  },
  {
    id: "store5",
    name: "Egbeda Store",
    location: "Egbeda, Lagos",
    manager: "Ibrahim Lawal",
    phone: "+234 905 678 9012",
    email: "egbeda.store@company.com",
    status: "active",
    openingDate: "2023-01-10",
    totalSales: 18000000,
    monthlyRevenue: 1500000,
  },
  {
    id: "store6",
    name: "Ikorodu Store",
    location: "Ikorodu, Lagos",
    manager: "Grace Emeka",
    phone: "+234 906 789 0123",
    email: "ikorodu.store@company.com",
    status: "active",
    openingDate: "2023-03-05",
    totalSales: 15000000,
    monthlyRevenue: 1250000,
  },
  {
    id: "store7",
    name: "Maryland Store",
    location: "Maryland, Lagos",
    manager: "Kemi Adeleke",
    phone: "+234 907 890 1234",
    email: "maryland.store@company.com",
    status: "active",
    openingDate: "2023-05-20",
    totalSales: 22000000,
    monthlyRevenue: 1800000,
  },
  {
    id: "store8",
    name: "Jabi Store",
    location: "Jabi, Abuja",
    manager: "Mohammed Hassan",
    phone: "+234 908 901 2345",
    email: "jabi.store@company.com",
    status: "active",
    openingDate: "2023-07-12",
    totalSales: 20000000,
    monthlyRevenue: 1650000,
  },
  {
    id: "store9",
    name: "Dugbe Store",
    location: "Dugbe, Ibadan",
    manager: "Funmi Adesanya",
    phone: "+234 909 012 3456",
    email: "dugbe.store@company.com",
    status: "active",
    openingDate: "2023-09-08",
    totalSales: 12000000,
    monthlyRevenue: 1000000,
  },
  {
    id: "store10",
    name: "Wuse Store",
    location: "Wuse, Abuja",
    manager: "Daniel Okafor",
    phone: "+234 910 123 4567",
    email: "wuse.store@company.com",
    status: "active",
    openingDate: "2023-11-15",
    totalSales: 8000000,
    monthlyRevenue: 750000,
  },
];

export function StoreManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Store Management</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Store
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <StoreIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                </div>
                <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                  {store.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
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
              </div>

              <div className="border-t pt-3">
                <div className="text-sm text-gray-600 mb-1">Manager</div>
                <div className="font-medium">{store.manager}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                  <div className="font-bold text-green-600">
                    ₦{store.monthlyRevenue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                  <div className="font-bold">
                    ₦{store.totalSales.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
