import FindAllProductsUsecase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import UpdateSalesPriceUseCase from "../usecase/update-sales-price/update-sales-price.usecase";
import StoreCatalogFacadeInterface, {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
  UpdateSalesPriceFacadeInputDto,
  UpdateSalesPriceFacadeOutputDto,
} from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findUseCase: FindProductUseCase;
  findAllUseCase: FindAllProductsUsecase;
  updateSalesPriceUseCase: UpdateSalesPriceUseCase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUseCase: FindProductUseCase;
  private _findAllUseCase: FindAllProductsUsecase;
  private _updateSalesPriceUseCase: UpdateSalesPriceUseCase;

  constructor(props: UseCaseProps) {
    this._findUseCase = props.findUseCase;
    this._findAllUseCase = props.findAllUseCase;
    this._updateSalesPriceUseCase = props.updateSalesPriceUseCase;
  }
  
  async updateSalesPrice(input: UpdateSalesPriceFacadeInputDto ): Promise<UpdateSalesPriceFacadeOutputDto> {
    return await this._updateSalesPriceUseCase.execute(input);
  }

  async find(
    id: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUseCase.execute(id);
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return await this._findAllUseCase.execute();
  }
}
