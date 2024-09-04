import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import { clientRoute } from "../../client-adm/controller/client-adm.route";
import { productRoute } from "../../product-adm/controller/product-adm.route";


export const app: Express = express();
app.use(express.json());
app.use("/clients", clientRoute)
app.use("/products", productRoute)

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([ClientModel]);
  await sequelize.sync();
}
setupDb();