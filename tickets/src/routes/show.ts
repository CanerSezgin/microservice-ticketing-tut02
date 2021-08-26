import express, { Request, Response } from 'express';
import { NotFoundError } from '@cstickets1/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id)

    if(!ticket) {
        throw new NotFoundError()
    }

    return res.status(200).json(ticket)

  }
);

export { router as showTicketRouter };
