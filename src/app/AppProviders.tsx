import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "@/features/settings/context/SettingsContext";
import { DataSourceProvider } from "@/features/data-source/context/DataSourceContext";

const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DataSourceProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </DataSourceProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}


