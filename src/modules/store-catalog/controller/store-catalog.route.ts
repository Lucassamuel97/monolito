import express, { Request, Response } from "express";
import ProductRepository from "../repository/product.repository";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import FindAllProductsUsecase from "../usecase/find-all-products/find-all-products.usecase";


export const storeRoute = express.Router()

storeRoute.get("/:id", async (req: Request, res: Response) => {
    
    const usecase = new FindProductUseCase(new ProductRepository);

    try {
        const output = await usecase.execute({ id: req.params.id });

        res.status(200).send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

storeRoute.get("/", async (req: Request, res: Response) => {
    const usecase = new FindAllProductsUsecase(new ProductRepository);

    try {
        const output = await usecase.execute();

        res.status(200).send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});