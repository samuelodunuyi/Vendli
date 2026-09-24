import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageLoader } from "@/components/common/PageLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { lazyWithReload as lazy } from "@/lib/lazy";
import { ADMIN_ROLES, POS_ROLES, STAFF_ROLES } from "@/lib/roles";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const POS = lazy(() => import("./pages/POS"));
const POSOrders = lazy(() => import("./pages/POSOrders"));
const Admin = lazy(() => import("./pages/Admin"));
const Profile = lazy(() => import("./pages/Profile"));
const ThemeSettings = lazy(() => import("./pages/ThemeSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));

function AppRoutes() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary resetKey={pathname}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          <Route element={<ProtectedRoute roles={POS_ROLES} />}>
            <Route path="/pos" element={<POS />} />
            <Route path="/pos/orders" element={<POSOrders />} />
          </Route>
          <Route path="/POS" element={<Navigate to="/pos" replace />} />
          <Route path="/POSOrders" element={<Navigate to="/pos/orders" replace />} />

          <Route element={<ProtectedRoute roles={ADMIN_ROLES} />}>
            <Route path="/admin/:section?" element={<Admin />} />
          </Route>

          <Route element={<ProtectedRoute roles={STAFF_ROLES} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/theme-settings" element={<ThemeSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors closeButton />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
