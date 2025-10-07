
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Shield, Clock, LogOut } from "lucide-react";

export function UserProfilePanel() {
  const user = {
    name: "John Adebayo",
    email: "john.adebayo@cwretail.com",
    phone: "+234 801 234 5678",
    role: "Store Manager",
    location: "Victoria Island Store",
    lastLogin: "Today at 9:15 AM",
    avatar: "/placeholder.svg"
  };

  return (
    <div className="space-y-6 py-4">
      {/* User Info */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-blue-600 text-white text-lg">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <Badge variant="secondary" className="mt-1">
            <Shield className="h-3 w-3 mr-1" />
            {user.role}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="space-y-3">
        <h4 className="font-medium">Contact Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Last login: {user.lastLogin}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div className="space-y-3">
        <h4 className="font-medium">Quick Actions</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <User className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Clock className="h-4 w-4 mr-2" />
            Activity Log
          </Button>
        </div>
      </div>

      <Separator />

      {/* Logout */}
      <Button variant="destructive" className="w-full">
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
