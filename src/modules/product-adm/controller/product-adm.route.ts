import express, { Request, Response } from "express";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";


export const productRoute = express.Router()

productRoute.post("/", async (req: Request, res: Response) => {
    const productRepository = new ProductRepository();
    const usecase = new AddProductUseCase(productRepository);

    try {

        const productDto = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        };

        const output = await usecase.execute(productDto);

        res.status(201).send(output)
    
    }catch (err) {
        res.status(500).send(err);
    }
});


productRoute.get("/:id", async (req: Request, res: Response) => {
    const usecase = new CheckStockUseCase(new ProductRepository);

    try {
        const output = await usecase.execute({ productId: req.params.id });

        res.status(200).send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});