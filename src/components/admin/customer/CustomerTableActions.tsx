
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  classification: string;
  industryClass?: string;
  companyName?: string;
  preferredStore: string;
  loyaltyTier: string;
  loyaltyPoints: number;
  totalSpent: number;
  lastTransaction: string;
  kycStatus: string;
  status: string;
}

interface CustomerTableActionsProps {
  customer: Customer;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
}

export function CustomerTableActions({ customer, onView, onEdit }: CustomerTableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onView(customer)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onEdit(customer)}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
}
