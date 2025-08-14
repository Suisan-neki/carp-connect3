import '../src/index.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsConfig from '../lib/aws/config';

Amplify.configure(awsConfig);

export default function App({ Component, pageProps }) {
  return (
    <Authenticator>
      {({ signOut, user }) => {
        const newPageProps = { ...pageProps, user, signOut };
        return <Component {...newPageProps} />;
      }}
    </Authenticator>
  );
}
