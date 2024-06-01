import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import StoreCatalog from "../domain/store-catalog.entity";
import StoreCatalogModel from "./store-catalog.model";
import StoreCatalogRepository from "./store-catalog.repository";

describe("StoreCatalogRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([StoreCatalogModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a store catalog", async () => {
    const storeCatalogProps = {
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,      
    };
    const storeCatalog = new StoreCatalog(storeCatalogProps);
    const storeCatalogRepository = new StoreCatalogRepository();
    await storeCatalogRepository.add(storeCatalog);

    const storeCatalogDb = await StoreCatalogModel.findOne({
      where: { id: storeCatalogProps.id.id },
    });

    expect(storeCatalogProps.id.id).toEqual(storeCatalogDb.id);
    expect(storeCatalogProps.name).toEqual(storeCatalogDb.name);
    expect(storeCatalogProps.description).toEqual(storeCatalogDb.description);
    expect(storeCatalogProps.salesPrice).toEqual(storeCatalogDb.salesPrice);    
  }); 

  it("should find all store catalog", async () => {
    await StoreCatalogModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
    });

    await StoreCatalogModel.create({
      id: "2",
      name: "Product 2",
      description: "Description 2",
      salesPrice: 200,
    });

    const storeCatalogRepository = new StoreCatalogRepository();
    const storeCatalog = await storeCatalogRepository.findAll();
    
    expect(storeCatalog.length).toBe(2);
    expect(storeCatalog[0].id.id).toBe("1");
    expect(storeCatalog[0].name).toBe("Product 1");
    expect(storeCatalog[0].description).toBe("Description 1");
    expect(storeCatalog[0].salesPrice).toBe(100);
    expect(storeCatalog[1].id.id).toBe("2");
    expect(storeCatalog[1].name).toBe("Product 2");
    expect(storeCatalog[1].description).toBe("Description 2");
    expect(storeCatalog[1].salesPrice).toBe(200);
  });

  it("should find a store catalog", async () => {
    await StoreCatalogModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
    });    

    const storeCatalogRepository = new StoreCatalogRepository();
    const storeCatalog = await storeCatalogRepository.find("1");
        
    expect(storeCatalog.id.id).toBe("1");
    expect(storeCatalog.name).toBe("Product 1");
    expect(storeCatalog.description).toBe("Description 1");
    expect(storeCatalog.salesPrice).toBe(100);    
  })
})