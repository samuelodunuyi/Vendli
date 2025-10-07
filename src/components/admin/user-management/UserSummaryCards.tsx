
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "./types";

interface UserSummaryCardsProps {
  users: User[];
}

export function UserSummaryCards({ users }: UserSummaryCardsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const admins = users.filter(u => u.roles.some(r => r.role === "super_admin")).length;
  const staff = users.filter(u => u.roles.some(r => r.role.includes("store_"))).length;

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
          <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{admins}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{staff}</div>
        </CardContent>
      </Card>
    </div>
  );
}
