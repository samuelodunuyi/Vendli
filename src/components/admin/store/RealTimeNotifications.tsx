
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, AlertTriangle, TrendingUp, Users, Clock, CheckCircle, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Notification {
  id: string;
  type: 'low-stock' | 'high-sales' | 'staff-alert' | 'emergency' | 'system';
  title: string;
  message: string;
  storeId: string;
  storeName: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
}

interface NotificationSettings {
  lowStockAlerts: boolean;
  highSalesAlerts: boolean;
  staffAlerts: boolean;
  emergencyAlerts: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface RealTimeNotificationsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "low-stock",
    title: "Low Stock Alert",
    message: "iPhone 15 Pro stock below 5 units",
    storeId: "store3",
    storeName: "Lekki Store",
    timestamp: "2 minutes ago",
    priority: "high",
    read: false
  },
  {
    id: "2",
    type: "high-sales",
    title: "High Sales Performance",
    message: "Samsung Galaxy S23 selling 50% above average",
    storeId: "store1",
    storeName: "Victoria Island Store",
    timestamp: "15 minutes ago",
    priority: "medium",
    read: false
  },
  {
    id: "3",
    type: "staff-alert",
    title: "Staff Attendance Alert",
    message: "2 staff members late for afternoon shift",
    storeId: "store2",
    storeName: "Ikeja Store",
    timestamp: "1 hour ago",
    priority: "medium",
    read: true
  },
  {
    id: "4",
    type: "emergency",
    title: "Emergency Alert",
    message: "POS system experiencing connectivity issues",
    storeId: "store4",
    storeName: "Ajah Store",
    timestamp: "3 hours ago",
    priority: "critical",
    read: false
  }
];

export function RealTimeNotifications({ open, onOpenChange }: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>({
    lowStockAlerts: true,
    highSalesAlerts: true,
    staffAlerts: true,
    emergencyAlerts: true,
    systemAlerts: true,
    emailNotifications: true,
    pushNotifications: true
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomTypes: Notification['type'][] = ['low-stock', 'high-sales', 'staff-alert'];
      const randomType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
      
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: randomType,
        title: `${randomType === 'low-stock' ? 'Low Stock' : randomType === 'high-sales' ? 'High Sales' : 'Staff'} Alert`,
        message: `Simulated ${randomType} notification`,
        storeId: "store1",
        storeName: "Victoria Island Store",
        timestamp: "Just now",
        priority: Math.random() > 0.7 ? 'high' : 'medium',
        read: false
      };

      if (Math.random() > 0.7) { // 30% chance of new notification
        setNotifications(prev => [newNotification, ...prev]);
        toast.info(`New ${randomType} alert received`);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'low-stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'high-sales':
        return <TrendingUp className="h-4 w-4" />;
      case 'staff-alert':
        return <Users className="h-4 w-4" />;
      case 'emergency':
        return <AlertTriangle className="h-4 w-4" />;
      case 'system':
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success(`${key} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Real-time Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowStock">Low Stock Alerts</Label>
                  <Switch
                    id="lowStock"
                    checked={settings.lowStockAlerts}
                    onCheckedChange={(checked) => updateSettings('lowStockAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="highSales">High Sales Alerts</Label>
                  <Switch
                    id="highSales"
                    checked={settings.highSalesAlerts}
                    onCheckedChange={(checked) => updateSettings('highSalesAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="staffAlerts">Staff Alerts</Label>
                  <Switch
                    id="staffAlerts"
                    checked={settings.staffAlerts}
                    onCheckedChange={(checked) => updateSettings('staffAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emergencyAlerts">Emergency Alerts</Label>
                  <Switch
                    id="emergencyAlerts"
                    checked={settings.emergencyAlerts}
                    onCheckedChange={(checked) => updateSettings('emergencyAlerts', checked)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="systemAlerts">System Alerts</Label>
                  <Switch
                    id="systemAlerts"
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) => updateSettings('systemAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSettings('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSettings('pushNotifications', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  No notifications at this time
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{notification.title}</span>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority.toUpperCase()}
                            </Badge>
                            {!notification.read && (
                              <Badge variant="secondary">NEW</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {notification.message}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{notification.timestamp}</span>
                            <span>•</span>
                            <span>{notification.storeName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
