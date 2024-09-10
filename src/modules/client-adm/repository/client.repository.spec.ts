import { Sequelize } from "sequelize-typescript"
import { ClientModel } from "./client.model"
import ClientRepository from "./client.repository"
import Client from "../domain/client.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"

describe("Client Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([ClientModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a client", async () => {

        const client = new Client({
            id: new Id("1"),
            name: "Samuca",
            email: "samuca@teste.com",
            document: "1234-5678",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            )
        })

        const repository = new ClientRepository()
        await repository.add(client)

        const clientDb = await ClientModel.findOne({ where: { id: "1" } })

        const clientDbToJson = clientDb.toJSON();

        expect(clientDbToJson).toBeDefined()
        expect(clientDbToJson.id).toEqual(client.id.id)
        expect(clientDbToJson.name).toEqual(client.name)
        expect(clientDbToJson.email).toEqual(client.email)
        expect(clientDbToJson.document).toEqual(client.document)
        expect(clientDbToJson.street).toEqual(client.address.street)
        expect(clientDbToJson.number).toEqual(client.address.number)
        expect(clientDbToJson.complement).toEqual(client.address.complement)
        expect(clientDbToJson.city).toEqual(client.address.city)
        expect(clientDbToJson.state).toEqual(client.address.state)
        expect(clientDbToJson.zipCode).toEqual(client.address.zipCode)
        expect(clientDbToJson.createdAt).toStrictEqual(client.createdAt)
        expect(clientDbToJson.updatedAt).toStrictEqual(client.updatedAt)
    })

    it("should find a client", async () => {

        const CreateClient = await ClientModel.create({
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

        const client = CreateClient.toJSON();

        const repository = new ClientRepository()
        const result = await repository.find("1")

        expect(result.id.id).toEqual(client.id)
        expect(result.name).toEqual(client.name)
        expect(result.email).toEqual(client.email)
        expect(result.address.street).toEqual(client.street)
        expect(result.address.number).toEqual(client.number)
        expect(result.address.complement).toEqual(client.complement)
        expect(result.address.city).toEqual(client.city)
        expect(result.address.state).toEqual(client.state)
        expect(result.address.zipCode).toEqual(client.zipCode)
        expect(result.createdAt).toStrictEqual(client.createdAt)
        expect(result.updatedAt).toStrictEqual(client.updatedAt)
    })
})