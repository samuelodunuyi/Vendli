
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types";
import { toast } from "@/components/ui/sonner";
import { Order } from "@/redux/services/orders.services";

interface VoidReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Order | null;
  type: 'void' | 'return';
  onApprove: (transactionId: number, reason: string, approver: string) => void;
}

export function ReturnDialog({ 
  open, 
  onOpenChange, 
  transaction, 
  type, 
  onApprove 
}: VoidReturnDialogProps) {
  const [reason, setReason] = useState("");
  const [approverPassword, setApproverPassword] = useState("");
  const [approverName, setApproverName] = useState("");

  const handleApprove = () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    
    if (!approverName.trim()) {
      toast.error("Please enter approver name");
      return;
    }

    if (approverPassword !== "admin123") {
      toast.error("Invalid approver password");
      return;
    }

    if (transaction) {
      onApprove(transaction.id, reason, approverName);
      toast.success(`Transaction ${'returned'} successfully`);
      onOpenChange(false);
      setReason("");
      setApproverPassword("");
      setApproverName("");
    }
  };

  if (!transaction) return null;

  const orderTotal = transaction.orderItems.reduce(
  (acc, item) => acc + item.priceAtOrder * item.quantity,
  0
);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
             Return Transaction
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Transaction ID:</span>
              <span className="text-sm">{transaction.id}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold">₦{orderTotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              <Badge>{transaction.status}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Reason for {type === 'void' ? 'Void' : 'Return'} *
            </label>
            <Textarea
              placeholder={`Enter reason for ${type}...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Approver Name *</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Manager Password *</label>
            <Input
              type="password"
              placeholder="Enter manager password"
              value={approverPassword}
              onChange={(e) => setApproverPassword(e.target.value)}
            />
            <p className="text-xs text-gray-500">Demo password: admin123</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleApprove}
              variant={type === 'void' ? "destructive" : "default"}
              className="flex-1"
            >
              'Process Return
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
