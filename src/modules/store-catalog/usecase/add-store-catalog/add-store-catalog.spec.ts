import AddStoreCatalogUseCase from "./add-store-catalog.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
  };
};

describe("Add Store Catalog usecase unit test", () => {
  
  it("should add a store catalog", async() => {    
    const storeCatalogRepository = MockRepository();    
    const usecase = new AddStoreCatalogUseCase(storeCatalogRepository);
    
    const input = {
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,      
    };

    const result = await usecase.execute(input);
    
    expect(storeCatalogRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
    expect(result.salesPrice).toBe(input.salesPrice);    
  });
});