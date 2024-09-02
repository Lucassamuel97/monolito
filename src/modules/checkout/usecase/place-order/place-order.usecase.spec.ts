import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

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

    });
    describe("execute method", () => {
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

    })
})