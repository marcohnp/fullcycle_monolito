import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import { ClientModel } from "../../client-adm/repository/client.model";
import { InvoiceItemModel } from "../../invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import TransactionModel from "../../payment/repository/transaction.model";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import { ProductModel } from "../../product-adm/repository/product.model";
import StoreCatalogModel from "../../store-catalog/repository/store-catalog.model";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/store-catalog.facade.factory";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import OrderItemModel from "../repository/order-items.model";
import OrderModel from "../repository/order.model";
import PlaceOrderFacadeFactory from "./place-order.facade.factory";

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

function createMock() {
  const clientFactory = ClientAdmFacadeFactory.create();
  clientFactory.add({
    id: client.id.id,
    name: client.name,
    email: client.email,
    document: client.document,
    address: client.address,
  });
  
  const productFactory = ProductAdmFacadeFactory.create();  
  productFactory.addProduct({
    id: products["1"].id.id,
    name: products["1"].name,
    description: products["1"].description,
    purchasePrice: products["1"].salesPrice,
    stock: 100,
  });    

  productFactory.addProduct({
    id: products["2"].id.id,
    name: products["2"].name,
    description: products["2"].description,
    purchasePrice: products["2"].salesPrice,
    stock: 100,
  });    

  const catalogFacade = StoreCatalogFacadeFactory.create();
  catalogFacade.add({
    id: products["1"].id.id,
    name: products["1"].name,
    description: products["1"].description,
    salesPrice: products["1"].salesPrice,      
  });

  catalogFacade.add({
    id: products["2"].id.id,
    name: products["2"].name,
    description: products["2"].description,
    salesPrice: products["2"].salesPrice,      
  });
};

describe("PlaceOrderFacadeFactory test", () => {
  let sequelize: Sequelize;  

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true }
    });
    
    await sequelize.addModels([
      ProductModel, 
      StoreCatalogModel, 
      ClientModel, 
      OrderModel, 
      OrderItemModel, 
      TransactionModel, 
      InvoiceModel, 
      InvoiceItemModel,
    ]);
    await sequelize.sync();  
    
    createMock();
  });

  afterEach(async () => {
    await sequelize.close();
  });   

  it("should create an order", async () => {
    const factory = PlaceOrderFacadeFactory.create();
    
    const input = { 
      id: "1",      
      clientId: "1",
      products: [{productId: "1"}, {productId: "2"}],
    };

    await factory.add(input)    
    const order = await OrderModel.findOne({
      where: { id: input.id },
      include: ["items"]
    });
      
    expect(order).toBeDefined();    
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

  it("should find an order", async () => {
    const factory = PlaceOrderFacadeFactory.create();
    
    const input = { 
      id: "1",      
      clientId: "1",
      products: [{productId: "1"}, {productId: "2"}],
    };

    await factory.add(input)    
    const order = await factory.find({ id: input.id });      

    expect(order).toBeDefined();    
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
