import { app } from "../../infrastructure/api/express";
import request from "supertest";
import { Umzug } from "umzug"
import { ClientModel } from "../repository/client.model";
import { migrator } from "../../../migrations/config/migrator";
import { Sequelize } from "sequelize-typescript";
import ClientRepository from "../repository/client.repository";


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
    });

    it("should find a client", async () => {
        const client = await ClientModel.create({
            id: '1',
            name: 'Samuca',
            email: 'samuca@123.com',
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const findResponse = await request(app).get(`/clients/${1}`);

        expect(findResponse.status).toBe(201);
        expect(findResponse.body.name).toBe("Samuca");
        expect(findResponse.body.email).toBe("samuca@123.com");
        expect(findResponse.body.document).toBe("1234-5678");
        expect(findResponse.body.address._street).toBe("Rua 123");
        expect(findResponse.body.address._number).toBe("99");
        expect(findResponse.body.address._complement).toBe("Casa Verde");
        expect(findResponse.body.address._city).toBe("Criciúma");
        expect(findResponse.body.address._state).toBe("SC");
        expect(findResponse.body.address._zipCode).toBe("88888-888");

    });

})