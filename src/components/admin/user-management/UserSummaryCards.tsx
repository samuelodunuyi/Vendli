import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "./types";

interface UserSummaryCardsProps {
  users: User[];
}

export function UserSummaryCards({ users }: UserSummaryCardsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;

  const superAdmins = users.filter(u => u.roles === 0).length;
  const storeAdmins = users.filter(u => u.roles === 1).length;
  const employees = users.filter(u => u.roles === 2).length;
  const customers = users.filter(u => u.roles === 3).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
