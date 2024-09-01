
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    private _clientFacade: ClientAdmFacadeInterface;
    constructor(clientFacade: ClientAdmFacadeInterface){
        this._clientFacade = clientFacade;
    }

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    
        //Buscar o cliente, caso nao encontre  -> client no found

        const client = await this._clientFacade.find({id: input.clientId});
        if (!client) {
            throw new Error("Client not found");
        }


        // validar os produtos
        // Recuperar o produtos

        // Criar o objeto do client
        // criar o objeto da order (client, products)

        // Processar o pagamento -> paymentFacade.process (orderId, amout)

        // Caso pagamento aprovado, -> gerar invoice
        //Mudar o status da order para approved

        // retornar Dto

        return {
            id: "",
            InvoiceId: "",
            status: "",
            total: 0,
            products: []
        };
    }
 
}