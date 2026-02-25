import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { lazy, Suspense } from "react";
import { FullPageSpinner } from "./components/ui/spinner";
// import Index from "./pages/Index";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const Users = lazy(() => import("./pages/dashboard/Users"));
const Projects = lazy(() => import("./pages/dashboard/Projects"));
const CmsData = lazy(() => import("./pages/dashboard/CmsData"));
const Skills = lazy(() => import("./pages/dashboard/Skills"));
const Experience = lazy(() => import("./pages/dashboard/Experience"));
const Technologies = lazy(() => import("./pages/dashboard/Technologies"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<FullPageSpinner />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardOverview />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardOverview />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              /> */}
                <Route
                  path="/dashboard/users"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Users />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/cms"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <CmsData />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/projects"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Projects />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/skills"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Skills />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/experience"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Experience />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/technologies"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Technologies />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              /> */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
