import request from 'supertest';
import { app } from '../../app';
import { createUser, PAYLOAD } from '../../test/helpers';

it('returns a 201 on successful signup', async () => {
  await createUser();
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: PAYLOAD.EMAIL.INVALID,
      password: PAYLOAD.PASSWORD.VALID,
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: PAYLOAD.EMAIL.VALID,
      password: PAYLOAD.PASSWORD.INVALID,
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: PAYLOAD.EMAIL.VALID })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({ password: PAYLOAD.PASSWORD.VALID })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await createUser();
  await request(app)
    .post('/api/users/signup')
    .send({ email: PAYLOAD.EMAIL.VALID, password: PAYLOAD.PASSWORD.VALID })
    .expect(409);
});

it('sets a cookie after successful signup', async () => {
  const cookie = await createUser();

  expect(cookie).toBeDefined();
});
