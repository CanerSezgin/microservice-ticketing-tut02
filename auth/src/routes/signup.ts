import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import ValidationMiddleware from '../middlewares/validation';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

const validations = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
];

router.post(
  '/api/users/signup',
  [...validations, ValidationMiddleware],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    throw new DatabaseConnectionError();
  }
);

export { router as signUpRouter };
