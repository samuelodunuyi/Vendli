
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WorkflowGuide } from "@/components/WorkflowGuide";
import { refundWorkflowSteps } from "@/data/workflows";
import { Transaction } from "@/types";
import { toast } from "@/components/ui/sonner";
import { AlertTriangle, DollarSign, User, Calendar } from "lucide-react";

interface EnhancedRefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onApprove: (transactionId: string, reason: string, approver: string) => void;
}

export function EnhancedRefundDialog({ 
  open, 
  onOpenChange, 
  transaction, 
  onApprove 
}: EnhancedRefundDialogProps) {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [reason, setReason] = useState("");
  const [approverPassword, setApproverPassword] = useState("");
  const [approverName, setApproverName] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleApprove = () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the refund");
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
      toast.success("Refund processed successfully");
      onOpenChange(false);
      setReason("");
      setApproverPassword("");
      setApproverName("");
      setIsVerified(false);
    }
  };

  if (!transaction) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Process Refund
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Refund Guidelines</span>
              </div>
              <p className="text-sm text-yellow-700">
                Follow the step-by-step workflow to ensure compliance with company policies and regulations.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowWorkflow(true)}
                className="mt-2"
              >
                Start Guided Refund Process
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600">Transaction ID</div>
                  <div className="font-medium">{transaction.id}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600">Amount</div>
                  <div className="font-medium">₦{transaction.total.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Refund Reason *</label>
              <Textarea
                placeholder="Enter detailed reason for refund..."
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
              <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                Process Refund
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <WorkflowGuide
        title="Refund Processing Workflow"
        description="Follow these steps to process a refund safely and in compliance with company policies."
        steps={refundWorkflowSteps}
        isVisible={showWorkflow}
        onClose={() => setShowWorkflow(false)}
      >
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Current Transaction</h4>
            <p className="text-sm text-blue-700">ID: {transaction.id} | Amount: ₦{transaction.total.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="verified" 
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
            />
            <label htmlFor="verified" className="text-sm">
              I have completed this step and verified all requirements
            </label>
          </div>
        </div>
      </WorkflowGuide>
    </>
  );
}
