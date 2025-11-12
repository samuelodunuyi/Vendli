import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ChakraProvider } from "@chakra-ui/react";

import Index from "./pages/Index";
import Cart from "./pages/Cart";
import POS from "./pages/POS";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import ThemeSettings from "./pages/ThemeSettings";
import NotFound from "./pages/NotFound";
import POSOrders from "./pages/POSOrders";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <ThemeProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/auth" element={<Auth />} />

                <Route
                  path="/pos"
                  element={
                    <ProtectedRoute allowedRoles={[2]}>
                      <POS />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/POSOrders"
                  element={
                    <ProtectedRoute allowedRoles={[1, 2, 3]}>
                      <POSOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={[0, 1]}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

               <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={[0, 1, 2]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route path="/theme-settings" element={<ThemeSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ChakraProvider>
  </QueryClientProvider>
);

export default App;
