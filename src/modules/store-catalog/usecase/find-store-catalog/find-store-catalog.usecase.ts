import StoreCatalogGateway from "../../gateway/store-catalog.gateway";
import { FindStoreCatalogInputDto, FindStoreCatalogOutputDto } from "./find-store-catalog.dto";

export default class FindStoreCatalogUseCase {
  constructor(private productRepository: StoreCatalogGateway) {}

  async execute(input: FindStoreCatalogInputDto): Promise<FindStoreCatalogOutputDto> {
    const product = await this.productRepository.find(input.id);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}