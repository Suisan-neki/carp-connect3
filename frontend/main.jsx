import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import IndexPage from './carp-connect-frontend/pages/index.jsx';
import './carp-connect-frontend/src/index.css';
import awsConfig from './carp-connect-frontend/lib/aws/config.js';

Amplify.configure(awsConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Authenticator>
      {({ signOut, user }) => (
        <IndexPage user={user} signOut={signOut} />
      )}
    </Authenticator>
  </React.StrictMode>,
);
