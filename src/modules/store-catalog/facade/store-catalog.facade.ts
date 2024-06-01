import { AddStoreCatalogInputDto, AddStoreCatalogOutputDto } from "../usecase/add-store-catalog/add-store-catalog.dto";
import AddStoreCatalogUseCase from "../usecase/add-store-catalog/add-store-catalog.usecase";
import FindAllStoreCatalogUseCase from "../usecase/find-all-store-catalog/find-all-store-catalog.usecase";
import FindStoreCatalogUseCase from "../usecase/find-store-catalog/find-store-catalog.usecase";
import StoreCatalogFacadeInterface, { FindAllStoreCatalogFacadeOutputDto, FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
  addUseCase: AddStoreCatalogUseCase,
  findUseCase: FindStoreCatalogUseCase,
  findAllUseCase: FindAllStoreCatalogUseCase,
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _addUseCase: AddStoreCatalogUseCase;
  private _findUseCase: FindStoreCatalogUseCase;
  private _findAllUseCase: FindAllStoreCatalogUseCase;

  constructor(props: UseCaseProps) {
    this._addUseCase = props.addUseCase;
    this._findUseCase = props.findUseCase;
    this._findAllUseCase = props.findAllUseCase
  }

  async add(input: AddStoreCatalogInputDto): Promise<AddStoreCatalogOutputDto> {
    return await this._addUseCase.execute(input)
  }

  async find(id: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUseCase.execute(id);    
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return await this._findAllUseCase.execute();
  }
}
