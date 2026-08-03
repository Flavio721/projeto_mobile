import { useState, useContext } from "react";
import { CepContext } from "../contexts/cepContext";
import { buscarCep } from "../services/cepServices";

export function useCep(){
    const { enderecos, setEnderecos, erro, setErro } = useContext(CepContext);
    const [ carregando, setCarregando ] = useState(false);

    const consultar = async (cep: string) => {
        if(!cep || cep.replace(/\D/g, "").length !== 8){
            setErro("CEP inválido");
            setEnderecos([...enderecos]);
            return;
        }

        try{
            setCarregando(true);
            setErro("");
            const data = await buscarCep(cep);

            if(data.erro){
                setErro("CEP não encontrado");
                setEnderecos([...enderecos]);
            }else {
                setEnderecos([...enderecos, data]);
            }
        }catch {
            setErro("Erro ao buscar CEP");
            setEnderecos([...enderecos]);
        }finally {
            setCarregando(false);
        }
    };

    return { enderecos, erro, carregando, consultar };
}