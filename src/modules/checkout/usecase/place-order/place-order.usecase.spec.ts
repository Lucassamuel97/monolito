import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

describe("PlaceOrderUsecase unit test", () => {

    describe("execute method", () => {
        it("should throw an error if client is not found", async () => {
            // Arrange
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expected-error - no params in constructor
            const placeOrderUsecase = new PlaceOrderUseCase();

            //@ts-expected-error - force set clientFacade
            placeOrderUsecase["_clientFacade"] = mockClientFacade;

            const input : PlaceOrderInputDto = {
                clientId: "0",
                products: [{productId: "123"}]
            }

            await expect(placeOrderUsecase.execute(input)).rejects.toThrow(
                new Error("Client not found")
            );
        })

    })
})