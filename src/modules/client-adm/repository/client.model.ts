import { Column, Model, PrimaryKey, Table, DataType } from "sequelize-typescript";

@Table({
    tableName: 'clients',
    timestamps: false
})
export class ClientModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false, type: DataType.STRING })
    id: string;

    @Column({ allowNull: false, type: DataType.STRING })
    name: string;

    @Column({ allowNull: false, type: DataType.STRING })
    email: string;

    @Column({ allowNull: false, type: DataType.STRING })
    document: string;

    @Column({ allowNull: false, type: DataType.STRING })
    street: string;

    @Column({ allowNull: false, type: DataType.STRING })
    number: string;

    @Column({ allowNull: true, type: DataType.STRING })
    complement: string;

    @Column({ allowNull: false, type: DataType.STRING })
    city: string;

    @Column({ allowNull: false, type: DataType.STRING })
    state: string;

    @Column({ allowNull: false, type: DataType.STRING })
    zipCode: string;

    @Column({ allowNull: false, type: DataType.DATE })
    createdAt: Date

    @Column({ allowNull: false, type: DataType.DATE })
    updatedAt: Date
}