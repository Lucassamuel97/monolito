import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import OrderFacadeInterface, { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./order.facade.interface";


export interface UseCaseProps {
    placeOrderUseCase: PlaceOrderUseCase;
}

export default class OrderFacade implements OrderFacadeInterface {
    private _placeOrderUseCase: PlaceOrderUseCase;

    constructor(usecaseProps: UseCaseProps) {
        this._placeOrderUseCase = usecaseProps.placeOrderUseCase;
    }
    
    async placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
        return this._placeOrderUseCase.execute(input);
    }
}