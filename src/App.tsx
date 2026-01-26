import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analyze from "./pages/Analyze";
import Create from "./pages/Create";
import Patterns from "./pages/Patterns";
import PatternDetail from "./pages/PatternDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Editor from "./pages/Editor";
import AnimationShowcase from "./pages/AnimationShowcase";
import TestVideo from "./pages/TestVideo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/create" element={<Create />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/patterns/:id" element={<PatternDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/showcase" element={<AnimationShowcase />} />
          <Route path="/test-video" element={<TestVideo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
