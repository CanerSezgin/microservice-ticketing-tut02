import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { NotFoundError } from './errors/not-found-error';

import { errorHandler } from './middlewares/error-handler';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const checkEnvVars = (envVars: string[]) => {
  const throwErr = (envVar: string) => {
    throw new Error(`${envVar} must be defined`);
  };

  envVars.forEach((envVar) => {
    if (!process.env[envVar]) throwErr(envVar);
  });
};

const startDB = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!!!');
});

const envVars = ['JWT_KEY'];
checkEnvVars(envVars);
startDB();
