import { Sequelize } from "sequelize-typescript";
import ProductStoreModel from "./product.model";
import ProductRepository from "./product.repository";
import ProductStore from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ProductRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductStoreModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find all products", async () => {
        await ProductStoreModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
        });

        await ProductStoreModel.create({
            id: "2",
            name: "Product 2",
            description: "Description 2",
            salesPrice: 200,
        });

        const productRepository = new ProductRepository();
        const products = await productRepository.findAll();

        expect(products.length).toBe(2);
        expect(products[0].id.id).toBe("1");
        expect(products[0].name).toBe("Product 1");
        expect(products[0].description).toBe("Description 1");
        expect(products[0].salesPrice).toBe(100);
        expect(products[1].id.id).toBe("2");
        expect(products[1].name).toBe("Product 2");
        expect(products[1].description).toBe("Description 2");
        expect(products[1].salesPrice).toBe(200);
    });

    it("should find a product", async () => {
        await ProductStoreModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
        });

        const productRepository = new ProductRepository();
        const product = await productRepository.find("1");

        expect(product.id.id).toBe("1");
        expect(product.name).toBe("Product 1");
        expect(product.description).toBe("Description 1");
        expect(product.salesPrice).toBe(100);
    });

    it("should update a product", async () => {
        await ProductStoreModel.create({
            id: "p1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
        });

        const productRepository = new ProductRepository();
        
        const updateProduct = new ProductStore({
            id: new Id("p1"),
            name: "Product 2",
            description: "Description 2",
            salesPrice: 200,
        });

        await productRepository.update(updateProduct);

        const productDb = await ProductStoreModel.findOne({
            where: { id: "p1" },
        });

        const product = productDb.toJSON();

        expect(product.id).toBe("p1");
        expect(product.name).toBe("Product 2");
        expect(product.description).toBe("Description 2");
        expect(product.salesPrice).toBe(200);
    });

});
