
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { EditCustomerDialog } from "./EditCustomerDialog";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { CustomerFilters } from "./CustomerFilters";
import { CustomerTableRow } from "./CustomerTableRow";
import { mockCustomers } from "./mockCustomersData";
import { toast } from "@/components/ui/sonner";

export function CustomerList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customers, setCustomers] = useState(mockCustomers);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassification = classificationFilter === "all" || customer.classification === classificationFilter;
    const matchesStore = storeFilter === "all" || customer.preferredStore === storeFilter;
    
    return matchesSearch && matchesClassification && matchesStore;
  });

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetailsDialog(true);
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setShowEditDialog(true);
  };

  const handleCustomerAdded = () => {
    toast.success("Customer list refreshed");
  };

  const handleCustomerUpdated = () => {
    toast.success("Customer list refreshed");
  };

  const handleExport = () => {
    toast.success("Customer data exported successfully");
  };

  return (
    <div className="space-y-6">
      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        classificationFilter={classificationFilter}
        onClassificationChange={setClassificationFilter}
        storeFilter={storeFilter}
        onStoreChange={setStoreFilter}
        onAddCustomer={() => setShowAddDialog(true)}
        onExport={handleExport}
      />

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory ({filteredCustomers.length} customers)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Loyalty</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Transaction</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  onView={handleViewCustomer}
                  onEdit={handleEditCustomer}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddCustomerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCustomerAdded={handleCustomerAdded}
      />

      <EditCustomerDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        customer={selectedCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />

      <CustomerDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        customer={selectedCustomer}
      />
    </div>
  );
}
