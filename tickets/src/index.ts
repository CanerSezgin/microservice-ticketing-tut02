import mongoose from 'mongoose';
import { app } from './app';

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
    await mongoose.connect(process.env.MONGO_URI!, {
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

const envVars = ['JWT_KEY', 'MONGO_URI'];
checkEnvVars(envVars);
startDB();
