import jwt from 'jsonwebtoken';
import { User } from '../models/user';

interface UserJWTPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserJWTPayload;
    }
  }
}

class UserJWT {
  private key = process.env.JWT_KEY!;
  generate(userId: string, email: string) {
    const userJwt = jwt.sign(
      {
        id: userId,
        email: email,
      },
      this.key
    );
    return userJwt;
  }

  verify(token: string): UserJWTPayload {
    return jwt.verify(token, this.key) as UserJWTPayload;
  }
}

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const createUser = async (email: string, password: string) => {
  const user = User.build({ email, password });
  await user.save();
  return user;
};

export const userJwt = new UserJWT();
