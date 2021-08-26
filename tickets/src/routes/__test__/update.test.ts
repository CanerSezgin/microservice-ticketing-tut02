import request from 'supertest';
import { app } from '../../app';
import { mock } from '../../test/helpers';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', mock().signIn())
    .send({
      title: 'sdasg',
      price: 20,
    })
    .expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sdasg',
      price: 20,
    })
    .expect(401);
});

it('returns a 403 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', mock().signIn())
    .send({
      title: 'sdasg',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', mock().signIn())
    .send({
      title: 'changed title',
      price: 100,
    })
    .expect(403);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = mock().signIn();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'sdasg',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'valid title',
      price: -100,
    })
    .expect(400);
});

it('updates the ticket with provided valid inputs', async () => {
  const cookie = mock().signIn();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'sdasg',
      price: 20,
    });

  const ticketId = response.body.id;
  const newTicketPayload = {
    title: 'valid title',
    price: 100,
  }
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send(newTicketPayload)
    .expect(200);

  const ticketResponse = await request(app).get(`/api/tickets/${ticketId}`).send().expect(200)
  expect(ticketResponse.body.title).toEqual(newTicketPayload.title)
  expect(ticketResponse.body.price).toEqual(newTicketPayload.price)
});
