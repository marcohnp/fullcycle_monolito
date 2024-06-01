export interface FindAllStoreCatalogDto {
  products: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];
}
