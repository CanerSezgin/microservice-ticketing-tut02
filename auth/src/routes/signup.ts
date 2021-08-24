import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validationMiddleware, userJwt } from '@cstickets1/common';
import { getUserByEmail, createUser } from '../services/auth';

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
  [...validations, validationMiddleware],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('Email in use');
      throw new BadRequestError('Email in use', 409);
    }

    const user = await createUser(email, password);
    const token = userJwt.generate(user.id, user.email);

    // Store it on session object
    req.session = { jwt: token };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
