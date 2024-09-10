import express, { Request, Response } from "express";
import OrderFacadeFactory from "../factory/order.facade.factory";

export const orderRoute = express.Router()

const facade = OrderFacadeFactory.create()

orderRoute.post("/", async (req: Request, res: Response) => {
    try {
        const output = await facade.placeOrder(req.body);
        res.status(201).send(output);
    } catch (err) {
        console.error("Error occurred:", err); // Log the error details
        res.status(500).send({ error: "Internal Server Error", details: err });
    }
});