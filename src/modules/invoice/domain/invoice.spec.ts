import Address from "../../@shared/domain/value-object/address";
import Invoice from "./invoice.entity";
import InvoiceItem from "./invoice_item.entity";

describe("Invoice unit tests", () => { 
    it("should throw error when name is empty", () => {
        expect(() => {
          let invoice = new Invoice({
            name: "",
            document: "123456789",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Palmital",
                "PR",
                "88888-888"
            ),
            items: []
          })
        }).toThrowError("Name is required");
    });

    it("should throw error when document is empty", () => {
        expect(() => {
          let invoice = new Invoice({
            name: "John Doe",
            document: "",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Palmital",
                "PR",
                "88888-888"
            ),
            items: []
          })
        }).toThrowError("Document is required");
    });

    it("should throw error when address is empty", () => {
        expect(() => {
          let invoice = new Invoice({
            name: "John Doe",
            document: "123456789",
            address: null,
            items: []
          })
        }).toThrowError("Address is required");
    });
    
    it("should throw error when items is empty", () => {
        expect(() => {
          let invoice = new Invoice({
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
            items: []
          })
        }).toThrowError("Items are required");
    });

    it("should create a new invoice", () => {
        let invoice = new Invoice({
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
                name: "Product 1",
                price: 100
            })]
        })

        expect(invoice).toBeInstanceOf(Invoice);
        expect(invoice.name).toBe("John Doe");
        expect(invoice.document).toBe("123456789");
        expect(invoice.address).toBeInstanceOf(Address);
        expect(invoice.address.street).toBe("Rua 123");
        expect(invoice.items.length).toBe(1);
        expect(invoice.total()).toBe(100);
    });
});