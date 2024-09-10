export interface PlaceOrderFacadeInputDto {
    clientId: string;
    products: {
        productId: string;
    }[];
}

export interface PlaceOrderFacadeOutputDto{
    id: string;
    InvoiceId: string;
    status: string;
    total: number;
    products: {
        productId: string;
    }[];
}

export default interface OrderFacadeInterface {
    placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
}
