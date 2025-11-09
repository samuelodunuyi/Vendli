import { useGetCustomersQuery } from "@/redux/services/customer.services";

interface CustomerInfoProps {
  selectedCustomerId: number | null;
  onCustomerSelect: (id: number) => void;
}

export function CustomerInfo({ selectedCustomerId, onCustomerSelect }: CustomerInfoProps) {
  const { data: customers, isLoading } = useGetCustomersQuery({});

  return (
    <div className="px-4 py-3 border-t bg-gray-50/50">
      <select
        value={selectedCustomerId || ""}
        onChange={(e) => onCustomerSelect(Number(e.target.value))}
        disabled={isLoading}
        className="h-9 w-full text-sm border rounded"
      >
        <option value="">Select Customer</option>
        {customers?.customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.userInfo.firstName} {customer.userInfo.lastName} ({customer.userInfo.phoneNumber || "N/A"})
          </option>
        ))}
      </select>
    </div>
  );
}
