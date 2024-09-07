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
        
        const order = new Order({
            client: new Client({
                name: "John Doe",
                email: "john@example.com",
                address: "123 Main St",
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
    
        const model = await OrderModel.findOne({
          where: { id: order.id.id },
          include: [
            { model: OrderClientModel, as: "client" },
            { model: OrderProductModel, as: "products" },
          ],
        });

        console.log(model);
        expect(model).toBeDefined();
    });

});