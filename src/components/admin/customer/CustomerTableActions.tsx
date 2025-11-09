
import { Button } from "@/components/ui/button";
import { Customer } from "@/redux/services/customer.services";
import { Eye, Edit } from "lucide-react";

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
