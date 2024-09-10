import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import { clientRoute } from "../../client-adm/controller/client-adm.route";
import { productRoute } from "../../product-adm/controller/product-adm.route";
import { storeRoute } from "../../store-catalog/controller/store-catalog.route";
import { invoiceRoute } from "../../invoice/controller/invoice.route";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../invoice/repository/invoice_item.model";
import { ProductModel } from "../../product-adm/repository/product.model";
import { migrator } from "../../../migrations/config/migrator";
import { Umzug } from "umzug"
import { join } from "path";
import ProductStoreModel from "../../store-catalog/repository/product.model";
import OrderModel from "../../checkout/repository/order.model";
import OrderClientModel from "../../checkout/repository/order-client.model";
import OrderProductModel from "../../checkout/repository/order-product.model";
import TransactionModel from "../../payment/repository/transaction.model";
import { orderRoute } from "../../checkout/controller/order.route";

export const app: Express = express();
app.use(express.json());

app.use("/clients", clientRoute)
app.use("/products", productRoute)
app.use("/store-catalog", storeRoute)
app.use("/invoice", invoiceRoute)
app.use("/checkout", orderRoute)

export let sequelize: Sequelize;
export let migration: Umzug<any>

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: join(__dirname, '../../../../database.sqlite'),
    logging: false,
  })

  await sequelize.addModels([
    OrderModel,
    ClientModel,
    OrderClientModel,
    ProductStoreModel,
    ProductModel,
    OrderProductModel,
    TransactionModel,
    InvoiceModel,
    InvoiceItemModel])
  migration = migrator(sequelize);
  await migration.up();
}

setupDb();