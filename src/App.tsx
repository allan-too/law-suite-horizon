
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Checkout from "./pages/dashboard/Checkout";

// Dashboard Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import Clients from "./pages/dashboard/Clients";
import IntakeForms from "./pages/dashboard/IntakeForms";
import Documents from "./pages/dashboard/Documents";
import Contracts from "./pages/dashboard/Contracts";
import Billing from "./pages/dashboard/Billing";
import Settings from "./pages/dashboard/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminPlatform from "./pages/admin/AdminPlatform";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route
                path="/"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Index />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Login />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/signup"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Signup />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <ForgotPassword />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/pricing"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Pricing />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/unauthorized"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Unauthorized />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/checkout"
                element={
                  <Checkout />
                }
              />

              {/* User Protected Routes without Navbar/Footer (uses DashboardLayout) */}
              <Route path="/dashboard" element={<ProtectedRoute requiredRole="user" />}>
                <Route index element={<UserDashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="intake-forms" element={<IntakeForms />} />
                <Route path="documents" element={<Documents />} />
                <Route path="contracts" element={<Contracts />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Admin Protected Routes without Navbar/Footer (uses DashboardLayout) */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="logs" element={<AdminLogs />} />
                <Route path="platform" element={<AdminPlatform />} />
              </Route>

              {/* Catch-all route */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <NotFound />
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
