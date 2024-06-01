import { Sequelize } from "sequelize-typescript"
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import PlaceOrderRepository from "./place-order.repository";
import OrderItemModel from "./order-items.model";
import OrderModel from "./order.model";

describe("PlaceOrder repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true }
    });

    await sequelize.addModels([OrderModel, OrderItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });  
  
  it("should add a new order", async () => {
    const address = new Address({  
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "zip 1",  
    });
    
    const product1 = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });
    
    const product2 = new Product({
      id: new Id("2"),
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200,
    });
    
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "x@x.com",
      document: "Doc-1",
      address: address,
    });

    const order = new Order({
      id: new Id("1"),
      client: client,
      products: [product1, product2],
      status: "pending",
    });

    const repository = new PlaceOrderRepository();
    await repository.addOrder(order);

    const result = await OrderModel.findOne({
      where: { id: order.id.id },
      include: ["items"]
    });

    expect(result.id).toEqual(order.id.id);
    expect(result.clientId).toEqual(order.client.id.id);
    expect(result.name).toEqual(order.client.name);
    expect(result.document).toEqual(order.client.document);    
    expect(result.street).toEqual(order.client.address.street);
    expect(result.number).toEqual(order.client.address.number);
    expect(result.complement).toEqual(order.client.address.complement);
    expect(result.city).toEqual(order.client.address.city);
    expect(result.state).toEqual(order.client.address.state);    
    expect(result.zipCode).toEqual(order.client.address.zipCode);
    expect(result.items.length).toEqual(2);
    expect(result.items[0].id).toBe(product1.id.id);
    expect(result.items[0].name).toBe(product1.name);
    expect(result.items[0].description).toBe(product1.description);
    expect(result.items[0].salesPrice).toBe(product1.salesPrice);
    expect(result.items[1].id).toBe(product2.id.id);
    expect(result.items[1].name).toBe(product2.name);
    expect(result.items[1].description).toBe(product2.description);
    expect(result.items[1].salesPrice).toBe(product2.salesPrice);
    expect(result.total).toBe(300);
    expect(result.status).toBe("pending");
    expect(result.createdAt).toEqual(order.createdAt);  
    expect(result.updatedAt).toBeDefined();
  });

  it("should find an order", async () => {        
    const product1 = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
      orderId: "1",
    };  

    const product2 = {
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200,
      orderId: "1",
    };    
    
    const input = {
      id: "1",
      clientId: "1",      
      name: "Client 1",
      email: "x@x.com",
      document: "Doc-1",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "zip 1", 
      items: [product1, product2],      
      createdAt: new Date(),
      updatedAt: new Date(),
      total: 300,
      status: "pending",
    };

    await OrderModel.create(
      input,
      {
        include: [{ model: OrderItemModel }]
      }
    );
        
    const repository = new PlaceOrderRepository();
    const result = await repository.findOrder(input.id);

    expect(result.id.id).toEqual(input.id);
    expect(result.client.id.id).toEqual(input.clientId);
    expect(result.client.name).toEqual(input.name);
    expect(result.client.document).toEqual(input.document);    
    expect(result.client.address.street).toEqual(input.street);
    expect(result.client.address.number).toEqual(input.number);
    expect(result.client.address.complement).toEqual(input.complement);
    expect(result.client.address.city).toEqual(input.city);
    expect(result.client.address.state).toEqual(input.state);    
    expect(result.client.address.zipCode).toEqual(input.zipCode);
    expect(result.products.length).toEqual(2);
    expect(result.products[0].id.id).toBe(product1.id);
    expect(result.products[0].name).toBe(product1.name);
    expect(result.products[0].description).toBe(product1.description);
    expect(result.products[0].salesPrice).toBe(product1.salesPrice);
    expect(result.products[1].id.id).toBe(product2.id);
    expect(result.products[1].name).toBe(product2.name);
    expect(result.products[1].description).toBe(product2.description);
    expect(result.products[1].salesPrice).toBe(product2.salesPrice);      
    expect(result.total).toEqual(input.total);  
    expect(result.status).toEqual(input.status); 
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  }); 
})
