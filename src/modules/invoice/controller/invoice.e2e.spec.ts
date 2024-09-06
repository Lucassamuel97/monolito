import { app } from "../../infrastructure/api/express";
import request from "supertest";
import { Umzug } from "umzug"
import { migrator } from "../../../migrations/config/migrator";
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice_item.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe('E2E test for Invoice routes', () => {

    let sequelize: Sequelize

    let migration: Umzug<any>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        })

        sequelize.addModels([
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

    it("should find invoice", async () => {
        // Arrange
        
        await InvoiceModel.describe().then(attributes => {
            console.log(attributes);
        });

        const facade = InvoiceFacadeFactory.create()

        const input = {
            name: "Test",
            document: "123456789",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100
                },
            ]
        }


        // gera o id para seguir o  DTO Generate 
        const result = await facade.generate(input)

        // Act
        const response = await request(app).get(`/invoice/${result.id}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(result.id);
        expect(response.body.name).toBe(input.name);
        expect(response.body.document).toBe(input.document);
        expect(response.body.address._street).toBe(input.street);
        expect(response.body.address._number).toBe(input.number);
        expect(response.body.address._complement).toBe(input.complement);
        expect(response.body.address._city).toBe(input.city);
        expect(response.body.address._state).toBe(input.state);
        expect(response.body.address._zipCode).toBe(input.zipCode);
        expect(response.body.items.length).toBe(1);
        expect(response.body.items[0].id).toBe(input.items[0].id);
        expect(response.body.items[0].name).toBe(input.items[0].name);
        expect(response.body.items[0].price).toBe(input.items[0].price);
    });

})