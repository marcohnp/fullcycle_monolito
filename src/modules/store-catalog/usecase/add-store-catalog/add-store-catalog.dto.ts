export interface AddStoreCatalogInputDto {  
  id?: string;
  name: string;
  description: string;
  salesPrice: number;  
}

export interface AddStoreCatalogOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;  
  createdAt: Date;
  updatedAt: Date;
}