import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validationMiddleware, userJwt } from '@cstickets1/common';
import { getUserByEmail } from '../services/auth';
import { Password } from '../services/password';

const router = express.Router();

const validations = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password'),
];

router.post(
  '/api/users/signin',
  [...validations, validationMiddleware],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) throw new BadRequestError('Invalid credentials');

    const passwordMatch = await Password.compare(user.password, password);
    if (!passwordMatch) throw new BadRequestError('Invalid credentials');

    const token = userJwt.generate(user.id, user.email);

    // Store it on session object
    req.session = { jwt: token };
    res.status(200).send(user);
  }
);

export { router as signInRouter };
