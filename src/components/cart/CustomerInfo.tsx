
import { Input } from "@/components/ui/input";

interface CustomerInfoProps {
  customerName: string;
  customerPhone: string;
  onCustomerNameChange: (name: string) => void;
  onCustomerPhoneChange: (phone: string) => void;
}

export function CustomerInfo({ 
  customerName, 
  customerPhone, 
  onCustomerNameChange, 
  onCustomerPhoneChange 
}: CustomerInfoProps) {
  return (
    <div className="px-4 py-3 border-t bg-gray-50/50">
      <div className="space-y-2">
        <Input
          placeholder="Customer Name (Optional)"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          className="h-9 text-sm"
        />
        <Input
          placeholder="Customer Phone (Optional)"
          value={customerPhone}
          onChange={(e) => onCustomerPhoneChange(e.target.value)}
          className="h-9 text-sm"
        />
      </div>
    </div>
  );
}
