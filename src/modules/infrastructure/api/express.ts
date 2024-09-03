import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import { clientRoute } from "../../client-adm/api/client-adm.route";


export const app: Express = express();
app.use(express.json());
app.use("/clients", clientRoute)

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