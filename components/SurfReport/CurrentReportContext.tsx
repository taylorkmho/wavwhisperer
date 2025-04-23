import { SurfReport } from "@/types/noaa";
import { createContext, ReactNode, useContext, useState } from "react";

interface CurrentReportContextType {
  currentReport: SurfReport | null;
  setCurrentReport: (report: SurfReport | null) => void;
}

const CurrentReportContext = createContext<
  CurrentReportContextType | undefined
>(undefined);

export function CurrentReportProvider({ children }: { children: ReactNode }) {
  const [currentReport, setCurrentReport] = useState<SurfReport | null>(null);

  return (
    <CurrentReportContext.Provider value={{ currentReport, setCurrentReport }}>
      {children}
    </CurrentReportContext.Provider>
  );
}

export function useCurrentReport() {
  const context = useContext(CurrentReportContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentReport must be used within a CurrentReportProvider"
    );
  }
  return context;
}
