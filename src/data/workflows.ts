
import { WorkflowStep } from "@/hooks/useWorkflowGuide";

export const refundWorkflowSteps: WorkflowStep[] = [
  {
    id: "verify-transaction",
    title: "Verify Transaction",
    description: "Locate and verify the original transaction details including customer information and payment method."
  },
  {
    id: "check-refund-policy",
    title: "Check Refund Policy",
    description: "Verify that the refund request meets company policy requirements (time limits, condition of goods, etc.)."
  },
  {
    id: "authorize-refund",
    title: "Get Authorization",
    description: "Obtain manager approval for refunds above threshold amount or outside standard policy."
  },
  {
    id: "process-return",
    title: "Process Return",
    description: "Update inventory to reflect returned items and adjust stock levels."
  },
  {
    id: "issue-refund",
    title: "Issue Refund",
    description: "Process the refund to the original payment method and provide confirmation to customer."
  },
  {
    id: "document-refund",
    title: "Document Transaction",
    description: "Record refund details in system for audit trail and reporting purposes."
  }
];

export const inventoryAdjustmentSteps: WorkflowStep[] = [
  {
    id: "identify-discrepancy",
    title: "Identify Discrepancy",
    description: "Document the difference between system count and physical count with photos if needed."
  },
  {
    id: "investigate-cause",
    title: "Investigate Root Cause",
    description: "Determine why the discrepancy occurred (theft, damage, counting error, etc.)."
  },
  {
    id: "get-approval",
    title: "Get Manager Approval",
    description: "Obtain authorization from supervisor for inventory adjustments above threshold."
  },
  {
    id: "adjust-quantities",
    title: "Adjust System Quantities",
    description: "Update inventory levels in the system to match physical count."
  },
  {
    id: "update-costs",
    title: "Update Cost Information",
    description: "Adjust inventory valuation and cost of goods sold if necessary.",
    optional: true
  },
  {
    id: "document-adjustment",
    title: "Document Adjustment",
    description: "Record detailed explanation and supporting documentation for the adjustment."
  }
];

export const complianceCheckSteps: WorkflowStep[] = [
  {
    id: "review-requirements",
    title: "Review Compliance Requirements",
    description: "Check current regulatory requirements and company policies that apply."
  },
  {
    id: "gather-documentation",
    title: "Gather Documentation",
    description: "Collect all necessary documents, certificates, and records for review."
  },
  {
    id: "conduct-audit",
    title: "Conduct Compliance Audit",
    description: "Systematically review processes, procedures, and documentation for compliance."
  },
  {
    id: "identify-gaps",
    title: "Identify Compliance Gaps",
    description: "Document any areas where current practices don't meet requirements."
  },
  {
    id: "create-action-plan",
    title: "Create Corrective Action Plan",
    description: "Develop timeline and responsibilities for addressing identified compliance issues."
  },
  {
    id: "implement-corrections",
    title: "Implement Corrections",
    description: "Execute the corrective action plan and update procedures as needed."
  },
  {
    id: "verify-compliance",
    title: "Verify Compliance",
    description: "Confirm that all corrective actions have been completed successfully."
  }
];
