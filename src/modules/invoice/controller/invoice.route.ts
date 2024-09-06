import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

export const invoiceRoute = express.Router()

const facade = InvoiceFacadeFactory.create()

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
    console.log("Received ID:", req.params.id);
    try {
        const output = await facade.find({ id: req.params.id });
        console.log("Output:", output);
        res.status(200).send(output);
    } catch (err) {
        console.error("Error occurred:", err); // Log the error details
        res.status(500).send({ error: "Internal Server Error", details: err });
    }
});