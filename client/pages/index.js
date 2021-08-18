import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

// Fetch Data during SSR
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  try {
    const { data } = await client.get('/api/users/currentuser');
    return data;
  } catch (error) {
    return { error };
  }
};

export default LandingPage;
