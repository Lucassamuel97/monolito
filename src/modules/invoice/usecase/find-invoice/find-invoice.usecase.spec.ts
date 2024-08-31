import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/invoice.entity"
import InvoiceItem from "../../domain/invoice_item.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"

const invoice = new Invoice({
    id: new Id("1"),
    name: "John Doe",
    document: "123456789",
    address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Palmital",
        "PR",
        "88888-888"
    ),
    items: [new InvoiceItem({
        id: new Id("10"),
        name: "Product 1",
        price: 10
    })],
})

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
}

describe("Find Invoice use case unit test", () => {
    it("should find a invoice", async () => {

        const repository = MockRepository()
        const usecase = new FindInvoiceUseCase(repository)

        const input = {
            id: "1"
        }

        const result = await usecase.execute(input)

        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toEqual(input.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.address.street).toEqual(invoice.address._street)
        expect(result.address.number).toEqual(invoice.address._number)
        expect(result.address.complement).toEqual(invoice.address._complement)
        expect(result.address.city).toEqual(invoice.address._city)
        expect(result.address.state).toEqual(invoice.address._state)
        expect(result.address.zipCode).toEqual(invoice.address._zipCode)
        expect(result.items[0].id).toEqual(invoice.items[0].id.id)
        expect(result.items[0].name).toEqual(invoice.items[0].name)
        expect(result.items[0].price).toEqual(invoice.items[0].price)
    })

    it("should not find a customer", async () => {
        const invoiceRepository = MockRepository();
        invoiceRepository.find.mockImplementation(() => {
            throw new Error("invoice not found");
        });
        const usecase = new FindInvoiceUseCase(invoiceRepository);

        const input = {
            id: "1",
        };

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("invoice not found");
    });
});