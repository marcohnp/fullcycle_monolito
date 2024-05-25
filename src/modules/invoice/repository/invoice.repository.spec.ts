import { Sequelize } from "sequelize-typescript";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item.entity";
import InvoiceRepository from "./invoice.repository";

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
    address: new Address(
        "Street 1",
        "123",
        "Complement 1",
        "City 1",
        "State 1",
        "Zip Code 1"
    ),
    items: [new InvoiceItem(invoiceItemProps1), new InvoiceItem(invoiceItemProps2)],
    createdAt: new Date(),
    updatedAt: new Date(),
}


describe("InvoiceRepository test", () => {
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
        const invoice = new Invoice(invoiceProps);
        const invoiceRepository = new InvoiceRepository();
        await invoiceRepository.generate(invoice);

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: invoiceProps.id.id },
            include: ["items"],
        });

        expect(invoiceDb.id).toEqual(invoiceProps.id.id);
        expect(invoiceDb.name).toEqual(invoiceProps.name);
        expect(invoiceDb.document).toEqual(invoiceDb.document);
        expect(invoiceDb.street).toEqual(invoiceProps.address.street);
        expect(invoiceDb.number).toEqual(invoiceProps.address.number);
        expect(invoiceDb.complement).toEqual(invoiceProps.address.complement);
        expect(invoiceDb.city).toEqual(invoiceProps.address.city);
        expect(invoiceDb.state).toEqual(invoiceProps.address.state);
        expect(invoiceDb.zipCode).toEqual(invoiceProps.address.zipCode);
        expect(invoiceDb.items.length).toEqual(invoiceProps.items.length);
        expect(invoiceDb.items[0].name).toEqual(invoiceProps.items[0].name);
        expect(invoiceDb.items[0].price).toEqual(invoiceProps.items[0].price);
        expect(invoiceDb.items[0].id).toEqual(invoiceProps.items[0].id.id);
        expect(invoiceDb.items[1].name).toEqual(invoiceProps.items[1].name);
        expect(invoiceDb.items[1].price).toEqual(invoiceProps.items[1].price);
        expect(invoiceDb.items[1].id).toEqual(invoiceProps.items[1].id.id);
        expect(invoiceDb.total).toBe(
            invoice.items.reduce((total_price, item) => total_price + item.price, 0)
        );
    })

    it("should find an invoice", async () => {
        const invoice = new Invoice(invoiceProps);
        const invoiceRepository = new InvoiceRepository();
        await invoiceRepository.generate(invoice);

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: invoiceProps.id.id },
            include: ["items"],
        });

        const result = await invoiceRepository.find(invoiceDb.id);

        expect(result.id.id).toEqual(invoiceProps.id.id);
        expect(result.name).toEqual(invoiceProps.name);
        expect(result.document).toEqual(invoiceProps.document);
        expect(result.address.street).toEqual(invoiceProps.address.street);
        expect(result.address.number).toEqual(invoiceProps.address.number);
        expect(result.address.complement).toEqual(invoiceProps.address.complement);
        expect(result.address.city).toEqual(invoiceProps.address.city);
        expect(result.address.state).toEqual(invoiceProps.address.state);
        expect(result.address.zipCode).toEqual(invoiceProps.address.zipCode);
        expect(result.items.length).toEqual(invoiceProps.items.length);
        expect(result.items[0].name).toEqual(invoiceProps.items[0].name);
        expect(result.items[0].price).toEqual(invoiceProps.items[0].price);
        expect(result.items[0].id.id).toEqual(invoiceProps.items[0].id.id);
        expect(result.items[1].name).toEqual(invoiceProps.items[1].name);
        expect(result.items[1].price).toEqual(invoiceProps.items[1].price);
        expect(result.items[1].id.id).toEqual(invoiceProps.items[1].id.id);
        expect(result.total).toBe(
            invoice.items.reduce((total_price, item) => total_price + item.price, 0)
        );

    })
})
