import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

const clientId = randomBytes(4).toString('hex');
const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

console.clear();

stan.on('connect', () => {
  console.log('Listener connected to NATS.', `Client ID: ${clientId}`);

  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group'
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof data === 'string') {
      console.log(
        `Subject: ${msg.getSubject()}`,
        `Received event #${msg.getSequence()}, with data:`,
        JSON.parse(data)
      );
    }
  });
});
