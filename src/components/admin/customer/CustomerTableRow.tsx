import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Phone, Mail } from "lucide-react";
import { CustomerTableActions } from "./CustomerTableActions";
import { Customer } from "@/redux/services/customer.services";

// Enum mappings
const LoyaltyTierMap: Record<number, string> = {
  0: "Bronze",
  1: "Silver",
  2: "Gold",
  3: "Platinum",
};

const CustomerClassificationMap: Record<number, string> = {
  0: "Corporate",
  1: "VIP",
  2: "Regular",
  3: "Walk-In",
};

const CustomerStatusMap: Record<number, string> = {
  0: "Inactive",
  1: "Active",
  2: "Suspended",
};

const KYCStatusMap: Record<number, string> = {
  0: "Unverified",
  1: "Pending",
  2: "Verified",
};

interface CustomerTableRowProps {
  customer: Customer;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
}

export function CustomerTableRow({ customer, onView, onEdit }: CustomerTableRowProps) {
  return (
    <TableRow>
      {/* Customer Name + Company */}
      <TableCell>
        <div>
          <div className="font-medium">
            {customer.userInfo.firstName} {customer.userInfo.lastName}
          </div>
          <div className="text-sm text-muted-foreground">{customer.companyName}</div>
          <Badge variant="outline" className="mb-1">
            {LoyaltyTierMap[customer.loyaltyTier]}
          </Badge>
        </div>
      </TableCell>

      {/* Contact Info */}
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3" />
            {customer.userInfo.email}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3" />
            {customer.userInfo.phoneNumber}
          </div>
        </div>
      </TableCell>

      {/* Classification */}
      <TableCell>
        <Badge
          variant={
            customer.customerClassification === 1
              ? "secondary"
              : customer.customerClassification === 2
              ? "outline"
              : "default"
          }
        >
          {CustomerClassificationMap[customer.customerClassification]}
        </Badge>
      </TableCell>

      {/* Total Spent */}
      <TableCell>
        <div className="font-medium">
          ₦{customer.totalSpent.toLocaleString()}
        </div>
      </TableCell>

      {/* Last Transaction Date */}
      <TableCell>
        <div className="text-sm">{customer.lastTransactionDate}</div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <CustomerTableActions customer={customer} onView={onView} onEdit={onEdit} />
      </TableCell>
    </TableRow>
  );
}
