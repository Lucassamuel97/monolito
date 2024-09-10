export interface PlaceOrderInputDto {
    clientId: string;
    products: {
        productId: string;
    }[];
}

export interface PlaceOrderOutputDto {
    id: string;
    InvoiceId: string;
    status: string;
    total: number;
    products: {
        productId: string;
    }[];
}