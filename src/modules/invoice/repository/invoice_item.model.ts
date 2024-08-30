import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
    tableName: "invoice_items",
    timestamps: false,
})
export default class InvoiceItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    declare invoice_id: string;

    @BelongsTo(() => InvoiceModel)
    declare invoice: InvoiceModel;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;
}