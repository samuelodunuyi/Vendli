
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { Users, Plus, Edit, Trash2, Search, UserPlus, Phone, Mail } from "lucide-react";

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  joinDate: string;
}

interface ManageStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId?: number;
  storeName?: string;
}

const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Adebayo Ogundimu",
    role: "Store Manager",
    email: "adebayo@company.com",
    phone: "+234 901 234 5678",
    status: "active",
    joinDate: "2020-01-15"
  },
  {
    id: "2",
    name: "Funmi Adesanya",
    role: "Sales Associate",
    email: "funmi@company.com",
    phone: "+234 902 345 6789",
    status: "active",
    joinDate: "2021-03-20"
  },
  {
    id: "3",
    name: "Chidi Okwu",
    role: "Cashier",
    email: "chidi@company.com",
    phone: "+234 903 456 7890",
    status: "active",
    joinDate: "2022-06-10"
  },
  {
    id: "4",
    name: "Blessing Nwosu",
    role: "Inventory Clerk",
    email: "blessing@company.com",
    phone: "+234 904 567 8901",
    status: "inactive",
    joinDate: "2022-08-15"
  }
];

export function ManageStaffDialog({ open, onOpenChange, storeId, storeName }: ManageStaffDialogProps) {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveStaff = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (staffMember) {
      toast.success(`${staffMember.name} removed from staff`);
      setStaff(prev => prev.filter(s => s.id !== staffId));
    }
  };

  const handleToggleStatus = (staffId: string) => {
    setStaff(prev => prev.map(s => 
      s.id === staffId 
        ? { ...s, status: s.status === "active" ? "inactive" : "active" }
        : s
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Store Manager":
        return "bg-purple-100 text-purple-800";
      case "Sales Associate":
        return "bg-blue-100 text-blue-800";
      case "Cashier":
        return "bg-green-100 text-green-800";
      case "Inventory Clerk":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Staff - {storeName || "Store"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Add Controls */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search staff members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Staff
            </Button>
          </div>

          {/* Staff Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{staff.length}</div>
                <div className="text-sm text-gray-600">Total Staff</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {staff.filter(s => s.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {staff.filter(s => s.status === "inactive").length}
                </div>
                <div className="text-sm text-gray-600">Inactive</div>
              </CardContent>
            </Card>
          </div>

          {/* Staff List */}
          <div className="space-y-3">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>
                            {member.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(member.id)}
                      >
                        {member.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveStaff(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No staff members found matching your search.
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
