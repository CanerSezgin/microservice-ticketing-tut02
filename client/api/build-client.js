import axios from 'axios';

export default ({ req }) => {
  const isServer = typeof window === 'undefined';

  console.log({ isServer });
  return axios.create({
    baseURL: isServer
      ? 'http://auth-srv:3000' ||
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
      : '',
    headers: isServer ? req.headers : {},
  });
};
