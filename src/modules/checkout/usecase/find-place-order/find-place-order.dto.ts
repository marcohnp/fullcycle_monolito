import Client from "../../domain/client.entity";
import Product from "../../domain/product.entity";

export interface FindPlaceOrderInputDto {
  id: string;
}

export interface FindPlaceOrderOutputDto {
  id: string;
  client: Client;
  products: Product[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
