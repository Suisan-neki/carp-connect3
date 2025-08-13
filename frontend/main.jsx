import React from 'react';
import ReactDOM from 'react-dom/client';
import IndexPage from './carp-connect-frontend/pages/index.jsx';
import Layout from './carp-connect-frontend/components/layout/Layout.jsx';
import './carp-connect-frontend/src/index.css';
import './carp-connect-frontend/lib/aws/config.js'; // Amplifyの設定をインポート

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout>
      <IndexPage />
    </Layout>
  </React.StrictMode>,
);
