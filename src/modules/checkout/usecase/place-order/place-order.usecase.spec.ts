import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../@shared/domain/value-object/address";


const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUsecase unit test", () => {
    describe("Validate products method", () => {
        //@ts-expected-error - no params in constructor
        const placeOrderUsecase = new PlaceOrderUseCase();

        it("should throw an error when products are not valid", async () => {
            // Arrange
            const input: PlaceOrderInputDto = {
                clientId: "123",
                products: []
            }

            // Act
            await expect(placeOrderUsecase["validateProducts"](input)).rejects.toThrow(
                new Error("No products selected")
            );
        });

        it("should not throw an error when product is out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({ productId }: { productId: string }) =>
                    Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1,
                    })
                ),
            };

            //@ts-expected-error - force set productFacade
            placeOrderUsecase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "1" }]
            };

            await expect(
                placeOrderUsecase["validateProducts"](input)
            ).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );

            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }]
            };

            await expect(
                placeOrderUsecase["validateProducts"](input)
            ).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }]
            };

            await expect(
                placeOrderUsecase["validateProducts"](input)
            ).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
        });
    });

    describe("getProducts method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });
        afterAll(() => {
            jest.useRealTimers();
        });

        //@ts-expected-error - no params in constructor
        const placeOrderUsecase = new PlaceOrderUseCase();

        it("should throw an error when product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expected-error - force set catalogFacade
            placeOrderUsecase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUsecase["getProduct"]("0")).rejects.toThrow(
                new Error("Product not found")
            );
        });

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "Description 0",
                    salesPrice: 10,
                }),
            };

            //@ts-expected-error - force set catalogFacade
            placeOrderUsecase["_catalogFacade"] = mockCatalogFacade;

            const product = await ("0");

            await expect(placeOrderUsecase["getProduct"]("0")).resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    name: "Product 0",
                    description: "Description 0",
                    salesPrice: 10,
                })
            );
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });
    });

    describe("execute method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });
        afterAll(() => {
            jest.useRealTimers();
        });

        it("should throw an error if client is not found", async () => {
            // Arrange
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(false),
            };

            //@ts-expected-error - no params in constructor
            const placeOrderUsecase = new PlaceOrderUseCase();

            //@ts-expected-error - force set clientFacade
            placeOrderUsecase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "123" }]
            }

            await expect(placeOrderUsecase.execute(input)).rejects.toThrow(
                new Error("Client not found")
            );
        });

        it("should throw an error when products are not valid", async () => {
            // Arrange
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue({}),
            };

            //@ts-expected-error - no params in constructor
            const placeOrderUsecase = new PlaceOrderUseCase();

            const mockValidateProducts = jest
                //@ts-expected-error - spy on private method
                .spyOn(placeOrderUsecase, "validateProducts")
                //@ts-expected-error - not return never
                .mockRejectedValue(new Error("No products selected"));

            //@ts-expected-error - force set clientFacade
            placeOrderUsecase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "123",
                products: []
            }

            await expect(placeOrderUsecase.execute(input)).rejects.toThrow(
                new Error("No products selected")
            );

            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        });

        describe("place an order", () => {
            const ClientProps = {
                id: "1c",
                name: "Client 0 ",
                document: "0000",
                email: "client@user.com",
                address: new Address(
                    "Rua 123",
                    "99",
                    "Casa Verde",
                    "Criciúma",
                    "SC",
                    "88888-888",
                )
            };

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(ClientProps),
            };

            const mockPaymentFacade = {
                process: jest.fn(),
            };

            const mockCheckoutRepo = {
                addOrder: jest.fn(),
            };

            //Aqui no caso, era pra ser create:
            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({ id: "1i" }),
            };

            const placeOrderUsecase = new PlaceOrderUseCase(
                mockClientFacade as any,
                null,
                null,
                mockCheckoutRepo as any,
                mockInvoiceFacade as any,
                mockPaymentFacade
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Description 1",
                    salesPrice: 40,
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "Description 2",
                    salesPrice: 50,
                }),
            };

            const mockValidateProducts = jest
                //@ts-expected-error - spy on private method
                .spyOn(placeOrderUsecase, "validateProducts")
                //@ts-expected-error - not return never
                .mockResolvedValue(null);

            const mockGetProduct = jest
                //@ts-expected-error - spy on private method
                .spyOn(placeOrderUsecase, "getProduct")
                //@ts-expected-error - not return never
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId];
                });
            
            it("should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{productId: "1"},{productId: "2"},],
                };

                let output = await placeOrderUsecase.execute(input);

                
                // expect(output.InvoiceId).toBeNull();
                expect(output.total).toBe(90);
                expect(output.products).toStrictEqual([
                    { productId: "1"},
                    { productId: "2"},
                ]);

                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });
               
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
            });

            it("should be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{productId: "1"},{productId: "2"},],
                };

                let output = await placeOrderUsecase.execute(input);

                expect(output.InvoiceId).toBe("1i");
                expect(output.total).toBe(90);
                expect(output.products).toStrictEqual([
                    { productId: "1"},
                    { productId: "2"},
                ]);

                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });
               
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                    name: ClientProps.name,
                    document: ClientProps.document,
                    street: ClientProps.address.street,
                    number: ClientProps.address.number,
                    complement: ClientProps.address.complement,
                    city: ClientProps.address.city,
                    state: ClientProps.address.state,
                    zipCode: ClientProps.address.zipCode,
                    items: Object.values(products).map((p) => ({
                        id: p.id.id,
                        name: p.name,
                        price: p.salesPrice,
                    })),
                });
            });
        });
    })
})