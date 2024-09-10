import { Sequelize } from "sequelize-typescript"
import Invoice from "../domain/invoice.entity";
import InvoiceItemModel from "./invoice_item.model";
import InvoiceModel from "./invoice.model";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice_item.entity";
import InvoiceRepository from "./invoice.repository";

describe("Invoice Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a invoice", async () => {
        const invoice = new Invoice({
            id: new Id("123"),
            name: "Test",
            document: "123456789",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            ),
            items: [
                new InvoiceItem({
                    id: new Id("1"),
                    name: "Item 1",
                    price: 100
                }),
            ]
        })

        const repository = new InvoiceRepository()
        await repository.generate(invoice);

        const result = await InvoiceModel.findOne({ where: { id: "123" }, include: ["items"] })
        
        // Converte
        const invoiceDb = result.toJSON();

        expect(result.toJSON()).toStrictEqual({
            id: "123",
            name: "Test",
            document: "123456789",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipcode: "88888-888",
            total: 100,
            createdAt: invoiceDb.createdAt,
            updatedAt: invoiceDb.updatedAt,
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100,
                    invoice_id: "123",
                }
            ]
        })
    });

    it("should find an invoice by id", async () => {
        // Act
        const invoice = new Invoice({
            id: new Id("123"),
            name: "Test",
            document: "123456789",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            ),
            items: [
                new InvoiceItem({
                    id: new Id("1"),
                    name: "Item 1",
                    price: 100
                }),
                new InvoiceItem({
                    id: new Id("2"),
                    name: "Item 2",
                    price: 200
                }),
            ]
        })

        const repository = new InvoiceRepository()
        await repository.generate(invoice)

        // Arrange
        const foundInvoice = await repository.find(invoice.id.id);

        // Assert
        expect(foundInvoice.name).toBe(invoice.name);
        expect(foundInvoice.document).toBe(invoice.document);
        expect(foundInvoice.address.street).toBe(invoice.address.street);
        expect(foundInvoice.address.number).toBe(invoice.address.number);
        expect(foundInvoice.address.complement).toBe(invoice.address.complement);
        expect(foundInvoice.address.city).toBe(invoice.address.city);
        expect(foundInvoice.address.state).toBe(invoice.address.state);
        expect(foundInvoice.address.zipCode).toBe(invoice.address.zipCode);
        expect(foundInvoice.items.length).toBe(2);
        expect(foundInvoice.items[0].id.id).toBe(invoice.items[0].id.id);
        expect(foundInvoice.items[0].name).toBe(invoice.items[0].name);
        expect(foundInvoice.items[0].price).toBe(invoice.items[0].price);
        expect(foundInvoice.items[1].id.id).toBe(invoice.items[1].id.id);
        expect(foundInvoice.items[1].name).toBe(invoice.items[1].name);
        expect(foundInvoice.items[1].price).toBe(invoice.items[1].price);
        expect(foundInvoice.total()).toBe(300);
    });

    it("should throw an error when invoice not found", async () => {
        // Act
        const invoiceRepository = new InvoiceRepository();
        // Assert
        await expect(invoiceRepository.find("123")).rejects.toThrow("Invoice not found");
    });

});