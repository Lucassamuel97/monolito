import express, { Request, Response } from "express";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientRepository from "../repository/client.repository";
import Address from "../../@shared/domain/value-object/address";

export const clientRoute = express.Router()

clientRoute.post("/", async (req: Request, res: Response) => {
    const clientRepository = new ClientRepository();
    const usecase = new AddClientUseCase(clientRepository);

    try {

        const clientDto = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: new Address(
                req.body.street,
                req.body.number,
                req.body.complement,
                req.body.city,
                req.body.state,
                req.body.zipCode
            ),
        };

        const output = await usecase.execute(clientDto);
        res.status(201).send(output)
    } catch (err) {
        res.status(500).send(err);
    }
});