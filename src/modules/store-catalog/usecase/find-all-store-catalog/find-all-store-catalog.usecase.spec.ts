import Id from "../../../@shared/domain/value-object/id.value-object";
import StoreCatalog from "../../domain/store-catalog.entity";
import FindAllStoreCatalogUseCase from "./find-all-store-catalog.usecase";

const storeCatalog1 = new StoreCatalog({
  id: new Id("1"),
  name: "Product 1",
  description: "Description 1",
  salesPrice: 100,
});

const storeCatalog2 = new StoreCatalog({
  id: new Id("2"),
  name: "Product 2",
  description: "Description 2",
  salesPrice: 200,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([storeCatalog1, storeCatalog2])),
  };
};

describe("find all store catalog usecase unit test", () => {
  it("should find all store catalog", async () => {
    const storeCatalogRepository = MockRepository();
    const usecase = new FindAllStoreCatalogUseCase(storeCatalogRepository);

    const result = await usecase.execute();

    expect(storeCatalogRepository.findAll).toHaveBeenCalled();
    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe("1");
    expect(result.products[0].name).toBe("Product 1");
    expect(result.products[0].description).toBe("Description 1");
    expect(result.products[0].salesPrice).toBe(100);
    expect(result.products[1].id).toBe("2");
    expect(result.products[1].name).toBe("Product 2");
    expect(result.products[1].description).toBe("Description 2");
    expect(result.products[1].salesPrice).toBe(200);
  });
});