import Id from "../../@shared/domain/value-object/id.value-object";
import ProductStore from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductStoreModel from "./product.model";

export default class ProductRepository implements ProductGateway {
    async findAll(): Promise<ProductStore[]> {
        const productsDb = await ProductStoreModel.findAll();
        
        const products = productsDb.map((product) => product.toJSON());

        return products.map(
            (product) =>
                new ProductStore({
                    id: new Id(product.id),
                    name: product.name,
                    description: product.description,
                    salesPrice: product.salesPrice,
                })
        );
    }
    async find(id: string): Promise<ProductStore> {
        const productDB = await ProductStoreModel.findOne({
            where: {
                id: id,
            },
        });

        const product = productDB.toJSON();

        return new ProductStore({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        });
    }

    async update(product: ProductStore): Promise<void> {
        try {
        await ProductStoreModel.update(
            {
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            },
            {
                where: {
                    id: product.id.id,
                },
            }
        );
        } catch (error) {
            throw new Error("Product not found");
        }
    }
}
