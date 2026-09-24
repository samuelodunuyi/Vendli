import { useState } from "react";
import { BarChart3, Mail, MapPin, Pencil, Phone, Plus, UserRound } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreFormDialog } from "./store/StoreFormDialog";
import { StoreAnalyticsDialog } from "./store/StoreAnalyticsDialog";
import { CustomerAnalytics } from "./store/CustomerAnalytics";
import { BulkOperations } from "./store/BulkOperations";
import { useGetStoresQuery, type Store } from "@/redux/services/stores.services";
import { useAuth } from "@/hooks/useAuth";
import { formatCompactCurrency } from "@/lib/format";

export function StoreManagement() {
  const { isSuperAdmin } = useAuth();
  const { data, isLoading } = useGetStoresQuery();
  const [editing, setEditing] = useState<Store | "new" | null>(null);
  const [analytics, setAnalytics] = useState<Store | null>(null);
  const stores = data?.stores ?? [];

  const grid = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-56 rounded-lg" />)
        : stores.map((s) => (
            <Card key={s.storeId} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{s.storeName}</CardTitle>
                  <Badge variant={s.isActive ? "secondary" : "destructive"}>{s.isActive ? "Open" : "Closed"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{s.storeType}</p>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 text-sm">
                <p className="text-2xl font-bold">{formatCompactCurrency(s.totalSales)}</p>
                <p className="text-xs text-muted-foreground">lifetime sales</p>
                <p className="flex items-start gap-2 pt-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />{s.storeAddress}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{s.storePhoneNumber}</p>
                <p className="flex items-center gap-2 truncate"><Mail className="h-4 w-4 shrink-0 text-muted-foreground" />{s.storeEmailAddress}</p>
                <p className="flex items-center gap-2"><UserRound className="h-4 w-4 text-muted-foreground" />{s.storeAdmin || "No admin assigned"}</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setAnalytics(s)}><BarChart3 className="mr-2 h-4 w-4" />Analytics</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditing(s)}><Pencil className="mr-2 h-4 w-4" />Edit</Button>
              </CardFooter>
            </Card>
          ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {isSuperAdmin ? (
        <Tabs defaultValue="stores" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="customers">Customer insights</TabsTrigger>
              <TabsTrigger value="bulk">Bulk actions</TabsTrigger>
            </TabsList>
            <Button onClick={() => setEditing("new")}><Plus className="mr-2 h-4 w-4" />Add store</Button>
          </div>
          <TabsContent value="stores">{grid}</TabsContent>
          <TabsContent value="customers"><CustomerAnalytics stores={stores} /></TabsContent>
          <TabsContent value="bulk"><BulkOperations stores={stores} /></TabsContent>
        </Tabs>
      ) : (
        <>
          {grid}
          <CustomerAnalytics stores={stores} />
        </>
      )}

      <StoreFormDialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} store={editing === "new" ? null : editing} />
      <StoreAnalyticsDialog open={!!analytics} onOpenChange={(o) => !o && setAnalytics(null)} storeId={analytics?.storeId} storeName={analytics?.storeName} />
    </div>
  );
}
