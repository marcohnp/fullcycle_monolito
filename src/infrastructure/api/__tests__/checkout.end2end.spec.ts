import Address from '../../../modules/@shared/domain/value-object/address.value-object';
import Id from '../../../modules/@shared/domain/value-object/id.value-object';
import Client from '../../../modules/checkout/domain/client.entity';
import ClientAdm from '../../../modules/client-adm/domain/client.entity';
import Order from '../../../modules/checkout/domain/order.entity';
import Product from '../../../modules/checkout/domain/product.entity';
import ProductAdm from '../../../modules/product-adm/domain/product.entity';
import PlaceOrderRepository from '../../../modules/checkout/repository/place-order.repository';
import ClientRepository from '../../../modules/client-adm/repository/client.repository';
import { app, sequelize } from '../express';
import request from 'supertest';
import ProductRepository from '../../../modules/product-adm/repository/product.repository';
import StoreCatalog from '../../../modules/store-catalog/domain/store-catalog.entity';
import StoreCatalogRepository from '../../../modules/store-catalog/repository/store-catalog.repository';

describe("E2E test for checkout", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true })
  });

  afterAll(async () => {
    await sequelize.close();
  });
  
  it("should create a checkout", async () => {

    const client = new ClientAdm({
      id: new Id("1"),
      name: "Lucian",
      email: "lucian@teste.com",
      document: "1234-5678",
      address: new Address({
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      })
    })

    const repository = new ClientRepository()
    await repository.add(client)

    const productProps = {
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };
    const product = new ProductAdm(productProps);
    const productRepository = new ProductRepository();
    await productRepository.add(product);

    const storeCatalogProps = {
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,      
    };
    const storeCatalog = new StoreCatalog(storeCatalogProps);
    const storeCatalogRepository = new StoreCatalogRepository();
    await storeCatalogRepository.add(storeCatalog);

    const resp = await request(app)
      .post("/checkout")
      .send({
        id: "1",
        clientId: "1",
        products: [{
          productId: "1"
        }]
      });

    expect(resp.status).toBe(200);
  });
  
  it("should not create a checkout", async () => {
    const resp = await request(app)
      .post("/checkout")
      .send({
        id: "1"        
      });

    expect(resp.status).toBe(500);    
  });  

  it("should find a checkout", async () => {
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
      products: [product1],
      status: "pending",
    });

    const repository = new PlaceOrderRepository();
    await repository.addOrder(order);

    const resp = await request(app)
      .get("/checkout/1")
      .send();

    const expectedResponse = {
      id: '1',
      name: 'Client 1',
      email: 'x@x.com',
      document: 'Doc-1',
      address: {
        street: 'Street 1',
        number: '1',
        complement: 'Complement 1',
        city: 'City 1',
        state: 'State 1',
        zipCode: 'zip 1'
      },
      items: [
        {
          id: '1',
          name: 'Product 1',
          description: 'Product 1 description',
          salesPrice: 100
        }
      ],
      status: 'pending',
      createdAt: resp.body.createdAt
    };

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual(expectedResponse);
  });

});