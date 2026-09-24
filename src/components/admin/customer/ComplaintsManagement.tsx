import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Loader, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { FormField } from "@/components/common/FormField";
import { StoreSelect } from "@/components/common/StoreSelect";
import {
  useCreateComplaintMutation,
  useGetComplaintsQuery,
  useGetCustomersQuery,
  useUpdateComplaintMutation,
  type Complaint,
} from "@/redux/services/customer.services";
import { useGetUsersQuery } from "@/redux/services/user.services";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { COMPLAINT_PRIORITY, COMPLAINT_STATUS } from "@/lib/enums";
import { formatDate, formatDateTime } from "@/lib/format";
import { apiErrorMessage } from "@/lib/errors";

const ALL = "all";
const PRIORITY_VARIANT = ["outline", "secondary", "default", "destructive"] as const;
const STATUS_VARIANT = ["destructive", "secondary", "default", "outline"] as const;

export function ComplaintsManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [editing, setEditing] = useState<Complaint | "new" | null>(null);
  const debounced = useDebouncedValue(search);

  const { data, isFetching } = useGetComplaintsQuery({
    itemsPerPage: 100,
    search: debounced || undefined,
    status: status === ALL ? undefined : status,
    priority: priority === ALL ? undefined : priority,
  });
  // Unfiltered totals for the tiles.
  const { data: all } = useGetComplaintsQuery({ itemsPerPage: 500 });
  const count = (s: number) => all?.complaints.filter((c) => c.status === s).length ?? 0;
  const complaints = data?.complaints ?? [];

  const badges = (c: Complaint) => (
    <>
      <Badge variant={PRIORITY_VARIANT[c.priority]}>{COMPLAINT_PRIORITY[c.priority]}</Badge>
      <Badge variant={STATUS_VARIANT[c.status]}>{COMPLAINT_STATUS[c.status]}</Badge>
    </>
  );

  return (
    <div className="space-y-4">
      <StatGrid>
        <StatCard label="Open" value={count(0)} icon={AlertCircle} tone="danger" loading={!all} />
        <StatCard label="In progress" value={count(1)} icon={Loader} tone="warning" loading={!all} />
        <StatCard label="Resolved" value={count(2)} icon={CheckCircle2} tone="success" loading={!all} />
        <StatCard label="Closed" value={count(3)} icon={Clock} loading={!all} />
      </StatGrid>

      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search complaints…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {COMPLAINT_STATUS.map((l, i) => <SelectItem key={l} value={String(i)}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All priorities</SelectItem>
              {COMPLAINT_PRIORITY.map((l, i) => <SelectItem key={l} value={String(i)}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setEditing("new")}><Plus className="mr-2 h-4 w-4" />Log complaint</Button>
      </div>

      <Card className="overflow-hidden">
        {isFetching && !data ? (
          <div className="space-y-2 p-4">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : !complaints.length ? (
          <p className="p-10 text-center text-muted-foreground">No complaints match your filters.</p>
        ) : (
          <>
            <ul className="divide-y md:hidden">
              {complaints.map((c) => (
                <li key={c.id}>
                  <button className="w-full space-y-1.5 p-4 text-left hover:bg-muted/50" onClick={() => setEditing(c)}>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-sm text-muted-foreground">{c.customer.firstName} {c.customer.lastName} · {c.store.storeName} · {formatDate(c.createdAt)}</p>
                    <div className="flex gap-1.5">{badges(c)}</div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Priority / status</TableHead>
                    <TableHead>Assigned to</TableHead>
                    <TableHead>Logged</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="max-w-xs">
                        <p className="font-medium">{c.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{c.complaintText}</p>
                      </TableCell>
                      <TableCell>
                        <p>{c.customer.firstName} {c.customer.lastName}</p>
                        <p className="text-xs text-muted-foreground">{c.store.storeName}</p>
                      </TableCell>
                      <TableCell><div className="flex flex-wrap gap-1">{badges(c)}</div></TableCell>
                      <TableCell className="text-muted-foreground">{c.assignedTo ? `${c.assignedTo.firstName} ${c.assignedTo.lastName}` : "Unassigned"}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
                      <TableCell><Button size="sm" variant="outline" onClick={() => setEditing(c)}>Open</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Card>

      <ComplaintDialog complaint={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

const EMPTY = { customerId: "", storeId: undefined as number | undefined, title: "", complaintText: "", priority: 1, status: 0, assignedToUserId: "" };

function ComplaintDialog({ complaint, onClose }: { complaint: Complaint | "new" | null; onClose: () => void }) {
  const { user } = useAuth();
  const open = complaint !== null;
  const existing = complaint && complaint !== "new" ? complaint : null;
  const [form, setForm] = useState(EMPTY);
  const { data: customers } = useGetCustomersQuery({ itemsPerPage: 500 }, { skip: !open || !!existing });
  const { data: staff } = useGetUsersQuery({ itemsPerPage: 200, storeId: form.storeId }, { skip: !open });
  const [create, createState] = useCreateComplaintMutation();
  const [update, updateState] = useUpdateComplaintMutation();
  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!open) return;
    setForm(
      existing
        ? { customerId: String(existing.customer.id), storeId: existing.store.storeId, title: existing.title, complaintText: existing.complaintText, priority: existing.priority, status: existing.status, assignedToUserId: existing.assignedTo ? String(existing.assignedTo.id) : "" }
        : { ...EMPTY, storeId: user?.storeId ?? undefined }
    );
  }, [open, existing, user?.storeId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const assignedToUserId = form.assignedToUserId ? Number(form.assignedToUserId) : undefined;
    try {
      if (existing) {
        await update({ id: existing.id, data: { title: form.title, complaintText: form.complaintText, priority: form.priority, status: form.status, assignedToUserId } }).unwrap();
        toast.success("Complaint updated");
      } else {
        if (!form.customerId || !form.storeId) return toast.error("Choose a customer and store");
        await create({ customerId: Number(form.customerId), storeId: form.storeId, title: form.title, complaintText: form.complaintText, priority: form.priority, assignedToUserId }).unwrap();
        toast.success("Complaint logged");
      }
      onClose();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save complaint"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{existing ? existing.title : "Log complaint"}</DialogTitle>
          {existing && (
            <DialogDescription>
              {existing.customer.firstName} {existing.customer.lastName} · {existing.store.storeName} · logged {formatDateTime(existing.createdAt)}
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {!existing && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField id="customer" label="Customer *">
                <Select value={form.customerId} onValueChange={(v) => set("customerId", v)}>
                  <SelectTrigger id="customer"><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {customers?.customers.map((c) => <SelectItem key={c.id} value={String(c.userId)}>{c.userInfo.firstName} {c.userInfo.lastName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField id="store" label="Store *">
                <StoreSelect id="store" allowAll={false} className="sm:w-full" value={form.storeId} onChange={(id) => set("storeId", id)} />
              </FormField>
            </div>
          )}
          <FormField id="title" label="Subject *">
            <Input id="title" required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </FormField>
          <FormField id="details" label="Details *">
            <Textarea id="details" required rows={4} value={form.complaintText} onChange={(e) => set("complaintText", e.target.value)} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField id="priority" label="Priority">
              <Select value={String(form.priority)} onValueChange={(v) => set("priority", Number(v))}>
                <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                <SelectContent>{COMPLAINT_PRIORITY.map((l, i) => <SelectItem key={l} value={String(i)}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            {existing && (
              <FormField id="status" label="Status">
                <Select value={String(form.status)} onValueChange={(v) => set("status", Number(v))}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>{COMPLAINT_STATUS.map((l, i) => <SelectItem key={l} value={String(i)}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
            )}
            <FormField id="assignee" label="Assign to" className={existing ? undefined : "sm:col-span-2"}>
              <Select value={form.assignedToUserId} onValueChange={(v) => set("assignedToUserId", v)}>
                <SelectTrigger id="assignee"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  {staff?.users.map((u) => <SelectItem key={u.id} value={String(u.id)}>{u.firstName} {u.lastName}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createState.isLoading || updateState.isLoading}>{existing ? "Save changes" : "Log complaint"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
