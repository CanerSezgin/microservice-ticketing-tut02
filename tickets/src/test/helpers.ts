import { userJwt } from '@cstickets1/common';

export const mock = {
  user: {
    id: '56d4fasf5',
    email: 'test@test.com',
  },
  signIn(): string[] {
    const token = userJwt.generate(this.user.id, this.user.email);

    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`express:sess=${base64}`];
  },
};
