import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import OrderItemModel from "../../modules/checkout/repository/order-items.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import StoreCatalogModel from "../../modules/store-catalog/repository/store-catalog.model";
import { checkoutRoute } from "./routes/checkout.route";
import { clientsRoute } from "./routes/clients.route";
import { invoiceRoute } from "./routes/invoice.route";
import { productsRoute } from "./routes/products.route";

export const app: Express = express();
app.use(express.json());
app.use("/products", productsRoute);
app.use("/clients", clientsRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  await sequelize.addModels([
    ProductModel, 
    StoreCatalogModel, 
    ClientModel, 
    OrderModel, 
    OrderItemModel, 
    TransactionModel, 
    InvoiceModel, 
    InvoiceItemModel,
  ]);
  await sequelize.sync();
}
setupDb();