
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeliveryTracking, DeliveryUpdate } from "@/types/order";
import { useState } from "react";
import { MapPin, Clock, Truck, Package, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface DeliveryTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  deliveryTracking?: DeliveryTracking;
}

export function DeliveryTrackingDialog({ 
  open, 
  onOpenChange, 
  orderId, 
  deliveryTracking 
}: DeliveryTrackingDialogProps) {
  const [newUpdate, setNewUpdate] = useState({
    stage: '',
    location: '',
    notes: ''
  });

  const handleAddUpdate = () => {
    if (!newUpdate.stage) {
      toast.error("Please select a delivery stage");
      return;
    }

    const update: DeliveryUpdate = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      stage: newUpdate.stage,
      location: newUpdate.location,
      notes: newUpdate.notes,
      updatedBy: "Current User" // Should be actual user
    };

    toast.success("Delivery update added successfully");
    setNewUpdate({ stage: '', location: '', notes: '' });
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'pending':
      case 'confirmed':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'dispatched':
      case 'in-transit':
      case 'out-for-delivery':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'dispatched': return 'bg-purple-100 text-purple-800';
      case 'in-transit': return 'bg-indigo-100 text-indigo-800';
      case 'out-for-delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB") + " " + 
           new Date(dateString).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delivery Tracking - Order {orderId}</DialogTitle>
        </DialogHeader>

        {deliveryTracking ? (
          <div className="space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStageIcon(deliveryTracking.stage)}
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={getStageColor(deliveryTracking.stage)}>
                    {deliveryTracking.stage.replace('-', ' ').toUpperCase()}
                  </Badge>
                  {deliveryTracking.trackingNumber && (
                    <div className="text-right">
                      <p className="text-sm font-medium">Tracking Number</p>
                      <p className="text-sm font-mono">{deliveryTracking.trackingNumber}</p>
                    </div>
                  )}
                </div>
                
                {deliveryTracking.estimatedDelivery && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-sm">{formatDate(deliveryTracking.estimatedDelivery)}</p>
                    </div>
                    {deliveryTracking.actualDelivery && (
                      <div>
                        <p className="text-sm font-medium">Actual Delivery</p>
                        <p className="text-sm">{formatDate(deliveryTracking.actualDelivery)}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>{deliveryTracking.deliveryAddress.street}</p>
                  <p>{deliveryTracking.deliveryAddress.city}, {deliveryTracking.deliveryAddress.state}</p>
                  <p>{deliveryTracking.deliveryAddress.postalCode}</p>
                  <p>{deliveryTracking.deliveryAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryTracking.updates.map((update) => (
                    <div key={update.id} className="flex items-start gap-3 p-3 border-l-4 border-blue-200">
                      <div className="flex-shrink-0">
                        {getStageIcon(update.stage)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Badge className={getStageColor(update.stage)} variant="outline">
                            {update.stage.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(update.timestamp)}
                          </span>
                        </div>
                        {update.location && (
                          <p className="text-sm text-gray-600 mt-1">📍 {update.location}</p>
                        )}
                        {update.notes && (
                          <p className="text-sm mt-1">{update.notes}</p>
                        )}
                        {update.updatedBy && (
                          <p className="text-xs text-gray-500 mt-1">Updated by: {update.updatedBy}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add New Update */}
            <Card>
              <CardHeader>
                <CardTitle>Add Delivery Update</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Delivery Stage</label>
                    <Select value={newUpdate.stage} onValueChange={(value) => setNewUpdate(prev => ({ ...prev, stage: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="dispatched">Dispatched</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="failed">Failed Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      placeholder="Current location"
                      value={newUpdate.location}
                      onChange={(e) => setNewUpdate(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Additional notes about this update"
                    value={newUpdate.notes}
                    onChange={(e) => setNewUpdate(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <Button onClick={handleAddUpdate}>Add Update</Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No delivery tracking information available for this order.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
