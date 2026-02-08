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
import ComponentShowcase from "./pages/ComponentShowcase";
import TestVideo from "./pages/TestVideo";
import Resources from "./pages/Resources";
import VideoCreationWizard from "./pages/VideoCreationWizard";
import SimpleVideoCreator from "./pages/SimpleVideoCreator";
import UltimateShowcase from "./pages/UltimateShowcase";
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
          <Route path="/showcase" element={<ComponentShowcase />} />
          <Route path="/animation-showcase" element={<AnimationShowcase />} />
          <Route path="/test-video" element={<TestVideo />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/wizard" element={<VideoCreationWizard />} />
          <Route path="/simple-create" element={<SimpleVideoCreator />} />
          <Route path="/ultimate-showcase" element={<UltimateShowcase />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
