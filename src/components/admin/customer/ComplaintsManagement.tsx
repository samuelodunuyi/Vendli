
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Phone, MessageSquare, Clock, CheckCircle, Search, Filter, Plus } from "lucide-react";

const mockComplaints = [
  {
    id: "CMP001",
    customerId: "1",
    customerName: "Adebayo Ogundimu",
    subject: "Product Quality Issue",
    description: "Received damaged products in recent order",
    category: "product",
    priority: "high",
    status: "in-progress",
    assignedTo: "Sarah Johnson",
    storeId: "Victoria Island Store",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    callCenterTicketId: "CC-2024-001"
  },
  {
    id: "CMP002",
    customerId: "2",
    customerName: "Fatima Ahmed",
    subject: "Billing Discrepancy",
    description: "Charged incorrect amount on last transaction",
    category: "billing",
    priority: "medium",
    status: "open",
    storeId: "Ikeja Store",
    createdAt: "2024-01-19T15:45:00Z",
    updatedAt: "2024-01-19T15:45:00Z"
  },
  {
    id: "CMP003",
    customerId: "3",
    customerName: "Chidi Okwu",
    subject: "Delivery Delay",
    description: "Order not delivered within promised timeframe",
    category: "delivery",
    priority: "low",
    status: "resolved",
    assignedTo: "Mike Okafor",
    resolvedAt: "2024-01-18T16:20:00Z",
    satisfactionRating: 4,
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-18T16:20:00Z"
  }
];

const complaintMetrics = {
  totalComplaints: 156,
  openComplaints: 23,
  inProgressComplaints: 12,
  resolvedComplaints: 121,
  averageResolutionTime: "2.3 days",
  satisfactionScore: 4.2
};

export function ComplaintsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredComplaints = mockComplaints.filter(complaint => {
    const matchesSearch = complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaintMetrics.totalComplaints}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{complaintMetrics.openComplaints}</div>
            <p className="text-xs text-muted-foreground">{complaintMetrics.inProgressComplaints} in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Complaints</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complaintMetrics.resolvedComplaints}</div>
            <p className="text-xs text-muted-foreground">Avg: {complaintMetrics.averageResolutionTime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaintMetrics.satisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">Customer feedback</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="complaints">Complaints List</TabsTrigger>
          <TabsTrigger value="call-center">Call Center Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Complaint
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Complaints Table */}
          <Card>
            <CardHeader>
              <CardTitle>Complaints ({filteredComplaints.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{complaint.customerName}</div>
                          <div className="text-sm text-muted-foreground">{complaint.storeId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{complaint.subject}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {complaint.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{complaint.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          complaint.priority === 'critical' ? 'destructive' :
                          complaint.priority === 'high' ? 'default' :
                          complaint.priority === 'medium' ? 'secondary' : 'outline'
                        }>
                          {complaint.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          complaint.status === 'resolved' ? 'default' :
                          complaint.status === 'in-progress' ? 'secondary' : 'outline'
                        }>
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{complaint.assignedTo || '-'}</TableCell>
                      <TableCell>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          {complaint.callCenterTicketId && (
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="call-center" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Center Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Integration Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Integrated with customer support platform for seamless ticket management
                    </p>
                    <Button variant="outline" size="sm">Configure Settings</Button>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Call Center Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Ticket CC-2024-001</div>
                          <div className="text-sm text-muted-foreground">Product Quality Issue - Adebayo Ogundimu</div>
                        </div>
                      </div>
                      <Badge>In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Ticket CC-2024-002</div>
                          <div className="text-sm text-muted-foreground">Service Complaint - Grace Emeka</div>
                        </div>
                      </div>
                      <Badge variant="default">Resolved</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
