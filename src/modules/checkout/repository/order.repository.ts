import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderClientModel from "./order-client.model";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";

export default class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {

        console.log(order.client.id.id);

        try {
            await OrderModel.create(
                {
                    id: order.id.id,
                    clientId: order.client.id.id,
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    products: order.products.map((product) => ({
                        id: product.id.id,
                        name: product.name,
                        description: product.description,
                        salesPrice: product.salesPrice,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                    })),
                },
                {
                    include: [{ model: OrderProductModel, as: "products" }],
                }
            );
        } catch (error) {
            console.error("Error adding order:", error);
            throw error;  // Re-lançar o erro para ser tratado em outro lugar se necessário
        }
    }
    async findOrder(id: string): Promise<Order> {

        const orderModelDb = await OrderModel.findOne({
            where: { id },
            include: [
                { model: OrderClientModel, as: "client" },
                { model: OrderProductModel, as: "products" },
              ],
        });

        const orderModel = orderModelDb.toJSON();

        const items: Product[] = orderModel.products.map((product: any) =>
            new Product({
                id: new Id(product.id),
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice
            }),
        );

        return new Order({
            id: new Id(orderModel.id),
            client: new Client({
                id: new Id(orderModel.client.id),
                name: orderModel.client.name,
                email: orderModel.client.email,
                address: orderModel.client.address,
            }),
            status: orderModel.status,
            createdAt: orderModel.createdAt,
            updatedAt: orderModel.updatedAt,
            products: items
        });
    }
}