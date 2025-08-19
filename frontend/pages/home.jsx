import Layout from '../components/layout/Layout.jsx';
import Dashboard from '../components/Dashboard.jsx';
import AuthGuard from '../components/AuthGuard.jsx';
import { Authenticator } from '@aws-amplify/ui-react';

export default function HomePage() {
  return (
    // AuthGuardやuseAuthenticatorフックを使うコンポーネントは、Providerで囲む必要があります
    <Authenticator.Provider>
      <AuthGuard>
        <Layout>
          {/* user情報はここで渡さず、Dashboard自身が取得するように変更します */}
          <Dashboard />
        </Layout>
      </AuthGuard>
    </Authenticator.Provider>
  );
}
