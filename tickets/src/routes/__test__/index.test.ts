import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { mock } from '../../test/helpers';

const createTicket = async () => {
  return request(app).post('/api/tickets').set('Cookie', mock().signIn()).send({
    title: 'Title 1',
    price: 20,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
