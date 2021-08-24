import request from 'supertest';
import { app } from '../../app';
import { mock } from '../../test/helpers';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for pos requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', mock.signIn())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', mock.signIn())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', mock.signIn())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', mock.signIn())
    .send({
      title: 'Ticket Title',
      price: -10,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', mock.signIn())
    .send({
      title: 'Ticket Title',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  const payload = {
    title: 'Ticket Title',
    price: 20
  };

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', mock.signIn())
    .send(payload)
    .expect(201);

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].title).toEqual(payload.title)
    expect(tickets[0].price).toEqual(payload.price)
});
