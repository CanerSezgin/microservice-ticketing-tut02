import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  console.log('APP GET_INIT_PROPS');
  const client = buildClient(appContext.ctx);

  const r = await client
    .get('/api/users/currentuser')
    .catch((e) => ({ data: {} }));
  const { currentUser } = r.data;

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    currentUser,
    pageProps,
  };
};

export default AppComponent;
