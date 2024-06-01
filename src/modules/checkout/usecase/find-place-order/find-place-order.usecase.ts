import CheckoutGateway from "../../gateway/checkout.gateway";
import Product from "../../domain/product.entity";
import { FindPlaceOrderInputDto, FindPlaceOrderOutputDto } from "./find-place-order.dto";
import Id from "../../../@shared/domain/value-object/id.value-object";

export default class FindPlaceOrderUseCase {
  private _placeOrderRepository: CheckoutGateway;
  
  constructor(placeOrderRepository: CheckoutGateway) {
    this._placeOrderRepository = placeOrderRepository;
  }

  async execute(input: FindPlaceOrderInputDto): Promise<FindPlaceOrderOutputDto> {
    const result = await this._placeOrderRepository.findOrder(input.id);    

    return {
      id: result.id.id,
      client: result.client,
      products: result.products.map(product => 
        new Product({
          id: new Id(product.id.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })
      ),      
      status: result.status, 
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
