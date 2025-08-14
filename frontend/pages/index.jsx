import Layout from '../components/layout/Layout.jsx';
import Dashboard from '../components/Dashboard.jsx';

export default function Home({ user, signOut }) {
  return (
    <Layout>
      <Dashboard user={user} signOut={signOut} />
    </Layout>
  );
}
