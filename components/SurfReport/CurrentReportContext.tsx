import { SurfReportRecord } from "@/types/database";
import { SurfReport } from "@/types/noaa";
import { createContext, ReactNode, useContext, useState } from "react";

type CurrentReport = SurfReport | SurfReportRecord;

interface CurrentReportContextType {
  currentReport: CurrentReport | null;
  setCurrentReport: (report: CurrentReport | null) => void;
}

const CurrentReportContext = createContext<
  CurrentReportContextType | undefined
>(undefined);

export function CurrentReportProvider({ children }: { children: ReactNode }) {
  const [currentReport, setCurrentReport] = useState<CurrentReport | null>(
    null
  );

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
