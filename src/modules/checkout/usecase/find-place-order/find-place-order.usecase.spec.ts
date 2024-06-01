import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import FindPlaceOrderUseCase from "./find-place-order.usecase";

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
  address: new Address({
    street: "Street 1",
    number: "Number 1",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "Zip 1",
  }),
});

const order = new Order({
  id: new Id("1"),
  client: client,
  products: [product1, product2],
  status: "pending",
})

const MockRepository = () => {
  return {
    addOrder: jest.fn(),
    findOrder: jest.fn().mockReturnValue(Promise.resolve(order)),
  };
};

describe("Find Order UseCase unit test", () => {
  it("should find an order", async () => {
    const repository = MockRepository();
    const usecase = new FindPlaceOrderUseCase(repository);

    const input = {      
      id: "1",
    };

    const result = await usecase.execute(input);    

    expect(repository.findOrder).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.client.name).toEqual(client.name);
    expect(result.client.email).toEqual(client.email);    
    expect(result.client.document).toEqual(client.document);
    expect(result.client.address.street).toEqual(client.address.street);
    expect(result.client.address.number).toEqual(client.address.number);
    expect(result.client.address.complement).toEqual(client.address.complement);
    expect(result.client.address.city).toEqual(client.address.city);
    expect(result.client.address.state).toEqual(client.address.state);
    expect(result.client.address.zipCode).toEqual(client.address.zipCode);
    expect(result.products.length).toEqual(2);
    expect(result.products[0].id.id).toBe(product1.id.id);
    expect(result.products[0].name).toBe(product1.name);
    expect(result.products[0].description).toBe(product1.description);
    expect(result.products[0].salesPrice).toBe(product1.salesPrice);
    expect(result.products[1].id.id).toBe(product2.id.id);
    expect(result.products[1].name).toBe(product2.name);
    expect(result.products[1].description).toBe(product2.description);
    expect(result.products[1].salesPrice).toBe(product2.salesPrice);     
    expect(result.status).toEqual(order.status); 
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
});
