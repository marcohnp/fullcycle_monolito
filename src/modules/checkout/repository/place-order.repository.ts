import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderItemModel from "./order-items.model";
import OrderModel from "./order.model";

export default class PlaceOrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        clientId: order.client.id.id,
        name: order.client.name,
        email: order.client.email,
        document: order.client.document,
        street: order.client.address.street,
        number: order.client.address.number,
        complement: order.client.address.complement,
        city: order.client.address.city,
        state: order.client.address.state,
        zipCode: order.client.address.zipCode,
        items: order.products.map((items) => ({
          id: items.id.id,
          name: items.name,
          description: items.description,
          salesPrice: items.salesPrice,
          orderId: order.id.id,
        })),
        total: order.products.reduce((acc, items) => (acc + items.salesPrice), 0),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      {
        include: [{ model: OrderItemModel }]        
      }
    );
  }
  
  async findOrder(id: string): Promise<Order | null> {
    const order = await OrderModel.findOne({ 
      where: { id },
      include: ["items"]
    });

    if (!order) {
      throw new Error("Order not found");
    }  

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.clientId),
        name: order.name,
        email: order.email,
        document: order.document,
        address: new Address({
          street: order.street,
          number: order.number,
          complement: order.complement,
          city: order.city,
          state: order.state,
          zipCode: order.zipCode,
        })
      }),      
      products: order.items.map((items) => 
        new Product({
          id: new Id(items.id), 
          name: items.name,
          description: items.description,
          salesPrice: items.salesPrice,
        })
      ),
      status: order.status,
    });    
  }
}