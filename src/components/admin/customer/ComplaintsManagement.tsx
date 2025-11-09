/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useGetComplaintsQuery,
  useCreateComplaintMutation,
  useUpdateComplaintMutation,
  UpdateComplaintRequest
} from "@/redux/services/customer.services";
import { useGetStoresQuery } from "@/redux/services/stores.services";
import { useGetUsersQuery } from "@/redux/services/user.services";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  MessageSquare,
  Search,
  Plus,
  Phone,
} from "lucide-react";
import { Label } from "@/components/ui/label";

// Priority and Status mapping
const priorityLabels = ["Low", "Medium", "High", "Critical"];
const priorityVariants = [
  "outline",
  "secondary",
  "default",
  "destructive",
] as const;
const statusLabels = ["Open", "In Progress", "Resolved", "Closed"];
const statusVariants = [
  "outline",
  "secondary",
  "default",
  "destructive",
] as const;

export function ComplaintsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewingComplaint, setViewingComplaint] = useState<any | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
 const [updateComplaintData, setUpdateComplaintData] = useState<UpdateComplaintRequest>({});
const [complaintToUpdate, setComplaintToUpdate] = useState<any | null>(null);

  const [newComplaint, setNewComplaint] = useState({
    customerId: "",
    title: "",
    complaintText: "",
    storeId: null,
    priority: 0,
    assignedToUserId: 0,
  });

  // Fetch complaints
  const { data, isLoading, isError, refetch } = useGetComplaintsQuery({
    page: 1,
    itemsPerPage: 50,
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    priority: priorityFilter !== "all" ? priorityFilter : undefined,
  });

  const { data: storesData } = useGetStoresQuery();
  const { data: usersData } = useGetUsersQuery({});
  const [updateComplaint, { isLoading: isUpdating }] = useUpdateComplaintMutation();
  const customerData = usersData?.users?.filter((o) => o.role == "Customer");
  const [createComplaint, { isLoading: isCreating }] =
    useCreateComplaintMutation();

  const complaints = data?.complaints || [];
  const totalComplaints = data?.pagination?.totalItems || 0;

  const handleCreateComplaint = async () => {
const payload = {
  customerId: Number(newComplaint.customerId),
  title: newComplaint.title,
  complaintText: newComplaint.complaintText,
  storeId: Number(newComplaint.storeId),
  priority: Number(newComplaint.priority),
  assignedToUserId: Number(newComplaint.assignedToUserId),
};

console.log("Payload being sent to API:", payload);

try {
  await createComplaint(payload).unwrap();
  setAddDialogOpen(false);
  setNewComplaint({
    customerId: "",
    title: "",
    complaintText: "",
    storeId: null,
    priority: 0,
    assignedToUserId: 0
  });
  refetch();
} catch (err) {
  console.error("Failed to create complaint", err);
}

  };

const handleOpenUpdateDialog = (complaint: any) => {
  setComplaintToUpdate(complaint);
  setUpdateComplaintData({
    title: complaint.title,
    complaintText: complaint.complaintText,
    priority: complaint.priority,
    status: complaint.status,
    assignedToUserId: complaint.assignedTo.id,
  });
  setUpdateDialogOpen(true);
};

const handleUpdateComplaint = async () => {
  if (!complaintToUpdate) return;
  try {
    await updateComplaint({
      id: complaintToUpdate.id,
      data: updateComplaintData,
    }).unwrap();
    setUpdateDialogOpen(false);
    setComplaintToUpdate(null);
    refetch();
  } catch (err) {
    console.error("Failed to update complaint", err);
  }
};

  if (isLoading) return <p>Loading complaints...</p>;
  if (isError) return <p>Error loading complaints</p>;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Complaints
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Open Complaints
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {complaints.filter((c) => c.status === 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Complaints
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {complaints.filter((c) => c.status === 2).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfaction Score
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="complaints">Complaints List</TabsTrigger>
          <TabsTrigger value="call-center">Call Center Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints" className="space-y-4">
          {/* Filters & Add Button */}
          <Card>
            <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusLabels.map((label, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {priorityLabels.map((label, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Add Complaint Dialog */}
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> New Complaint
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Complaint</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Select
                      value={newComplaint.customerId}
                      onValueChange={(val) =>
                        setNewComplaint({ ...newComplaint, customerId: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerData?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Title"
                      value={newComplaint.title}
                      onChange={(e) =>
                        setNewComplaint({
                          ...newComplaint,
                          title: e.target.value,
                        })
                      }
                    />

                    <textarea
                      placeholder="Complaint Text"
                      className="w-full border rounded-md p-2"
                      value={newComplaint.complaintText}
                      onChange={(e) =>
                        setNewComplaint({
                          ...newComplaint,
                          complaintText: e.target.value,
                        })
                      }
                    />

                    <Select
                      value={newComplaint.storeId}
                      onValueChange={(val) =>
                        setNewComplaint({ ...newComplaint, storeId: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Store" />
                      </SelectTrigger>
                      <SelectContent>
                        {storesData?.stores.map((store) => (
                          <SelectItem
                            key={store.storeId}
                            value={store.storeId.toString()}
                          >
                            {store.storeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={newComplaint.priority.toString()}
                      onValueChange={(val) =>
                        setNewComplaint({
                          ...newComplaint,
                          priority: Number(val),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityLabels.map((label, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={newComplaint.assignedToUserId.toString()}
                      onValueChange={(val) =>
                        setNewComplaint({
                          ...newComplaint,
                          assignedToUserId: Number(val),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Assign To User" />
                      </SelectTrigger>
<SelectContent>
  {usersData?.users
    .filter(user => user.role !== "Customer")
    .map(user => (
      <SelectItem key={user.id} value={user.id.toString()}>
        {user.firstName} {user.lastName}
      </SelectItem>
    ))}
</SelectContent>

                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleCreateComplaint}
                      disabled={isCreating}
                    >
                      {isCreating ? "Creating..." : "Create Complaint"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>


              {/* Update Complaint Dialog */}
<Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Update Complaint</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={updateComplaintData.title || ""}
          onChange={(e) =>
            setUpdateComplaintData({
              ...updateComplaintData,
              title: e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>Complaint Text</Label>
        <textarea
          style={{ height: "100px" }}
          className="w-full border rounded-md p-2"
          value={updateComplaintData.complaintText || ""}
          onChange={(e) =>
            setUpdateComplaintData({
              ...updateComplaintData,
              complaintText: e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>Priority</Label>
        <Select
          value={updateComplaintData.priority?.toString() || ""}
          onValueChange={(val) =>
            setUpdateComplaintData({
              ...updateComplaintData,
              priority: Number(val),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityLabels.map((label, idx) => (
              <SelectItem key={idx} value={idx.toString()}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Status</Label>
        <Select
          value={updateComplaintData.status?.toString() || ""}
          onValueChange={(val) =>
            setUpdateComplaintData({
              ...updateComplaintData,
              status: Number(val),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {statusLabels.map((label, idx) => (
              <SelectItem key={idx} value={idx.toString()}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Assign To User</Label>
        <Select
          value={updateComplaintData.assignedToUserId?.toString() || ""}
          onValueChange={(val) =>
            setUpdateComplaintData({
              ...updateComplaintData,
              assignedToUserId: Number(val),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Assign To User" />
          </SelectTrigger>
          <SelectContent>
            {usersData?.users
              .filter((user) => user.role !== "Customer")
              .map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <DialogFooter>
      <Button onClick={handleUpdateComplaint} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Complaint"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
            </CardContent>
          </Card>

          {/* Complaints Table */}
          <Card>
            <CardHeader>
              <CardTitle>Complaints ({complaints.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{`CMP${complaint.id
                        .toString()
                        .padStart(3, "0")}`}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{`${complaint.customer.firstName} ${complaint.customer.lastName}`}</div>
                          <div className="text-sm text-muted-foreground">
                            {complaint.store.storeName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>
                        <Badge variant={priorityVariants[complaint.priority]}>
                          {priorityLabels[complaint.priority]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[complaint.status]}>
                          {statusLabels[complaint.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </TableCell>
<TableCell>
  <div className="flex gap-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setViewingComplaint(complaint)}
    >
      View
    </Button>

    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleOpenUpdateDialog(complaint)}
    >
      Edit
    </Button>
  </div>
</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog
            open={!!viewingComplaint}
            onOpenChange={() => setViewingComplaint(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>View Complaint</DialogTitle>
              </DialogHeader>
              {viewingComplaint && (
                <div className="space-y-2">
                  <p>
                    <strong>Customer:</strong>{" "}
                    {viewingComplaint.customer.firstName}{" "}
                    {viewingComplaint.customer.lastName}
                  </p>
                  <p>
                    <strong>Store:</strong> {viewingComplaint.store.storeName}
                  </p>
                  <p>
                    <strong>Title:</strong> {viewingComplaint.title}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {viewingComplaint.complaintText}
                  </p>
                  <p>
                    <strong>Priority:</strong>{" "}
                    {priorityLabels[viewingComplaint.priority]}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {statusLabels[viewingComplaint.status]}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(viewingComplaint.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setViewingComplaint(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Call Center Tab */}
        <TabsContent value="call-center" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Center Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Integration Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Integrated with customer support platform for seamless
                      ticket management
                    </p>
                    <Button variant="outline" size="sm">
                      Configure Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Create Call Ticket
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Sync Tickets
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Escalate Issue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
