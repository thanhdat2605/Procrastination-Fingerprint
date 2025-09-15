import { createContext, useContext, useState, type PropsWithChildren } from "react";

type DataSourceMode = "api" | "demo";

type DataSourceContextValue = {
  mode: DataSourceMode;
  setMode: (m: DataSourceMode) => void;
  toggle: () => void;
};

const DataSourceContext = createContext<DataSourceContextValue | undefined>(undefined);

export function DataSourceProvider({ children }: PropsWithChildren) {
  const [mode, setModeInternal] = useState<DataSourceMode>("api");
  const setMode = (m: DataSourceMode) => setModeInternal(m);
  const toggle = () => setModeInternal((prev) => (prev === "api" ? "demo" : "api"));
  return (
    <DataSourceContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource() {
  const ctx = useContext(DataSourceContext);
  if (!ctx) throw new Error("useDataSource must be used within DataSourceProvider");
  return ctx;
}


