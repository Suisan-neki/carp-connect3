import '../src/index.css';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsConfig from '../lib/aws/config';
import { I18n } from 'aws-amplify/utils';
import { translations } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';

Amplify.configure(awsConfig);

I18n.putVocabularies(translations);
I18n.setLanguage('ja');

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <Authenticator>
      {({ signOut, user }) => {
        // If authenticated, and on welcome page, redirect to home
        if (user && router.pathname === '/welcome') {
          router.push('/');
          return null; // Prevent rendering until redirect completes
        }

        // If not authenticated, and not on welcome page, redirect to welcome
        if (!user && router.pathname !== '/welcome') {
          router.push('/welcome');
          return null; // Prevent rendering until redirect completes
        }

        // If authenticated, or not authenticated but on welcome page, render the component
        return <Component {...pageProps} user={user} signOut={signOut} />;
      }}
    </Authenticator>
  );
}
