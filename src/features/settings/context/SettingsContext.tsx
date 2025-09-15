import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { Settings } from "@/types";
import { defaultSettings } from "@/lib/demo-data";

type SettingsContextValue = {
  settings: Settings;
  setSettings: (s: Settings) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}


