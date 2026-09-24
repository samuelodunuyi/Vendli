import { Logo } from "@/components/common/Logo";

export function AuthHeader() {
  return (
    <div className="text-center">
      <Logo className="mx-auto mb-4 h-14 w-14" />
      <h1 className="text-2xl font-bold">Vendli</h1>
      <p className="text-muted-foreground">Retail management &amp; point of sale</p>
    </div>
  );
}
