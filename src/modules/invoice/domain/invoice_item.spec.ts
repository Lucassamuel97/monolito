import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "./invoice_item.entity";

describe("Invoice item unit tests", () => { 
    it("should create an invoice item", () => {
        let invoiceItem = new InvoiceItem({
            id: new Id("1"),
            name: "Item 1",
            price: 100
        });
        
        expect(invoiceItem.id.id).toBe("1");
        expect(invoiceItem.name).toBe("Item 1");
        expect(invoiceItem.price()).toBe(100);
    });
    
    it("should throw error when name is empty", () => {
        expect(() => {
          let invoiceItem = new InvoiceItem({
            name: "",
            price: 100
          })
        }).toThrowError("Name is required");
    });

    it("should throw error when price is 0", () => {
        expect(() => {
          let invoiceItem = new InvoiceItem({
            name: "Item 1",
            price: 0
          })
        }).toThrowError("Price is required");
    });

    it("should thorw error when price is empty", () => {
        expect(() => {
          let invoiceItem = new InvoiceItem({
            name: "Item 1",
            price: null,
          })
        }).toThrowError("Price is required");
    });

});