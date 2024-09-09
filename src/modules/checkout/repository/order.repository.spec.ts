import { Sequelize } from "sequelize-typescript"
import { migrator } from "../../../migrations/config/migrator";
import OrderModel from "./order.model";
import OrderClientModel from "./order-client.model";
import OrderProductModel from "./order-product.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import { Umzug } from "umzug";
import OrderRepository from "./order.repository";
import Order from "../domain/order.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";

describe("Checkout Repository test", () => {

    let sequelize: Sequelize
    let migration: Umzug<any>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        })

        sequelize.addModels([OrderModel, ClientModel, OrderClientModel, OrderProductModel])

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
        //Criar Cliente para ser referenciado na Order
        const CreateClient = await ClientModel.create({
            id: '123',
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

        const order = new Order({
            client: new Client({
                id: new Id("123"),
                name: "Samuca",
                email: "samuca@123.com",
                address: "Rua 123",
            }),
            products: [
                new Product({
                    id: new Id("p1"),
                    name: "Product 1",
                    description: "This is product 1",
                    salesPrice: 100,
                }),
            ],
            status: "pending",
        });

        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(order);
    
        const orderDb = await OrderModel.findOne({
          where: { id: order.id.id },
          include: [
            { model: OrderClientModel, as: "client" },
            { model: OrderProductModel, as: "products" },
          ],
        });

        const resultOrder = orderDb.toJSON();
        console.log(resultOrder);

        expect(resultOrder).toBeDefined();
        expect(resultOrder.id).toBe(order.id.id);
        expect(resultOrder.status).toBe(order.status);

        expect(resultOrder.clientId).toBe(order.client.id.id);
        expect(resultOrder.client.name).toBe(order.client.name);
        expect(resultOrder.client.email).toBe(order.client.email);

        expect(resultOrder.products).toBeDefined();
        expect(resultOrder.products.length).toBe(1);
        expect(resultOrder.products[0].id).toBe(order.products[0].id.id);
        expect(resultOrder.products[0].name).toBe(order.products[0].name);
        expect(resultOrder.products[0].description).toBe(order.products[0].description);
        expect(resultOrder.products[0].salesPrice).toBe(order.products[0].salesPrice);
    });

    it("should find a Order", async () => {
        //Criar Cliente para ser referenciado na Order
        const CreateClient = await ClientModel.create({
            id: '123',
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

        const order = new Order({
            client: new Client({
                id: new Id("123"),
                name: "Samuca",
                email: "samuca@123.com",
                address: "Rua 123",
            }),
            products: [
                new Product({
                    id: new Id("p1"),
                    name: "Product 1",
                    description: "This is product 1",
                    salesPrice: 100,
                }),
            ],
            status: "pending",
        });

        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(order);
        
        const result = await orderRepository.findOrder(order.id.id);

        console.log(result);

        expect(result).toBeDefined();
        expect(result.id.id).toBe(order.id.id);
        expect(result.status).toBe(order.status);
        expect(result.client.id.id).toBe(order.client.id.id);
        expect(result.client.name).toBe(order.client.name);
        expect(result.client.email).toBe(order.client.email);
        expect(result.products).toBeDefined();
        expect(result.products.length).toBe(1);
        expect(result.products[0].id.id).toBe(order.products[0].id.id);
        expect(result.products[0].name).toBe(order.products[0].name);
        expect(result.products[0].description).toBe(order.products[0].description);
        expect(result.products[0].salesPrice).toBe(order.products[0].salesPrice);
        
    });
});