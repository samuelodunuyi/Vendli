
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Package, AlertTriangle, TrendingUp, Users, CheckCircle } from "lucide-react";

export function NotificationsPanel() {
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Low Stock Alert",
      message: "iPhone 15 Pro Max running low in Victoria Island store",
      time: "2 minutes ago",
      unread: true,
      icon: AlertTriangle,
      color: "text-orange-500"
    },
    {
      id: 2,
      type: "success",
      title: "Order Completed",
      message: "Order #ORD-2024-001234 has been successfully processed",
      time: "15 minutes ago",
      unread: true,
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 3,
      type: "info",
      title: "Sales Target",
      message: "You've reached 85% of your monthly sales target",
      time: "1 hour ago",
      unread: true,
      icon: TrendingUp,
      color: "text-blue-500"
    },
    {
      id: 4,
      type: "info",
      title: "New Customer",
      message: "A new customer has registered: Sarah Okafor",
      time: "2 hours ago",
      unread: false,
      icon: Users,
      color: "text-purple-500"
    },
    {
      id: 5,
      type: "info",
      title: "Inventory Update",
      message: "Weekly inventory report is ready for review",
      time: "1 day ago",
      unread: false,
      icon: Package,
      color: "text-gray-500"
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="space-y-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span className="font-medium">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center rounded-full p-0">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm">
          Mark all as read
        </Button>
      </div>

      <Separator />

      {/* Notifications List */}
      <ScrollArea className="h-96">
        <div className="space-y-3">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                  notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className={`h-5 w-5 mt-0.5 ${notification.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{notification.title}</p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      {/* Footer Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full">
          View All Notifications
        </Button>
        <Button variant="ghost" className="w-full text-sm">
          Notification Settings
        </Button>
      </div>
    </div>
  );
}
