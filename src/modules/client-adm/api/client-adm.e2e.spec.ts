import { app } from "../../infrastructure/api/express";
import request from "supertest";
import { Umzug } from "umzug"
import { ClientModel } from "../repository/client.model";
import { migrator } from "../../../migrations/config/migrator";
import { Sequelize } from "sequelize-typescript";


describe('E2E test for client routes', () => {

    let sequelize: Sequelize

    let migration: Umzug<any>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
        })

        sequelize.addModels([ClientModel])

        migration = migrator(sequelize)

        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) return
    
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })

    it("should create a client", async () => {
        const response = await request(app)
            .post('/clients')
            .send({
                name: "Samuca",
                email: "samuca@gmail.com",
                document: "36456789",
                street: "Street",
                number: "36",
                complement: "Complement",
                city: "City",
                state: "State",
                zipCode: "85270000"
        })

        console.log("reposta", response.body)  

        expect(response.status).toBe(201)
        expect(response.body.name).toBe("Samuca")
        expect(response.body.email).toBe("samuca@gmail.com")
        expect(response.body.document).toBe("36456789")
        expect(response.body.address._street).toBe("Street")
        expect(response.body.address._number).toBe("36")
        expect(response.body.address._complement).toBe("Complement")
        expect(response.body.address._city).toBe("City")
        expect(response.body.address._state).toBe("State")
        expect(response.body.address._zipCode).toBe("85270000")

    })
})