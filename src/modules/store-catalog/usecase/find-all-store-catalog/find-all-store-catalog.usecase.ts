import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import StoreCatalogGateway from "../../gateway/store-catalog.gateway";

export default class FindAllStoreCatalogUseCase implements UseCaseInterface {
  constructor(private storeCatalogRepository: StoreCatalogGateway)  {}

  async execute(): Promise<any> {
    const products = await this.storeCatalogRepository.findAll();

    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}