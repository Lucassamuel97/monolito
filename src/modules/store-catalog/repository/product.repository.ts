import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
    async findAll(): Promise<Product[]> {
        const productsDb = await ProductModel.findAll();
        
        const products = productsDb.map((product) => product.toJSON());

        return products.map(
            (product) =>
                new Product({
                    id: new Id(product.id),
                    name: product.name,
                    description: product.description,
                    salesPrice: product.salesPrice,
                })
        );
    }
    async find(id: string): Promise<Product> {
        const productDB = await ProductModel.findOne({
            where: {
                id: id,
            },
        });

        const product = productDB.toJSON();

        return new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        });
    }
}
