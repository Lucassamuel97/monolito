import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface"
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Id from "../../@shared/domain/value-object/id.value-object"

type InvoiceItemProps = {
    id?: Id
    name: string
    price: number
}

export default class InvoiceItem extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _price: number;

    constructor(props: InvoiceItemProps) {
        super(props.id);
        this._name = props.name;
        this._price = props.price;
        this.validate();
    }

    get price(): number {
        return this._price;
    }

    get name(): string {
        return this._name;
    }

    validate() {
        if (this.id.id === "") {
            throw new Error("Id is required");
        }

        if (this._name === "") {
            throw new Error("Name is required");
        }

        if (this._price <= 0 || this._price === null) {
            throw new Error("Price is required");
        }
    }

}