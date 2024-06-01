import express, { Request, Response } from 'express';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';

export const productsRoute = express.Router();

productsRoute.post('/', async (req: Request, res: Response) => {
  const facade = ProductAdmFacadeFactory.create();
  try {
    const productDto = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      salesPrice: req.body.salesPrice,
      stock: req.body.stock,
    };

    const output = await facade.addProduct(productDto);

    res.send(output);
  } catch (err) {
    res.status(500).send(err)
  }
});

productsRoute.get('/:id', async (req: Request, res: Response) => {
  const factory = ProductAdmFacadeFactory.create();
  try {    
    const output = await factory.checkStock({ productId: req.params.id });
    res.send(output);
  } catch (err) {
    res.status(500).send(err)
  }
});
