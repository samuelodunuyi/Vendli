import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { EditCustomerDialog } from "./EditCustomerDialog";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { CustomerFilters } from "./CustomerFilters";
import { CustomerTableRow } from "./CustomerTableRow";
import { toast } from "@/components/ui/sonner";
import { Pagination, Customer } from "@/redux/services/customer.services";
import { Store } from "@/redux/services/stores.services";

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
  pagination?: Pagination;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  classification: number | undefined;
  setClassification: React.Dispatch<React.SetStateAction<number | undefined>>;
  loyaltyTier: number | undefined;
  setLoyaltyTier: React.Dispatch<React.SetStateAction<number | undefined>>;
  status: number | undefined;
  setStatus: React.Dispatch<React.SetStateAction<number | undefined>>;
  storeData: Store[];
  refetch: () => void;
}

export function CustomerList({
  customers,
  isLoading,
  pagination,
  searchQuery,
  setSearchQuery,
  classification,
  setClassification,
  loyaltyTier,
  setLoyaltyTier,
  status,
  setStatus,
  storeData,
  refetch,
}: CustomerListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      `${customer.userInfo.firstName} ${customer.userInfo.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      customer.userInfo.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesClassification =
      classification === undefined ||
      customer.customerClassification === classification;

    const matchesLoyalty =
      loyaltyTier === undefined || customer.loyaltyTier === loyaltyTier;

    const matchesStatus =
      status === undefined || customer.customerStatus === status;

    return (
      matchesSearch && matchesClassification && matchesLoyalty && matchesStatus
    );
  });

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditDialog(true);
  };

  const handleCustomerAdded = () => {
    refetch();
  };

  const handleCustomerUpdated = () => {
    toast.success("Customer list refreshed");
    refetch();
  };

  const handleExport = () => {
    toast.success("Customer data exported successfully");
  };

  return (
    <div className="space-y-6">
      <CustomerFilters
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        classificationFilter={classification?.toString() ?? "all"}
        onClassificationChange={(value) =>
          setClassification(value === "all" ? undefined : Number(value))
        }
        storeFilter="all"
        onStoreChange={() => {}}
        storeData={storeData}
        onAddCustomer={() => setShowAddDialog(true)}
        onExport={handleExport}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Customer Directory{" "}
            {isLoading
              ? "(Loading...)"
              : `(${filteredCustomers.length} customers)`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Transaction</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <CustomerTableRow
                    key={customer.id}
                    customer={customer}
                    onView={handleViewCustomer}
                    onEdit={handleEditCustomer}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddCustomerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCustomerAdded={handleCustomerAdded}
        storeData={storeData}
      />

      <EditCustomerDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        customer={selectedCustomer}
        onCustomerUpdated={handleCustomerUpdated}
        storeData={storeData}
      />

      <CustomerDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        customer={selectedCustomer}
      />
    </div>
  );
}
