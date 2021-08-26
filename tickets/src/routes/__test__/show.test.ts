import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { mock } from '../../test/helpers';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const ticket = {
    title: 'concert',
    price: 20,
  };

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', mock().signIn())
    .send(ticket)
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(ticket.title);
  expect(ticketResponse.body.price).toEqual(ticket.price);
});
