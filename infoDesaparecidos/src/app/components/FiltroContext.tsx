"use client"
import { createContext, useContext, useState } from "react";

interface FiltroContextType {
  mostrarFiltros: boolean;
  alternarFiltros: () => void;
}

const FiltroContext = createContext<FiltroContextType>({
  mostrarFiltros: false,
  alternarFiltros: () => {},
});

export const useFiltro = () => useContext(FiltroContext);

export function FiltroProvider({ children }: { children: React.ReactNode }) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const alternarFiltros = () => {
    setMostrarFiltros((prev) => !prev);
  };

  return (
    <FiltroContext.Provider value={{ mostrarFiltros, alternarFiltros }}>
      {children}
    </FiltroContext.Provider>
  );
}
