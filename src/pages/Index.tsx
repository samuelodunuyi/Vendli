import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Nav } from "@/components/Nav";
import { useAuth } from "@/hooks/useAuth";
import { homePathFor } from "@/lib/roles";

const FEATURES = [
  { icon: MonitorSmartphone, title: "Point of sale", text: "Fast checkout with barcode scanning, discounts and customer loyalty." },
  { icon: BarChart3, title: "Live analytics", text: "Sales, stock and customer insights for every store or the whole network." },
  { icon: ShieldCheck, title: "Role-based access", text: "Super admins, store admins and cashiers each see exactly what they need." },
];

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/60">
      <Nav />
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Run every store from one place</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Vendli brings point of sale, inventory, customers and analytics together for modern retail teams.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to={user ? homePathFor(user.role) : "/auth"}>
            {user ? "Go to my workspace" : "Sign in"} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-6">
                <f.icon className="mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
