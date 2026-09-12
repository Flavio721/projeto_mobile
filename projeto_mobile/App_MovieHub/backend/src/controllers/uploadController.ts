import { Request, Response } from 'express';

const uploadImagem = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    // req.protocol/req.get('host') montam a URL a partir da própria requisição,
    // então funciona tanto com localhost quanto com o IP da máquina na rede —
    // não precisa hardcodar o endereço aqui.
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    return res.status(201).json({ url });
};

export { uploadImagem };