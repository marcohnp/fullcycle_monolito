import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type StoreCatalogProps = {
  id: Id;
  name: string;
  description: string;
  salesPrice: number;
};

export default class StoreCatalog extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _description: string;
  private _salesPrices: number;

  constructor(props: StoreCatalogProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._salesPrices = props.salesPrice;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get salesPrice(): number {
    return this._salesPrices;
  }
}