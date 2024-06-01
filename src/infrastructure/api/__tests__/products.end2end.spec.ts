import { app, sequelize } from '../express';
import request from 'supertest';

describe("E2E test for product", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true })
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 10,
        stock: 10
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.description).toBe("Product 1 description");
    expect(response.body.purchasePrice).toBe(10);
    expect(response.body.stock).toBe(10);
  });   

  it("should find a product", async () => {
    const id = "1";
    const response = await request(app)
      .post("/products")
      .send({
        id: id,
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 10,
        salesPrice: 100,
        stock: 10
      });
    expect(response.status).toBe(200);    

    const resp = await request(app).get(`/products/${id}`).send();

    expect(resp.status).toBe(200);
    expect(resp.body.productId).toBe(id);
    expect(resp.body.stock).toBe(10);
  });
});