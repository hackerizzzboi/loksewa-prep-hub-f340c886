import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { StatsProvider } from "@/contexts/StatsContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MCQ from "./pages/MCQ";
import Subjective from "./pages/Subjective";
import Syllabus from "./pages/Syllabus";
import Typing from "./pages/Typing";
import Routine from "./pages/Routine";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <StatsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />
                <Route path="/mcq" element={<MCQ />} />
                <Route path="/subjective" element={<Subjective />} />
                <Route path="/syllabus" element={<Syllabus />} />
                <Route path="/typing" element={<Typing />} />
                <Route path="/routine" element={<Routine />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </StatsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
