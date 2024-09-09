import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import OrderFacade from "../facade/order.facade";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class OrderFacadeFactory {
    static create() {

      const placeOrderUsecase = new PlaceOrderUseCase(
        ClientAdmFacadeFactory.create(),
        ProductAdmFacadeFactory.create(),
        StoreCatalogFacadeFactory.create(),
        new OrderRepository(),
        InvoiceFacadeFactory.create(),
        PaymentFacadeFactory.create()
      );

      const facade = new OrderFacade({
        placeOrderUseCase: placeOrderUsecase
      });
  
      return facade;
    }
  }
  