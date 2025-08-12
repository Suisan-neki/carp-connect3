import React from 'react';
import ReactDOM from 'react-dom/client';
import IndexPage from './carp-connect-frontend/pages/index.jsx';
import './carp-connect-frontend/lib/aws/config.js'; // Amplifyの設定をインポート

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IndexPage />
  </React.StrictMode>,
);
