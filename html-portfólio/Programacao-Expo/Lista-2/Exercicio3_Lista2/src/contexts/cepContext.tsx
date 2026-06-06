import { createContext, useState, ReactNode } from "react";
import { Endereco } from "../types/cep";

type CepContextType = {
  enderecos: Endereco[];
  setEnderecos: (enderecos: Endereco[]) => void;
  erro: string;
  setErro: (erro: string) => void;
};

export const CepContext = createContext<CepContextType>({} as CepContextType);

export function CepProvider({ children }: { children: ReactNode }){
    const [ enderecos, setEnderecos ] = useState<Endereco[]>([]);
    const [ erro, setErro ] = useState("");

    return(
        <CepContext.Provider value={{ enderecos, setEnderecos, erro, setErro }}>
            {children}
        </CepContext.Provider>
    )
}