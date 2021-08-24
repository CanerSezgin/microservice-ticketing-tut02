import { User } from '../models/user';

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const createUser = async (email: string, password: string) => {
  const user = User.build({ email, password });
  await user.save();
  return user;
};

