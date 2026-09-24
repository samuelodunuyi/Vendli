import { useState } from "react";
import { Download, Eye, Pencil, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pager } from "@/components/common/Pager";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { useGetCustomersQuery, type Customer } from "@/redux/services/customer.services";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { CUSTOMER_CLASSIFICATION, CUSTOMER_STATUS, LOYALTY_TIER } from "@/lib/enums";
import { formatCurrency, formatDate } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";

const ALL = "all";

function EnumFilter({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{label}</SelectItem>
        {options.map((o, i) => <SelectItem key={o} value={String(i)}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function CustomerList() {
  const [search, setSearch] = useState("");
  const [classification, setClassification] = useState(ALL);
  const [tier, setTier] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [editing, setEditing] = useState<Customer | null>(null);
  const debounced = useDebouncedValue(search);
  const num = (v: string) => (v === ALL ? undefined : Number(v));

  const { data, isFetching } = useGetCustomersQuery({
    page,
    itemsPerPage: 15,
    search: debounced || undefined,
    classification: num(classification),
    loyaltyTier: num(tier),
    status: num(status),
  });
  const customers = data?.customers ?? [];
  const reset = (set: (v: string) => void) => (v: string) => { set(v); setPage(1); };

  const exportCsv = () =>
    downloadCsv(
      "customers.csv",
      ["Name", "Email", "Phone", "Classification", "Tier", "Status", "Total spent", "Points", "Last purchase"],
      customers.map((c) => [`${c.userInfo.firstName} ${c.userInfo.lastName}`, c.userInfo.email, c.userInfo.phoneNumber, CUSTOMER_CLASSIFICATION[c.customerClassification], LOYALTY_TIER[c.loyaltyTier], CUSTOMER_STATUS[c.customerStatus], c.totalSpent, c.loyaltyPoints, c.lastTransactionDate])
    );

  const actions = (c: Customer) => (
    <div className="flex">
      <Button variant="ghost" size="icon" onClick={() => setViewing(c)} aria-label="View customer"><Eye className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={() => setEditing(c)} aria-label="Edit customer"><Pencil className="h-4 w-4" /></Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search name, email, phone or company…" className="pl-9" value={search} onChange={(e) => reset(setSearch)(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <EnumFilter label="All types" options={CUSTOMER_CLASSIFICATION} value={classification} onChange={reset(setClassification)} />
          <EnumFilter label="All tiers" options={LOYALTY_TIER} value={tier} onChange={reset(setTier)} />
          <EnumFilter label="All statuses" options={CUSTOMER_STATUS} value={status} onChange={reset(setStatus)} />
          <Button variant="outline" onClick={exportCsv} disabled={!customers.length}><Download className="mr-2 h-4 w-4" />Export</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {isFetching && !data ? (
          <div className="space-y-2 p-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : !customers.length ? (
          <p className="p-10 text-center text-muted-foreground">No customers match your filters.</p>
        ) : (
          <>
            <ul className="divide-y md:hidden">
              {customers.map((c) => (
                <li key={c.id} className="flex items-center gap-2 p-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium">{c.userInfo.firstName} {c.userInfo.lastName}</p>
                    <p className="truncate text-sm text-muted-foreground">{c.userInfo.phoneNumber}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge>{LOYALTY_TIER[c.loyaltyTier]}</Badge>
                      <Badge variant="outline">{formatCurrency(c.totalSpent)}</Badge>
                    </div>
                  </div>
                  {actions(c)}
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Total spent</TableHead>
                    <TableHead>Last purchase</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id} className={c.customerStatus === 1 ? undefined : "opacity-60"}>
                      <TableCell>
                        <p className="font-medium">{c.userInfo.firstName} {c.userInfo.lastName}</p>
                        {c.companyName && <p className="text-xs text-muted-foreground">{c.companyName}</p>}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{c.userInfo.phoneNumber}</p>
                        <p className="max-w-[220px] truncate text-xs text-muted-foreground">{c.userInfo.email}</p>
                      </TableCell>
                      <TableCell><Badge variant="outline">{CUSTOMER_CLASSIFICATION[c.customerClassification]}</Badge></TableCell>
                      <TableCell><Badge variant={c.loyaltyTier >= 2 ? "default" : "secondary"}>{LOYALTY_TIER[c.loyaltyTier]}</Badge></TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatCurrency(c.totalSpent)}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(c.lastTransactionDate)}</TableCell>
                      <TableCell>{actions(c)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        <Pager page={page} totalPages={data?.pagination.totalPages ?? 1} totalItems={data?.pagination.totalItems} onPageChange={setPage} />
      </Card>

      <CustomerDetailsDialog customer={viewing} onOpenChange={(o) => !o && setViewing(null)} />
      <CustomerFormDialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)} customer={editing} />
    </div>
  );
}
