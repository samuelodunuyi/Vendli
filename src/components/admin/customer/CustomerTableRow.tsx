
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Phone, Mail } from "lucide-react";
import { CustomerTableActions } from "./CustomerTableActions";

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

interface CustomerTableRowProps {
  customer: Customer;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
}

export function CustomerTableRow({ customer, onView, onEdit }: CustomerTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{customer.firstName} {customer.lastName}</div>
          <div className="text-sm text-muted-foreground">{customer.companyName}</div>
          <div className="text-xs text-muted-foreground">{customer.preferredStore}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3" />
            {customer.email}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3" />
            {customer.phone}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={customer.classification === 'corporate' ? 'default' : 
                       customer.classification === 'vip' ? 'secondary' : 'outline'}>
          {customer.classification}
        </Badge>
      </TableCell>
      <TableCell>
        <div>
          <Badge variant="outline" className="mb-1">{customer.loyaltyTier}</Badge>
          <div className="text-sm text-muted-foreground">{customer.loyaltyPoints} pts</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">₦{customer.totalSpent.toLocaleString()}</div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{customer.lastTransaction}</div>
      </TableCell>
      <TableCell>
        <Badge variant={customer.kycStatus === 'verified' ? 'default' : 'secondary'}>
          {customer.kycStatus}
        </Badge>
      </TableCell>
      <TableCell>
        <CustomerTableActions 
          customer={customer}
          onView={onView}
          onEdit={onEdit}
        />
      </TableCell>
    </TableRow>
  );
}
