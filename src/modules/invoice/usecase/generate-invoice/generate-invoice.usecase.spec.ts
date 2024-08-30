import Address from "../../../@shared/domain/value-object/address"
import GenerateInvoiceUseCase from "./generate-invoice.usecase";


const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn()
  }
}


describe("Generate Invoice use case unit test", () => { 
    it("should generate a invoice", async () => {
        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)
        
        const input = {
            name: "John Doe",
            document: "12345678901",
            street: "Main Street",
            number: "100",
            complement: "Apt 101",
            city: "Springfield",
            state: "IL",
            zipCode: "62701",
            items: [
                {
                    id: "1",
                    name: "Product 1",
                    price: 100
                },
                {
                    id: "2",
                    name: "Product 2",
                    price: 200
                }
            ]
        }

        const result = await usecase.execute(input)

        expect(repository.generate).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toBe(input.name)
        expect(result.document).toBe(input.document)
        expect(result.street).toBe(input.street)
        expect(result.number).toBe(input.number)
        expect(result.complement).toBe(input.complement)
        expect(result.city).toBe(input.city)
        expect(result.state).toBe(input.state)
        expect(result.zipCode).toBe(input.zipCode)
        expect(result.items).toHaveLength(2)
        expect(result.items[0].id).toBe(input.items[0].id)
        expect(result.items[0].name).toBe(input.items[0].name)
        expect(result.items[0].price).toBe(input.items[0].price)
        expect(result.items[1].id).toBe(input.items[1].id)
        expect(result.items[1].name).toBe(input.items[1].name)
        expect(result.items[1].price).toBe(input.items[1].price)
        expect(result.total).toBe(300)
    });

    it("should thrown an error when name is missing", async () => {
        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)
        
        const input = {
            name: "",
            document: "12345678901",
            street: "Main Street",
            number: "100",
            complement: "Apt 101",
            city: "Springfield",
            state: "IL",
            zipCode: "62701",
            items: [
                {
                    id: "1",
                    name: "Product 1",
                    price: 100
                }
            ]
        }

        await expect(usecase.execute(input)).rejects.toThrowError("Name is required")
    });

    it("should thrown an error when document is missing", async () => {
        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)
        
        const input = {
            name: "John Doe",
            document: "",
            street: "Main Street",
            number: "100",
            complement: "Apt 101",
            city: "Springfield",
            state: "IL",
            zipCode: "62701",
            items: [
                {
                    id: "1",
                    name: "Product 1",
                    price: 100
                }
            ]
        }

        await expect(usecase.execute(input)).rejects.toThrowError("Document is required")
    });

    it("should thrown an error when street is missing", async () => {
        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)
        
        const input = {
            name: "John Doe",
            document: "12345678901",
            street: "",
            number: "100",
            complement: "Apt 101",
            city: "Springfield",
            state: "IL",
            zipCode: "62701",
            items: [
                {
                    id: "1",
                    name: "Product 1",
                    price: 100
                }
            ]
        }

        await expect(usecase.execute(input)).rejects.toThrowError("Street is required")
    });

    it("should thrown an error when items is missing", async () => {
        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)
        
        const input = {
            name: "John Doe",
            document: "12345678901",
            street: "Main Street",
            number: "100",
            complement: "Apt 101",
            city: "Springfield",
            state: "IL",
            zipCode: "62701",
            items: [] as { id: string, name: string, price: number }[]
        }

        await expect(usecase.execute(input)).rejects.toThrowError("Items are required")
    });
});