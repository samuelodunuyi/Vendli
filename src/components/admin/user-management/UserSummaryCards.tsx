import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tiles } from "@/redux/services/user.services";

interface UserSummaryCardsProps {
  users: Tiles;
  totalUsers: number;
}

export function UserSummaryCards({ users, totalUsers}: UserSummaryCardsProps) {
  const activeUsers = users?.activeUsers;
  const superAdmins = users?.superAdmins;
  const storeAdmins = users?.storeAdmins;
  const employees = users?.employees;
  const customers = users?.customers;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Super Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{superAdmins}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Store Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{storeAdmins}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employees}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customers}</div>
        </CardContent>
      </Card>
    </div>
  );
}
