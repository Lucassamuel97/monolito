import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { UpdateSalesPriceInputDto, UpdateSalesPriceOutputDto } from "./update-sales-price.dto";

export default class UpdateSalesPriceUseCase implements UseCaseInterface {

    constructor(private productRepository: ProductGateway) {}

    async execute(input: UpdateSalesPriceInputDto): Promise<UpdateSalesPriceOutputDto> {
        
        const product = await this.productRepository.find(input.id);
        
        if (!product) {
            throw new Error("Product not found!");
        }

        product.salesPrice = input.salesPrice;

        await this.productRepository.update(product);

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        };

    }

}