import { Sequelize } from "sequelize-typescript"
import InvoiceModel from "../repository/invoice.model"
import InvoiceItemModel from "../repository/invoice_item.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe("Invoice Facade test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging:false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a invoice", async () => {

        const facade = InvoiceFacadeFactory.create()

        const input = {
            id: "1",
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

        // gera o id para seguir o  DTO Generate do exercicio 
        const result = await facade.generate(input)

        const findresultDb = await InvoiceModel.findOne({
            where: { id: result.id },
            include: ["items"],
        });

        const findresult = findresultDb.toJSON();

        expect(findresult.id).toBeDefined();
        expect(findresult.name).toBe(input.name);
        expect(findresult.document).toBe(input.document);
        expect(findresult.street).toBe(input.street);
        expect(findresult.number).toBe(input.number);
        expect(findresult.complement).toBe(input.complement);
        expect(findresult.city).toBe(input.city);
        expect(findresult.state).toBe(input.state);
        expect(findresult.zipcode).toBe(input.zipCode);
        expect(findresult.items.length).toBe(1);
        expect(findresult.items[0].name).toBe(input.items[0].name);
        expect(findresult.items[0].price).toBe(input.items[0].price);
        expect(findresult.total).toBe(100);
    });

    it("should thrown an error when name is missing ", async () => {

        const facade = InvoiceFacadeFactory.create()

        const input = {
            id: "1",
            name: "",
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

        expect(async () => {
            return await facade.generate(input)
        }).rejects.toThrow("Name is required");
    });

    it("should thrown an error when items is missing ", async () => {

        const facade = InvoiceFacadeFactory.create()

        const input = {
            id: "1",
            name: "Test",
            document: "123456789",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [{
                id: "1",
                name: "Item 1",
                price: 0
            }]
        }

        expect(async () => {
            return await facade.generate(input)
        }).rejects.toThrow("Price is required");
    });

    it("should find a invoice", async () => {

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
                    price: 200
                },
            ]
        }

        const result = await facade.generate(input)

        const findresult = await facade.find({ id: result.id })

        expect(findresult.id).toBeDefined();
        expect(findresult.name).toBe(input.name);
        expect(findresult.document).toBe(input.document);
        expect(findresult.address.street).toBe(input.street);
        expect(findresult.address.number).toBe(input.number);
        expect(findresult.address.complement).toBe(input.complement);
        expect(findresult.address.city).toBe(input.city);
        expect(findresult.address.state).toBe(input.state);
        expect(findresult.address.zipCode).toBe(input.zipCode);
        expect(findresult.items.length).toBe(1);
        expect(findresult.items[0].name).toBe(input.items[0].name);
        expect(findresult.items[0].price).toBe(input.items[0].price);
        expect(findresult.total).toBe(200);
    });

    it("should not find a customer", async () => {

        const facade = InvoiceFacadeFactory.create()

        expect(async () => {
            return await facade.find({ id: "1" })
        }).rejects.toThrow("Invoice not found");
    });
})