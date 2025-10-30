
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, TrendingUp, Award, Calendar } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Store } from "@/redux/services/stores.services";

interface StaffMember {
  id: string;
  name: string;
  position: string;
  storeId: number;
  storeName: string;
  performance: number;
  attendance: number;
  sales: number;
  commissions: number;
  trainingCompleted: number;
  trainingRequired: number;
}

interface EnhancedStaffManagementProps {
  stores: Store[];
}

const mockStaffData: StaffMember[] = [
  {
    id: "1",
    name: "Adebayo Ogundimu",
    position: "Store Manager",
    storeId: 1,
    storeName: "Victoria Island Store",
    performance: 95,
    attendance: 98,
    sales: 2450000,
    commissions: 245000,
    trainingCompleted: 8,
    trainingRequired: 10
  },
  {
    id: "2",
    name: "Fatima Ahmed",
    position: "Sales Associate",
    storeId: 1,
    storeName: "Victoria Island Store",
    performance: 88,
    attendance: 94,
    sales: 1850000,
    commissions: 185000,
    trainingCompleted: 6,
    trainingRequired: 8
  },
  {
    id: "3",
    name: "Chidi Okwu",
    position: "Store Manager",
    storeId: 3,
    storeName: "Lekki Store",
    performance: 92,
    attendance: 96,
    sales: 2100000,
    commissions: 210000,
    trainingCompleted: 9,
    trainingRequired: 10
  },
  {
    id: "4",
    name: "Blessing Nwosu",
    position: "Sales Associate",
    storeId: 4,
    storeName: "Ajah Store",
    performance: 85,
    attendance: 92,
    sales: 1650000,
    commissions: 165000,
    trainingCompleted: 5,
    trainingRequired: 8
  }
];

const scheduleData = [
  { day: "Monday", store: "Victoria Island", shift: "Morning", staff: ["Adebayo O.", "Fatima A.", "John D."] },
  { day: "Monday", store: "Victoria Island", shift: "Afternoon", staff: ["Sarah M.", "Mike K.", "Joy I."] },
  { day: "Tuesday", store: "Lekki", shift: "Morning", staff: ["Chidi O.", "Grace E.", "Paul N."] },
  { day: "Tuesday", store: "Lekki", shift: "Afternoon", staff: ["Mary A.", "David L.", "Ruth O."] }
];

export function EnhancedStaffManagement({ stores }: EnhancedStaffManagementProps) {
  const [selectedStore, setSelectedStore] = useState<number>(null);
  const [staffFilter, setStaffFilter] = useState<string>("all");

  const filteredStaff = mockStaffData.filter(staff => {
    if (selectedStore !== null && staff.storeId !== selectedStore) return false;
    if (staffFilter !== "all" && staff.position !== staffFilter) return false;
    return true;
  });

  const handleAssignTraining = (staffId: string, module: string) => {
    toast.success(`Training module "${module}" assigned to staff member`);
  };

  const handleScheduleStaff = (storeId: string, shift: string) => {
    toast.success(`Staff scheduled for ${shift} shift`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Enhanced Staff Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="scheduling">Cross-Store Scheduling</TabsTrigger>
            <TabsTrigger value="training">Training Modules</TabsTrigger>
            <TabsTrigger value="incentives">Incentives</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Filters */}
            <div className="flex gap-4">
<Select value={selectedStore?.toString()} onValueChange={(val) => setSelectedStore(Number(val))}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select Store" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Stores</SelectItem>
    {stores.map((store) => (
      <SelectItem key={store.storeId} value={store.storeId.toString()}>
        {store.storeName}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="Store Manager">Store Manager</SelectItem>
                  <SelectItem value="Sales Associate">Sales Associate</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Staff Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Staff Performance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Position</th>
                        <th className="text-left p-3">Store</th>
                        <th className="text-right p-3">Performance</th>
                        <th className="text-right p-3">Attendance</th>
                        <th className="text-right p-3">Sales</th>
                        <th className="text-right p-3">Commission</th>
                        <th className="text-right p-3">Training</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map((staff) => (
                        <tr key={staff.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{staff.name}</td>
                          <td className="p-3">{staff.position}</td>
                          <td className="p-3">{staff.storeName}</td>
                          <td className="p-3 text-right">
                            <Badge variant={staff.performance > 90 ? 'default' : staff.performance > 80 ? 'secondary' : 'destructive'}>
                              {staff.performance}%
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Badge variant={staff.attendance > 95 ? 'default' : staff.attendance > 85 ? 'secondary' : 'destructive'}>
                              {staff.attendance}%
                            </Badge>
                          </td>
                          <td className="p-3 text-right">₦{staff.sales.toLocaleString()}</td>
                          <td className="p-3 text-right">₦{staff.commissions.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <span className="text-sm">
                              {staff.trainingCompleted}/{staff.trainingRequired}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cross-Store Staff Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduleData.map((schedule, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {schedule.day} - {schedule.shift} Shift
                          </div>
                          <div className="text-sm text-gray-600">{schedule.store}</div>
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {schedule.staff.map((staffName, staffIndex) => (
                                <Badge key={staffIndex} variant="outline">
                                  {staffName}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleScheduleStaff(schedule.store, schedule.shift)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Edit Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Module Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Award className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <div className="font-medium">Customer Service</div>
                          <div className="text-sm text-gray-600">8 modules</div>
                          <Button className="mt-2 w-full" size="sm">
                            Assign Module
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                          <div className="font-medium">Sales Techniques</div>
                          <div className="text-sm text-gray-600">6 modules</div>
                          <Button className="mt-2 w-full" size="sm">
                            Assign Module
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                          <div className="font-medium">POS Systems</div>
                          <div className="text-sm text-gray-600">4 modules</div>
                          <Button className="mt-2 w-full" size="sm">
                            Assign Module
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Training Progress by Staff</h4>
                    {filteredStaff.map((staff) => (
                      <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-gray-600">{staff.position} - {staff.storeName}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            {staff.trainingCompleted}/{staff.trainingRequired} modules completed
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(staff.trainingCompleted / staff.trainingRequired) * 100}%` }}
                            ></div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAssignTraining(staff.id, "New Module")}
                          >
                            Assign Training
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incentives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commission & Incentive Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">₦1,205,000</div>
                        <div className="text-sm text-gray-600">Total Commissions Paid</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">15</div>
                        <div className="text-sm text-gray-600">Top Performers</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">12.5%</div>
                        <div className="text-sm text-gray-600">Avg Commission Rate</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Commission Breakdown</h4>
                    {filteredStaff.map((staff) => (
                      <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-gray-600">
                            Sales: ₦{staff.sales.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            ₦{staff.commissions.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {((staff.commissions / staff.sales) * 100).toFixed(1)}% commission
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
