
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield, Eye, CheckCircle, X, Clock } from "lucide-react";
import { FraudAlert } from "@/types/forecasting";
import { useState } from "react";

interface FraudDetectionPanelProps {
  alerts?: FraudAlert[];
}

const mockFraudAlerts: FraudAlert[] = [
  {
    id: "FA001",
    type: 'high_refunds',
    severity: 'high',
    description: "Customer ID CU-78234 has requested 8 refunds in 24 hours totaling ₦450,000",
    customerId: "CU-78234",
    amount: 450000,
    timestamp: "2024-01-10T14:30:00Z",
    status: 'new'
  },
  {
    id: "FA002", 
    type: 'bulk_purchase',
    severity: 'medium',
    description: "Unusual bulk purchase: 15 identical smartphones purchased with different payment methods",
    transactionId: "TXN-456789",
    amount: 2250000,
    timestamp: "2024-01-10T13:15:00Z",
    status: 'investigating'
  },
  {
    id: "FA003",
    type: 'payment_anomaly', 
    severity: 'critical',
    description: "Payment method flagged: Card ending in 4567 used across 12 different transactions in 30 minutes",
    transactionId: "TXN-789012",
    amount: 850000,
    timestamp: "2024-01-10T12:45:00Z",
    status: 'new'
  },
  {
    id: "FA004",
    type: 'unusual_pattern',
    severity: 'low',
    description: "Customer shopping pattern deviation: First-time customer making high-value purchase",
    transactionId: "TXN-345678",
    customerId: "CU-91234",
    amount: 750000,
    timestamp: "2024-01-10T11:20:00Z",
    status: 'resolved'
  }
];

export function FraudDetectionPanel({ alerts = mockFraudAlerts }: FraudDetectionPanelProps) {
  const [alertStates, setAlertStates] = useState<Record<string, FraudAlert['status']>>(
    alerts.reduce((acc, alert) => ({ ...acc, [alert.id]: alert.status }), {})
  );

  const getSeverityColor = (severity: FraudAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: FraudAlert['status']) => {
    switch (status) {
      case 'new': return 'bg-red-50 text-red-700 border-red-200';
      case 'investigating': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'false_positive': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: FraudAlert['type']) => {
    switch (type) {
      case 'high_refunds': return <X className="h-4 w-4" />;
      case 'bulk_purchase': return <AlertTriangle className="h-4 w-4" />;
      case 'payment_anomaly': return <Shield className="h-4 w-4" />;
      case 'unusual_pattern': return <Eye className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const updateAlertStatus = (alertId: string, newStatus: FraudAlert['status']) => {
    setAlertStates(prev => ({ ...prev, [alertId]: newStatus }));
  };

  const getStatusIcon = (status: FraudAlert['status']) => {
    switch (status) {
      case 'new': return <AlertTriangle className="h-4 w-4" />;
      case 'investigating': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'false_positive': return <X className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const activeAlerts = alerts.filter(alert => 
    alertStates[alert.id] === 'new' || alertStates[alert.id] === 'investigating'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold">Fraud Detection</h2>
        </div>
        <Badge variant="destructive" className="text-sm">
          {activeAlerts.length} Active Alerts
        </Badge>
      </div>

      {activeAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {activeAlerts.length} suspicious activities detected. Immediate attention required.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Investigation</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alerts.filter(a => alertStates[a.id] === 'investigating').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => alertStates[a.id] === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Potential Loss</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₦{alerts.reduce((sum, alert) => sum + (alert.amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(alert.type)}
                      {getStatusIcon(alertStates[alert.id])}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(alertStates[alert.id])}>
                          {alertStates[alert.id].replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        {alert.transactionId && (
                          <span>Transaction: {alert.transactionId}</span>
                        )}
                        {alert.customerId && (
                          <span>Customer: {alert.customerId}</span>
                        )}
                        {alert.amount && (
                          <span className="font-medium">Amount: ₦{alert.amount.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {alertStates[alert.id] === 'new' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => updateAlertStatus(alert.id, 'investigating')}
                    >
                      Investigate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateAlertStatus(alert.id, 'false_positive')}
                    >
                      Mark False Positive
                    </Button>
                  </div>
                )}
                
                {alertStates[alert.id] === 'investigating' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => updateAlertStatus(alert.id, 'resolved')}
                    >
                      Mark Resolved
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateAlertStatus(alert.id, 'false_positive')}
                    >
                      False Positive
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
