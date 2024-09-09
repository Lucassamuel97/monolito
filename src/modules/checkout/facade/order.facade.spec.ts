import { Sequelize } from "sequelize-typescript"
import { migrator } from "../../../migrations/config/migrator";
import { ClientModel } from "../../client-adm/repository/client.model";
import { Umzug } from "umzug";
import Product from "../domain/product.entity";
import OrderModel from "../repository/order.model";
import OrderClientModel from "../repository/order-client.model";
import OrderProductModel from "../repository/order-product.model";
import OrderFacadeFactory from "../factory/order.facade.factory";
import ProductStoreModel from "../../store-catalog/repository/product.model";
import { ProductModel } from "../../product-adm/repository/product.model";
import TransactionModel from "../../payment/repository/transaction.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../invoice/repository/invoice_item.model";

describe("Checkout Facade test", () => {

    let sequelize: Sequelize
    let migration: Umzug<any>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        })

        sequelize.addModels([
            OrderModel, 
            ClientModel, 
            OrderClientModel, 
            ProductStoreModel,
            ProductModel,
            OrderProductModel,
            TransactionModel,
            InvoiceModel,
            InvoiceItemModel])

        migration = migrator(sequelize)

        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) return

        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })

    it("should create a Order", async () => {

        const CreateClient = await ClientModel.create({
            id: 'c123',
            name: 'Samuca',
            email: 'samuca@123.com',
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await ProductModel.create({
            id: "p1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await ProductStoreModel.update({
            salesPrice: 100,
        }, {
            where: {
                id: "p1"
            }
        })

        const input = {
            clientId: "c123",
            products: [
                { productId: "p1" }
            ]
        }

        const facade = OrderFacadeFactory.create();

        const output = await facade.placeOrder(input);

        console.log(output)

        expect(output).toBeDefined();
        expect(output.id).toBeDefined();
        expect(output.InvoiceId).toBeDefined();
        expect(output.status).toBeDefined();
        expect(output.total).toEqual(100);
        expect(output.products).toBeDefined();
        expect(output.products.length).toEqual(1);
        expect(output.products[0].productId).toEqual("p1");
    });
});