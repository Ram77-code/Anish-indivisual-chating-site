import { Switch, Route } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { ThemeProvider } from "@/components/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showBadge, setShowBadge] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="chat-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
          {showBadge ? (
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm text-slate-900 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100">
              <span className="font-medium">Made by Anish</span>
              <button
                type="button"
                className="rounded-full border border-transparent px-2 py-0.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                onClick={() => setShowBadge(false)}
                aria-label="Dismiss badge"
              >
                Dismiss
              </button>
            </div>
          ) : null}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
