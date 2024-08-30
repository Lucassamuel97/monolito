import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface"
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Address from "../../@shared/domain/value-object/address"
import Id from "../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "./invoice_item.entity"

type InvoiceProps = {
  id?: Id
  name: string
  document: string
  address: Address
  items: InvoiceItem[]
  createdAt?: Date
  updatedAt?: Date
}

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address
  private _items: InvoiceItem[];
  private _total: number = 0;

  constructor(props: InvoiceProps) {
    super(props.id);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
    this._total = this.total();
    this.validate();
  }

  get name(): string {
    return this._name
  }

  get document(): string {
    return this._document
  }

  get address(): Address {
    return this._address
  }

  get items(): InvoiceItem[] {
    return this._items;
  }

  validate(): boolean {
    if (this.id.id === "") {
      throw new Error("Id is required");
    }
    if (this._name === "") {
      throw new Error("Name is required");
    }
    if (this._document === "") {
      throw new Error("Document is required");
    }
    if (this._address === null) {
      throw new Error("Address is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }
    
    return true;
  }

  addItem(item: InvoiceItem): void {
    this._items.push(item);
  }

  removeItem(itemId: Id): void {
    const index = this._items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      this._items.splice(index, 1);
      this._total = this.total();
    }
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }
}