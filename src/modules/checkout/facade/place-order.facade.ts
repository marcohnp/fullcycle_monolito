import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindPlaceOrderFacadeInputDto, FindPlaceOrderFacadeOutputDto, PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./place-order.facade.dto";
import PlaceOrderFacadeInterface from "./place-order.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface,
  addUsecase: UseCaseInterface,
}

export default class PlaceOrderFacade implements PlaceOrderFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _addUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._addUsecase = usecaseProps.addUsecase;
    this._findUsecase = usecaseProps.findUsecase;
  }

  async add(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
    const placeOrderInputDto = { 
      id: input.id,     
      clientId: input.clientId,
      products: input.products.map(items => ({
        productId: items.productId
      })),
    };
    
    const usecase = await this._addUsecase.execute(placeOrderInputDto);    

    return {
      id: usecase.id,
      invoiceId: usecase.invoiceId,
      status: usecase.status,
      total: usecase.total,
      products: usecase.products,
    };
  }

  async find(
    input: FindPlaceOrderFacadeInputDto
  ): Promise<FindPlaceOrderFacadeOutputDto> {
    const usecase = await this._findUsecase.execute(input);

    return {
      id: usecase.id,      
      name: usecase.client.name,      
      email: usecase.client.email,
      document: usecase.client.document,
      address: {
        street: usecase.client.address.street,
        number: usecase.client.address.number,
        complement: usecase.client.address.complement,
        city: usecase.client.address.city,
        state: usecase.client.address.state,
        zipCode: usecase.client.address.zipCode,
      },
      items: usecase.products.map((product: any) => ({
        id: product.id.id,        
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),      
      status: usecase.status,
      createdAt: usecase.createdAt,
    };
  }
}
