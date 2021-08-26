import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import {
  ForbiddenError,
  NotFoundError,
  requireAuth,
  validationMiddleware,
} from '@cstickets1/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

const validations = [
  body('title').not().isEmpty().withMessage('Title is required.'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];

router.put(
  '/api/tickets/:id',
  requireAuth,
  [...validations, validationMiddleware],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new ForbiddenError();
    }

    ticket.set({ title, price });
    await ticket.save();

    return res.status(200).json(ticket);
  }
);

export { router as updateTicketRouter };
