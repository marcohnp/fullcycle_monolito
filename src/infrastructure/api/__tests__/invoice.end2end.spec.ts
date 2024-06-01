import { create } from 'yup/lib/Reference';
import { InvoiceModel } from '../../../modules/invoice/repository/invoice.model';
import { app, sequelize } from '../express';
import request from 'supertest';
import Id from '../../../modules/@shared/domain/value-object/id.value-object';
import { InvoiceItemModel } from '../../../modules/invoice/repository/invoice-item.model';
import Invoice from '../../../modules/invoice/domain/invoice.entity';
import InvoiceRepository from '../../../modules/invoice/repository/invoice.repository';
import Address from '../../../modules/@shared/domain/value-object/address.value-object';
import InvoiceItem from '../../../modules/invoice/domain/invoice-item.entity';

const invoiceItemProps1 = {
  id: new Id("1"),
  name: "Product 1",
  price: 100,
}

const invoiceItemProps2 = {
  id: new Id("2"),
  name: "Product 2",
  price: 100,
}

const invoiceProps = {
  id: new Id("1"),
  name: "Costumer 1",
  document: "123.456.789-10",
  address: new Address({
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1"
  }),
  items: [new InvoiceItem(invoiceItemProps1), new InvoiceItem(invoiceItemProps2)],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("E2E test for invoice", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true })
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {    
 
  const invoice = new Invoice(invoiceProps);
  const invoiceRepository = new InvoiceRepository();
  await invoiceRepository.generate(invoice);

    const response = await request(app).get("/invoice/1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("1");
    expect(response.body.name).toBe("Costumer 1");
    expect(response.body.document).toBe("123.456.789-10");
    expect(response.body.address.street).toBe("Street 1");
    expect(response.body.address.number).toBe("123");
    expect(response.body.address.complement).toBe("Complement 1");
    expect(response.body.address.city).toBe("City 1");
    expect(response.body.address.state).toBe("State 1");
    expect(response.body.address.zipCode).toBe("Zip Code 1");
    expect(response.body.items.length).toBe(2);
    expect(response.body.items[0].id).toBe("1");
    expect(response.body.items[0].name).toBe("Product 1");
    expect(response.body.items[0].price).toBe(100);
    expect(response.body.items[1].id).toBe("2");
    expect(response.body.items[1].name).toBe("Product 2");
    expect(response.body.items[1].price).toBe(100);
  });
});