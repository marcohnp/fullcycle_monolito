import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
    id: new Id("1"),
    name: "Invoice 1",
    document: "123.456.789-10",
    address: new Address(
        "Street 1",
        "123",
        "Complement 1",
        "City 1",
        "State 1",
        "12345-678"
    ),
    items: [new InvoiceItem({
        id: new Id("1"),
        name: "Item 1",
        price: 100
    }), new InvoiceItem({
        id: new Id("2"),
        name: "Item 2",
        price: 200
    })],
    createdAt: new Date(),
    updatedAt: new Date(),
});

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    }
}

describe("Find invoice use case unit test", () => {
    it("should find a invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);

        const inputDto = {
            id: "1"
        }

        const result = await usecase.execute(inputDto);

        expect(invoiceRepository.find).toHaveBeenCalled();
        expect(result.id).toBe(invoice.id.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.address.street).toBe(invoice.address.street);
        expect(result.address.number).toBe(invoice.address.number);
        expect(result.address.complement).toBe(invoice.address.complement);
        expect(result.address.city).toBe(invoice.address.city);
        expect(result.address.state).toBe(invoice.address.state);
        expect(result.address.zipCode).toBe(invoice.address.zipCode);
        expect(result.items.length).toEqual(invoice.items.length);
        expect(result.items[0].name).toBe(invoice.items[0].name);
        expect(result.items[0].price).toBe(invoice.items[0].price);
        expect(result.items[0].id).toBe(invoice.items[0].id.id);
        expect(result.items[1].name).toBe(invoice.items[1].name);
        expect(result.items[1].price).toBe(invoice.items[1].price);
        expect(result.items[1].id).toBe(invoice.items[1].id.id);
        expect(result.total).toBe(
            invoice.items.reduce((total_price, item) => total_price + item.price, 0)
          );
    });

});

