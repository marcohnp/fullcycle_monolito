import Id from "../../@shared/domain/value-object/id.value-object";
import StoreCatalog from "../domain/store-catalog.entity";
import StoreCatalogGateway from "../gateway/store-catalog.gateway";
import StoreCatalogModel from "./store-catalog.model";

export default class StoreCatalogRepository implements StoreCatalogGateway {
  async add(storeCatalog: StoreCatalog): Promise<void> {
    console.log("testern13123")
    console.log("repositoru, create, storeCatalog: "+ storeCatalog)
    await StoreCatalogModel.create({
      id: storeCatalog.id.id,
      name: storeCatalog.name,
      description: storeCatalog.description,      
      salesPrice: storeCatalog.salesPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<StoreCatalog[]> {
    const storeCatalog = await StoreCatalogModel.findAll();

    return storeCatalog.map((product) =>
      new StoreCatalog({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })
    );
  }

  async find(id: string): Promise<StoreCatalog> {
    console.log("repositoru, id: "+ id)
    const product = await StoreCatalogModel.findOne({ 
      where: {
        id,
      },
    });

    console.log("repositoru, product: "+ product)

    return new StoreCatalog({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
