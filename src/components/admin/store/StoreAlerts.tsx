
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Users, Wrench, CheckCircle } from "lucide-react";
import { StoreAlert } from "@/hooks/useStoreManagement";

interface StoreAlertsProps {
  alerts: StoreAlert[];
  onResolveAlert?: (alertId: string) => void;
}

export function StoreAlerts({ alerts, onResolveAlert }: StoreAlertsProps) {
  const getAlertIcon = (type: StoreAlert['type']) => {
    switch (type) {
      case 'low-stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'high-sales':
        return <TrendingUp className="h-4 w-4" />;
      case 'staff-shortage':
        return <Users className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: StoreAlert['severity']) => {
    switch (severity) {
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

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Active Alerts ({unresolvedAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unresolvedAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              No active alerts - all stores operating normally
            </div>
          ) : (
            <div className="space-y-3">
              {unresolvedAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">{alert.date}</span>
                        </div>
                        <div className="font-medium mb-1">{alert.message}</div>
                        <div className="text-sm text-gray-600">Store: {alert.storeId}</div>
                      </div>
                    </div>
                    {onResolveAlert && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onResolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recently Resolved ({resolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resolvedAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">RESOLVED</Badge>
                        <span className="text-sm text-gray-500">{alert.date}</span>
                      </div>
                      <div className="font-medium mb-1 line-through text-gray-600">{alert.message}</div>
                      <div className="text-sm text-gray-500">Store: {alert.storeId}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
