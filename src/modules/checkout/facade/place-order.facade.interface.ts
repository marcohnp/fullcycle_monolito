import { PlaceOrderFacadeInputDto, FindPlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto, FindPlaceOrderFacadeOutputDto } from "./place-order.facade.dto"

export default interface PlaceOrderFacadeInterface {
  add(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
  find(input: FindPlaceOrderFacadeInputDto): Promise<FindPlaceOrderFacadeOutputDto>;
}
