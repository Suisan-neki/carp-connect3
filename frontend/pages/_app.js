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

  // ウェルカムページ('/')は認証なしで表示
  if (router.pathname === '/') {
    return <Component {...pageProps} />;
  }

  // それ以外のすべてのページは認証を必須とする
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Component {...pageProps} user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}