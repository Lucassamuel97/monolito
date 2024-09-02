
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface;
    private _catalogFacade: StoreCatalogFacadeInterface

    constructor(
        clientFacade: ClientAdmFacadeInterface,
        productFacade: ProductAdmFacadeInterface,
        catalogFacade: StoreCatalogFacadeInterface
    ) {
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
    }

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {

        //Buscar o cliente, caso nao encontre  -> client no found

        const client = await this._clientFacade.find({ id: input.clientId });
        if (!client) {
            throw new Error("Client not found");
        }
        // validar os produtos

        await this.validateProducts(input);


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

    private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }

        for (const p of input.products) {
            const product = await this._productFacade.checkStock({
                productId: p.productId,
            });
            if (product.stock <= 0) {
                throw new Error(
                    `Product ${product.productId} is not available in stock`
                );
            }
        }
    }

    private async getProduct(productId: string) : Promise<Product> {
        const product = await this._catalogFacade.find({ id: productId });
        if (!product) {
            throw new Error("Product not found");
        }

        const productProps = {
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        }

        return new Product(productProps);
    }

}