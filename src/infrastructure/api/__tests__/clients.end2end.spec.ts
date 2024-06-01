import { app, sequelize } from '../express';
import request from 'supertest';

describe("E2E test for clients", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true })
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        id: "1",
        name: "Client 1",
        email: "x@x.com",
        document: "Doc-1",
        address: {
          street: "Street 1",
          number: "Number 1",
          complement: "Complement 1",
          city: "City 1",
          state: "State 1",
          zipCode: "Zip 1"
        }
      });

    expect(response.status).toBe(201);
  });  

  it("should not create a client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        id: "1"        
      });

    expect(response.status).toBe(500);    
  });  

  it("should find a client", async () => {
    const id = "1";
    const response = await request(app)
      .post("/clients")
      .send({
        id: id,
        name: "Client 1",
        email: "x@x.com",
        document: "Doc-1",
        address: {
          street: "Street 1",
          number: "Number 1",
          complement: "Complement 1",
          city: "City 1",
          state: "State 1",
          zipCode: "Zip 1"
        }
      });
    expect(response.status).toBe(201);    

    const resp = await request(app).get(`/clients/${id}`).send();
    expect(resp.status).toBe(200);
    expect(resp.body.name).toBe("Client 1");
    expect(resp.body.email).toBe("x@x.com");
    expect(resp.body.document).toBe("Doc-1");    
    expect(resp.body.address._street).toBe("Street 1");
    expect(resp.body.address._number).toBe("Number 1");
    expect(resp.body.address._complement).toBe("Complement 1");
    expect(resp.body.address._city).toBe("City 1");
    expect(resp.body.address._state).toBe("State 1");
    expect(resp.body.address._zipCode).toBe("Zip 1");
  });
});