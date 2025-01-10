import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { AssetList } from "@/components/AssetList";
import { AssetForm } from "@/components/AssetForm";
import { InspectionForm } from "@/components/InspectionForm";
import { InspectionList } from "@/components/InspectionList";
import Auth from "@/pages/Auth";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="assets" element={<AssetList />} />
            <Route path="assets/new" element={<AssetForm />} />
            <Route path="assets/:id/edit" element={<AssetForm />} />
            <Route path="assets/:id/inspect" element={<InspectionForm />} />
            <Route path="inspections" element={<InspectionList />} />
            <Route path="reports" element={<div>Reports Page</div>} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;