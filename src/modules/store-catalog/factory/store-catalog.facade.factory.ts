import StoreCatalogFacade from "../facade/store-catalog.facade";
import StoreCatalogRepository from "../repository/store-catalog.repository";
import AddStoreCatalogUseCase from "../usecase/add-store-catalog/add-store-catalog.usecase";
import FindAllStoreCatalogUseCase from "../usecase/find-all-store-catalog/find-all-store-catalog.usecase";
import FindStoreCatalogUseCase from "../usecase/find-store-catalog/find-store-catalog.usecase";

export default class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacade {
    const storeCatalogRepository = new StoreCatalogRepository();
    const addUseCase = new AddStoreCatalogUseCase(storeCatalogRepository);
    const findUseCase = new FindStoreCatalogUseCase(storeCatalogRepository);
    const findAllUseCase = new FindAllStoreCatalogUseCase(storeCatalogRepository);

    const facade = new StoreCatalogFacade({
      addUseCase: addUseCase,
      findUseCase: findUseCase,
      findAllUseCase: findAllUseCase,
    });
    return facade;
  }
}