import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Nav } from "@/components/Nav";
import { User, Mail, Shield, Store } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/redux/store";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: "",
    roleId: Number(user.role),
    storeId: user.storeId,
  });

  const stores = [
    { storeId: 1, storeName: "Downtown Branch" },
    { storeId: 2, storeName: "City Mall Outlet" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // simulate update request
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Nav />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Profile</h2>

        <Card className="rounded-2xl shadow-md border border-gray-100 w-full">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center space-x-3">
              <User className="text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="text-blue-600" />
              <p className="text-gray-700">{user.email}</p>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="text-blue-600" />
              <p className="text-gray-700">
                Role:{" "}
                {["Super Admin", "Store Admin", "Employee", "Customer"][
                  Number(user.role)
                ] || "Unknown"}
              </p>
            </div>

            {user.storeName && (
              <div className="flex items-center space-x-3">
                <Store className="text-blue-600" />
                <p className="text-gray-700">
                  {user.storeName} (ID: {user.storeId})
                </p>
              </div>
            )}

            <div className="pt-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    Edit Profile
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-lg rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phoneNumber: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData?.roleId?.toString() || ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            roleId: Number(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">Customer</SelectItem>
                          <SelectItem value="2">Employee</SelectItem>
                          <SelectItem value="1">Store Admin</SelectItem>
                          <SelectItem value="0">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="store">Store</Label>
                      <Select
                        value={formData?.storeId?.toString() || ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            storeId: Number(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem
                              key={store.storeId}
                              value={store.storeId.toString()}
                            >
                              {store.storeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? "Updating..." : "Update Profile"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
