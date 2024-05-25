import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn()
    };
};

const inputDto = {
    name: "invoice test",
    document: "123",
    street: "street test",
    number: "123",
    complement: "complement",
    city: "city test",
    state: "state test",
    zipCode: "123",
    items: [
        {
            id: "1",
            name: "item test",
            price: 100
        },
        {
            id: "2",
            name: "item test 2",
            price: 200
        }
    ]
}

describe("Generate Invoice usecase unit test", () => {

    it("should generate invoice", async () => {
        const repository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(repository);

        const result = await usecase.execute(inputDto);

        expect(repository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(inputDto.name);
        expect(result.document).toEqual(inputDto.document);
        expect(result.street).toEqual(inputDto.street);
        expect(result.number).toEqual(inputDto.number);
        expect(result.complement).toEqual(inputDto.complement);
        expect(result.city).toEqual(inputDto.city);
        expect(result.state).toEqual(inputDto.state);
        expect(result.zipCode).toEqual(inputDto.zipCode);
        expect(result.items.length).toEqual(inputDto.items.length);
        expect(result.items[0].name).toEqual(inputDto.items[0].name);
        expect(result.items[0].price).toEqual(inputDto.items[0].price);
        expect(result.items[0].id).toEqual(inputDto.items[0].id);
        expect(result.total).toBe(
            result.items.reduce((total_price, item) => total_price + item.price, 0)
        );
    })
})