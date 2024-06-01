import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/store-catalog.facade.factory";
import PlaceOrderFacade from "../facade/place-order.facade";
import PlaceOrderRepository from "../repository/place-order.repository";
import FindPlaceOrderUseCase from "../usecase/find-place-order/find-place-order.usecase";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class PlaceOrderFacadeFactory {
  static create() {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productAdmFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const repository = new PlaceOrderRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    
    const addUsecase = new PlaceOrderUseCase(
      clientFacade,
      productAdmFacade,
      catalogFacade,
      repository,
      invoiceFacade,
      paymentFacade,
    );    
    const facade = new PlaceOrderFacade({
      addUsecase: addUsecase,
      findUsecase: new FindPlaceOrderUseCase(repository),
    });
    
    return facade;
  }
}