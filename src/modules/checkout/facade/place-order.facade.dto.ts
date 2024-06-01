export interface PlaceOrderFacadeInputDto {
  id?: string;
  clientId: string;  
  products: {
    productId: string;
  }[];  
}

export interface PlaceOrderFacadeOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}

export interface FindPlaceOrderFacadeInputDto {
  id: string;
}

export interface FindPlaceOrderFacadeOutputDto {
  id: string;  
  name: string;
  email: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];  
  status: string;
  createdAt: Date;
}
