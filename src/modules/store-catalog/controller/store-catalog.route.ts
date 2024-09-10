import express, { Request, Response } from "express";
import ProductRepository from "../repository/product.repository";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import FindAllProductsUsecase from "../usecase/find-all-products/find-all-products.usecase";
import UpdateSalesPriceUseCase from "../usecase/update-sales-price/update-sales-price.usecase";


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

storeRoute.put("/sales-price/:id", async (req: Request, res: Response) => {
    const usecase = new UpdateSalesPriceUseCase(new ProductRepository);
    try {
        const productDto = {
            id: req.params.id,
            salesPrice: req.body.salesPrice
        };
        const output = await usecase.execute(productDto);
        res.status(204).send(output);

    }catch (err) {
        res.status(500).send(err);
    }
});