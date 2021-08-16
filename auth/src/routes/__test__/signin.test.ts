import request from 'supertest';
import { app } from '../../app';
import { createUser, PAYLOAD } from '../../test/helpers';

it('fails when a email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: PAYLOAD.EMAIL.VALID,
      password: PAYLOAD.PASSWORD.VALID,
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await createUser();
  await request(app)
    .post('/api/users/signin')
    .send({
      email: PAYLOAD.EMAIL.VALID,
      password: `${PAYLOAD.PASSWORD.VALID}_WRONG`,
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await createUser();
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: PAYLOAD.EMAIL.VALID,
      password: `${PAYLOAD.PASSWORD.VALID}`,
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
