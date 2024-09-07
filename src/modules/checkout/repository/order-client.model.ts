import { Column, Model, PrimaryKey, Table, DataType } from "sequelize-typescript";

@Table({
  tableName: "clients",
  timestamps: false,
})
export default class OrderClientModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  email: string;

  @Column({
    field: 'street',  // Mapeia para a coluna 'street'
    allowNull: true,
    type: DataType.STRING
  })
  address: string;

}