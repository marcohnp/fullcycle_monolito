import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

const input = {
    name: "Invoice 1",
    document: "123",
    street: "Street 1",
    number: "1",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "Zip Code 1",
    items: [
        { id: "1", name: "Item 1", price: 100 },
        { id: "2", name: "Item 2", price: 200 },
    ],
};

describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create an invoice", async () => {
        const facade = InvoiceFacadeFactory.create();

        const output = await facade.generate(input);

        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.document).toBe(input.document);
        expect(output.items.length).toBe(2);
        expect(output.items[0].name).toEqual(input.items[0].name);
        expect(output.items[0].price).toEqual(input.items[0].price);
        expect(output.items[0].id).toEqual(input.items[0].id);
        expect(output.items[1].name).toEqual(input.items[1].name);
        expect(output.items[1].price).toEqual(input.items[1].price);
        expect(output.items[1].id).toEqual(input.items[1].id);
        expect(output.total).toBe(300);
    })

    it("should find an invoice", async () => {
        const facade = InvoiceFacadeFactory.create();

        const invoice = await facade.generate(input);

        const output = await facade.find({ id: invoice.id });

        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.document).toBe(input.document);
        expect(output.items.length).toBe(2);
        expect(output.items[0].name).toEqual(input.items[0].name);
        expect(output.items[0].price).toEqual(input.items[0].price);
        expect(output.items[0].id).toEqual(input.items[0].id);
        expect(output.items[1].name).toEqual(input.items[1].name);
        expect(output.items[1].price).toEqual(input.items[1].price);
        expect(output.items[1].id).toEqual(input.items[1].id);
        expect(output.total).toBe(300);
    })
})