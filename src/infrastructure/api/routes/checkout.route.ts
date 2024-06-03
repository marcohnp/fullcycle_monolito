import express, { Request, Response } from 'express';
import PlaceOrderFacadeFactory from '../../../modules/checkout/factory/place-order.facade.factory'

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
  const facade = PlaceOrderFacadeFactory.create();
  try {
    const input = {
      id: req.body.id,
      clientId: req.body.clientId,
      products: req.body.products,
    };    

    const output = await facade.add(input);
    res.send(output);
  } catch (err) {
    res.status(500).send(err)
  }
});

checkoutRoute.get('/:id', async (req: Request, res: Response) => {
  const factory = PlaceOrderFacadeFactory.create();
  try {    
    const output = await factory.find({ id: req.params.id });
    res.send(output);
  } catch (err) {
    res.status(500).send(err)
  }
});
