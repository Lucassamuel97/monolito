import { BelongsTo, Column, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderClientModel from "./order-client.model";
import OrderProductModel from "./order-product.model";

@Table({
    tableName: "orders",
    timestamps: false
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @ForeignKey(() => OrderClientModel)
    @Column
    clientId: number;  // Chave estrangeira para OrderClientModel
  
    @BelongsTo(() => OrderClientModel)
    client: OrderClientModel;

    @HasMany(() => OrderProductModel, 'orderId')
    products: OrderProductModel[]

    @Column({ allowNull: false })
    status: string

    @Column({ allowNull: false })
    createdAt: Date

    @Column({ allowNull: false })
    updatedAt: Date
}