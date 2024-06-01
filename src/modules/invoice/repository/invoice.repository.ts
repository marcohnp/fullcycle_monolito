import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async generate(invoice: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item: InvoiceItem) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.total,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        },
            {
                include: [InvoiceItemModel],
            })
    }

    async find(id: string): Promise<Invoice> {
        return InvoiceModel.findOne({
            where: {
                id,
            },
            include: [InvoiceItemModel],
        }).then((invoice: InvoiceModel) => {
            return new Invoice({
                id: new Id(invoice.id),
                name: invoice.name,
                document: invoice.document,
                address: new Address({
                    street: invoice.street,
                    number: invoice.number,
                    complement: invoice.complement,
                    city: invoice.city,
                    state: invoice.state,
                    zipCode: invoice.zipCode,
                }),
                items: invoice.items.map(
                    (item: any) =>
                        new InvoiceItem({
                            id: new Id(item.id),
                            name: item.name,
                            price: item.price,
                        })
                ),
                createdAt: invoice.createdAt,
            });
        });
    }

}