export interface PlaceOrderInputDto {
  id?: string,
  clientId: string;
  products: {
    productId: string;
  }[];  
}

export interface PlaceOrderOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}
