import { app } from "../../infrastructure/api/express";
import request from "supertest";
import { Umzug } from "umzug"
import { migrator } from "../../../migrations/config/migrator";
import { Sequelize } from "sequelize-typescript";
import ProductStoreModel from "../repository/product.model";


describe('E2E test for Store-catalog routes', () => {

    let sequelize: Sequelize

    let migration: Umzug<any>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
        })

        sequelize.addModels([ProductStoreModel])

        migration = migrator(sequelize)

        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) return

        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })

    it("should find product in store-catalog", async () => {
        const productDb = await ProductStoreModel.create({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            salesPrice: 100,
            stock: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = await request(app)
            .get('/store-catalog/1')

        expect(response.status).toBe(200)
        expect(response.body.id).toBe("1")
        expect(response.body.name).toBe("Product 1")
    });

    it("should find all products in store-catalog", async () => {
        await ProductStoreModel.create({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            salesPrice: 100,
            stock: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await ProductStoreModel.create({
            id: "2",
            name: "Product 2",
            description: "Product 2 description",
            salesPrice: 200,
            stock: 20,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = await request(app)
            .get('/store-catalog')

        expect(response.status).toBe(200)
        expect(response.body.products).toHaveLength(2)
        expect(response.body.products[0].id).toBe("1")
        expect(response.body.products[0].name).toBe("Product 1")
        expect(response.body.products[0].description).toBe("Product 1 description")
        expect(response.body.products[0].salesPrice).toBe(100)
        
        expect(response.body.products[1].id).toBe("2")
        expect(response.body.products[1].name).toBe("Product 2")
        expect(response.body.products[1].description).toBe("Product 2 description")
        expect(response.body.products[1].salesPrice).toBe(200)
    });

})