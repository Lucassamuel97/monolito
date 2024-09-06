import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItem from "../domain/invoice_item.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice_item.model";


export default class InvoiceRepository implements InvoiceGateway {

    async generate(entity: Invoice): Promise<void> {
        
        await InvoiceModel.create(
            {
                id: entity.id.id,
                name: entity.name,
                document: entity.document,
                street: entity.address.street,
                number: entity.address.number,
                complement: entity.address.complement,
                city: entity.address.city,
                state: entity.address.state,
                zipcode: entity.address.zipCode,
                items: entity.items.map((item) => ({
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                })),
                total: entity.total(),
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt
            },
            {
                include: [{ model: InvoiceItemModel }],
            }
        );
    }

    async find(id: string): Promise<Invoice> {
        try {
            const invoiceModelDb = await InvoiceModel.findOne({
                where: { id },
                rejectOnEmpty: true,
                include: [{ model: InvoiceItemModel, as: "items" }],
            });

            const invoiceModel = invoiceModelDb.toJSON();

            const items: InvoiceItem[] = invoiceModel.items.map((item: any) =>
                new InvoiceItem({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price,
                }),
            );

            return new Invoice({
                id: new Id(invoiceModel.id),
                name: invoiceModel.name,
                document: invoiceModel.document,
                address: new Address(
                    invoiceModel.street,
                    invoiceModel.number,
                    invoiceModel.complement,
                    invoiceModel.city,
                    invoiceModel.state,
                    invoiceModel.zipcode,
                ),
                items
            });
        } catch (error) {
            throw new Error("Invoice not found");
        }
    }
}