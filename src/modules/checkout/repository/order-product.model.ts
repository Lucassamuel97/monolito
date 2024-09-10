import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'order_products', 
    timestamps: false
})

export default class OrderProductModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    description: string

    @Column({ allowNull: false })
    salesPrice: number

    @Column({ allowNull: false })
    createdAt: Date

    @Column({ allowNull: false })
    updatedAt: Date

    @Column({ allowNull: false })
    orderId: string
}