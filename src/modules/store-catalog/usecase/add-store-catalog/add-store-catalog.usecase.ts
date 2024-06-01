import Id from "../../../@shared/domain/value-object/id.value-object";
import StoreCatalog from "../../domain/store-catalog.entity";
import StoreCatalogGateway from "../../gateway/store-catalog.gateway";
import { AddStoreCatalogInputDto, AddStoreCatalogOutputDto } from "./add-store-catalog.dto";

export default class AddStoreCatalogUseCase {

  private _storeCatalogRepository: StoreCatalogGateway;

  constructor(_storeCatalogRepository: StoreCatalogGateway) {
    this._storeCatalogRepository = _storeCatalogRepository;
  }

  async execute(input: AddStoreCatalogInputDto): Promise<AddStoreCatalogOutputDto> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      salesPrice: input.salesPrice,      
    };

    const product = new StoreCatalog(props);
    this._storeCatalogRepository.add(product);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,      
      salesPrice: product.salesPrice,      
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}