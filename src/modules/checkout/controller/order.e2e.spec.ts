import { app } from "../../infrastructure/api/express";
import request from "supertest";
import { Umzug } from "umzug"
import { migrator } from "../../../migrations/config/migrator";
import { Sequelize } from "sequelize-typescript";
import OrderModel from "../repository/order.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import OrderClientModel from "../repository/order-client.model";
import ProductStoreModel from "../../store-catalog/repository/product.model";
import { ProductModel } from "../../product-adm/repository/product.model";
import OrderProductModel from "../repository/order-product.model";
import TransactionModel from "../../payment/repository/transaction.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../invoice/repository/invoice_item.model";

describe('E2E test for Checkout routes', () => {

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

    const productInput = {
        id: "p1",
        name: "Product 1",
        description: "Description",
        purchasePrice: 100,
        salesPrice: 150,
        stock: 15
    }

    const clientInput = {
        name: "Samuca",
        email: "samuca@gmail.com",
        document: "36456789",
        street: "Street",
        number: "36",
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "85270000"
    }

    it("should create a order", async () => {
        // act
        const responseProduct = await request(app)
            .post('/products')
            .send(productInput)

        console.log("Product", responseProduct.body)
        expect(responseProduct.status).toBe(201)
        expect(responseProduct.body.id).toBe(productInput.id)
        expect(responseProduct.body.name).toBe(productInput.name)
        expect(responseProduct.body.description).toBe(productInput.description)
        expect(responseProduct.body.purchasePrice).toBe(productInput.purchasePrice)
        expect(responseProduct.body.stock).toBe(productInput.stock)
        
        const responseClient = await request(app)
            .post('/clients')
            .send(clientInput)

        console.log("Client ", responseClient.body)
        expect(responseClient.status).toBe(201)
        expect(responseClient.body.id).toBeDefined()
        expect(responseClient.body.name).toBe(clientInput.name)
        expect(responseClient.body.email).toBe(clientInput.email)
        expect(responseClient.body.document).toBe(clientInput.document)
        expect(responseClient.body.address._street).toBe(clientInput.street)
        expect(responseClient.body.address._number).toBe(clientInput.number)
        expect(responseClient.body.address._complement).toBe(clientInput.complement)
        expect(responseClient.body.address._city).toBe(clientInput.city)
        expect(responseClient.body.address._state).toBe(clientInput.state)
        expect(responseClient.body.address._zipCode).toBe(clientInput.zipCode)


        //Update salesprice 
        await ProductStoreModel.update({
            salesPrice: 150,
        }, {
            where: {
                id: productInput.id
            }
        })

        const Orderinput = {
            clientId: responseClient.body.id,
            products: [
                { productId: productInput.id }
            ]
        }

        const responseOrder = await request(app)
            .post('/checkout')
            .send(Orderinput)
        
        console.log("Order ", responseOrder.body)
        expect(responseOrder.status).toBe(201)
        expect(responseOrder.body.id).toBeDefined()
        expect(responseOrder.body.status).toBe("approved")
        expect(responseOrder.body.total).toBe(150)
        expect(responseOrder.body.products.length).toBe(1)
        
        const responseInvoice = await request(app).get(`/invoice/${responseOrder.body.InvoiceId}`);

        console.log("Invoice ", responseInvoice.body)
        expect(responseInvoice.status).toBe(200)
        expect(responseInvoice.body.id).toBeDefined()
        expect(responseInvoice.body.name).toBe("Samuca")
        expect(responseInvoice.body.document).toBe("36456789")
        expect(responseInvoice.body.address._street).toBe("Street")
        expect(responseInvoice.body.address._number).toBe("36")
        expect(responseInvoice.body.address._complement).toBe("Complement")
        expect(responseInvoice.body.address._city).toBe("City")
        expect(responseInvoice.body.address._state).toBe("State")
        expect(responseInvoice.body.address._zipCode).toBe("85270000")
        expect(responseInvoice.body.total).toBe(150)
        expect(responseInvoice.body.items.length).toBe(1)
        expect(responseInvoice.body.items[0].id).toBe(productInput.id)
        expect(responseInvoice.body.items[0].name).toBe(productInput.name)
        expect(responseInvoice.body.items[0].price).toBe(productInput.salesPrice)

    });
})