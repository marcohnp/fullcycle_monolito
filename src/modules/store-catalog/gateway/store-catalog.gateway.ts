import StoreCatalog from "../domain/store-catalog.entity";

export default interface StoreCatalogGateway {
  add(storeCatalog: StoreCatalog): Promise<void>;
  findAll(): Promise<StoreCatalog[]>;
  find(id: string): Promise<StoreCatalog>;
}