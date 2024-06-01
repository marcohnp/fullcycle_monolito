import express, { Request, Response } from 'express';
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.facade.factory';

export const invoiceRoute = express.Router();

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
  const factory = InvoiceFacadeFactory.create();
  try {    
    const output = await factory.find({ id: req.params.id });
    res.send(output);
  } catch (err) {
    res.status(500).send(err)
  }
});
