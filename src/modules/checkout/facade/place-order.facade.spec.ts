import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import { InvoiceItemModel } from "../../invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import TransactionModel from "../../payment/repository/transaction.model";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/store-catalog.facade.factory";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import OrderItemModel from "../repository/order-items.model";
import OrderModel from "../repository/order.model";
import PlaceOrderRepository from "../repository/place-order.repository";
import FindPlaceOrderUseCase from "../usecase/find-place-order/find-place-order.usecase";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import PlaceOrderFacade from "./place-order.facade";

const products = {
  "1": new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Product 1 description",
    salesPrice: 100,
  }),
  "2": new Product({
    id: new Id("2"),
    name: "Product 2",
    description: "Product 2 description",
    salesPrice: 200,
  }),
};

const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  email: "x@x.com",
  document: "Doc-1",
  address: new Address({
    street: "Street 1",
    number: "Number 1",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "Zip 1",
  }),
});

describe("OrderRepository test", () => {
  let sequelize: Sequelize;  

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true }
    });
    
    await sequelize.addModels([
      OrderModel, 
      OrderItemModel, 
      TransactionModel, 
      InvoiceModel, 
      InvoiceItemModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });  


  it("should create an order", async () => {
    const mockClientFacade =  {
      find: jest.fn().mockReturnValue(client),
    };
        
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const repository = new PlaceOrderRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const placeOrderUseCase = new PlaceOrderUseCase(
      mockClientFacade as any,
      null,
      catalogFacade,
      repository,
      invoiceFacade,
      paymentFacade,
    );

    const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - spy on private method
        .mockResolvedValue(null);

    const mockGetProduct = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUseCase, "getProduct")
      //@ts-expect-error - spy on private method
      .mockImplementation((productId: keyof typeof products) => {
        return products[productId];
      });

    const facade = new PlaceOrderFacade({
      addUsecase: placeOrderUseCase,
      findUsecase: undefined,
    });    
    
    const input = { 
      id: "1",      
      clientId: "1",
      products: [{productId: "1"}, {productId: "2"}],
    };

    await facade.add(input)    
    const order = await OrderModel.findOne({
      where: { id: input.id },
      include: ["items"]
    });
      
    expect(order).toBeDefined();
    expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    expect(mockValidateProducts).toHaveBeenCalledWith(input);
    expect(mockGetProduct).toHaveBeenCalledTimes(2);
    expect(order.id).toEqual(input.id);
    expect(order.clientId).toEqual(client.id.id);
    expect(order.email).toEqual(client.email);
    expect(order.document).toEqual(client.document);
    expect(order.street).toEqual(client.address.street);
    expect(order.number).toEqual(client.address.number);
    expect(order.complement).toEqual(client.address.complement);
    expect(order.city).toEqual(client.address.city);
    expect(order.state).toEqual(client.address.state);
    expect(order.zipCode).toEqual(client.address.zipCode);    
    expect(order.items).toHaveLength(2);
    expect(order.items[0].id).toBe(products[1].id.id);
    expect(order.items[0].name).toBe(products[1].name);
    expect(order.items[0].description).toBe(products[1].description);
    expect(order.items[0].salesPrice).toBe(products[1].salesPrice);
    expect(order.items[1].id).toBe(products[2].id.id);
    expect(order.items[1].name).toBe(products[2].name);
    expect(order.items[1].description).toBe(products[2].description);
    expect(order.items[1].salesPrice).toBe(products[2].salesPrice);      
    expect(order.total).toEqual(300);  
    expect(order.status).toEqual("approved"); 
    expect(order.createdAt).toBeDefined();
    expect(order.updatedAt).toBeDefined();
  });

  it("should find a client", async () => {
    const mockClientFacade =  {
      find: jest.fn().mockReturnValue(client),
    };
        
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const repository = new PlaceOrderRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const placeOrderUseCase = new PlaceOrderUseCase(
      mockClientFacade as any,
      null,
      catalogFacade,
      repository,
      invoiceFacade,
      paymentFacade,
    );

    const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - spy on private method
        .mockResolvedValue(null);

    const mockGetProduct = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUseCase, "getProduct")
      //@ts-expect-error - spy on private method
      .mockImplementation((productId: keyof typeof products) => {
        return products[productId];
      });

    const facade = new PlaceOrderFacade({
      addUsecase: placeOrderUseCase,
      findUsecase: new FindPlaceOrderUseCase(repository),
    });    
    
    const input = { 
      id: "1",      
      clientId: "1",
      products: [{productId: "1"}, {productId: "2"}],
    };

    await facade.add(input)    
    const order = await facade.find({ id: "1" });
      
    expect(order).toBeDefined();
    expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    expect(mockValidateProducts).toHaveBeenCalledWith(input);
    expect(mockGetProduct).toHaveBeenCalledTimes(2);
    expect(order.id).toEqual(input.id);    
    expect(order.name).toEqual(client.name);
    expect(order.email).toEqual(client.email);
    expect(order.document).toEqual(client.document);
    expect(order.address.street).toEqual(client.address.street);
    expect(order.address.number).toEqual(client.address.number);
    expect(order.address.complement).toEqual(client.address.complement);
    expect(order.address.city).toEqual(client.address.city);
    expect(order.address.state).toEqual(client.address.state);
    expect(order.address.zipCode).toEqual(client.address.zipCode);    
    expect(order.items).toHaveLength(2);
    expect(order.items[0].id).toBe(products[1].id.id);
    expect(order.items[0].name).toBe(products[1].name);
    expect(order.items[0].description).toBe(products[1].description);
    expect(order.items[0].salesPrice).toBe(products[1].salesPrice);
    expect(order.items[1].id).toBe(products[2].id.id);
    expect(order.items[1].name).toBe(products[2].name);
    expect(order.items[1].description).toBe(products[2].description);
    expect(order.items[1].salesPrice).toBe(products[2].salesPrice);      
    expect(order.status).toEqual("approved"); 
    expect(order.createdAt).toBeDefined();    
  });
});
