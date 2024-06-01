import Id from "../../../@shared/domain/value-object/id.value-object";
import StoreCatalog from "../../domain/store-catalog.entity";
import FindStoreCatalogUseCase from "./find-store-catalog.usecase";

const product = new StoreCatalog({
  id: new Id("1"),
  name: "Product 1",
  description: "Description 1",
  salesPrice: 100,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("find a store catalog usecase unit test", () => {
  it("should find a store catalog", async () => {
    const storeCatalogRepository = MockRepository();
    const usecase = new FindStoreCatalogUseCase(storeCatalogRepository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(storeCatalogRepository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Product 1");
    expect(result.description).toBe("Description 1");
    expect(result.salesPrice).toBe(100);
  });
})