import axios from "axios";
import { Endereco } from "../types/cep";

export const buscarCep = async (cep: string): Promise<Endereco> => {
    const cepLimpo = cep.replace(/\D/g, "");
    const response = await axios.get<Endereco>(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
    )
    return response.data;
}