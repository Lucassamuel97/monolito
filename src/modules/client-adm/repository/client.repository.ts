import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import { ClientModel } from "./client.model";

export default class ClientRepository implements ClientGateway {

  async add(entity: Client): Promise<void> {

    await ClientModel.create({
      id: entity.id.id,
      name: entity.name,
      email: entity.email,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipCode: entity.address.zipCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    })
  }

  async find(id: string): Promise<Client> {


    console.log("Id passado para o repositoy: ", id)
    
    const retorno = await ClientModel.findOne({ where: { id }, raw: false });

    if (!retorno) {
      throw new Error("Client not found")
    }

    console.log("Client data:", retorno.toJSON()); 
    console.log("Erro do retorno ", retorno.name)

    return new Client({
      id: new Id(retorno.id),
      name: retorno.name,
      email: retorno.email,
      document: retorno.document,
      address: new Address(
        retorno.street,
        retorno.number,
        retorno.complement,
        retorno.city,
        retorno.state,
        retorno.zipCode
      ),
      createdAt: retorno.createdAt,
      updatedAt: retorno.updatedAt,
    });
  }
}