import nats from 'node-nats-streaming';

const clientId = 'ABC';
const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

console.clear();

stan.on('connect', () => {
  console.log('Publisher connected  to NATS.', `Client ID: ${clientId}`);

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event Published | ticket:created');
  });
});
