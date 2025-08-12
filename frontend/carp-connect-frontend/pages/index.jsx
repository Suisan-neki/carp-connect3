import { useState, useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';
import Layout from '../components/layout/Layout.jsx';
import Dashboard from '../components/Dashboard.jsx';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('User not authenticated');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Layout>
          <Dashboard user={user} />
        </Layout>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                カープコネクト
              </h1>
              <p className="text-xl text-red-100 mb-8">
                カープを通じて広島の若者が繋がる
              </p>
            </div>
            
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
              <Authenticator
                signUpAttributes={[
                  'email',
                  'phone_number',
                  'name',
                  'birthdate',
                ]}
                formFields={{
                  signUp: {
                    name: {
                      label: '氏名',
                      placeholder: '山田太郎',
                      required: true,
                    },
                    email: {
                      label: 'メールアドレス',
                      placeholder: 'example@email.com',
                      required: true,
                    },
                    phone_number: {
                      label: '電話番号',
                      placeholder: '+81-90-1234-5678',
                      required: true,
                    },
                    birthdate: {
                      label: '生年月日',
                      placeholder: '1995-01-01',
                      required: true,
                    },
                    password: {
                      label: 'パスワード',
                      placeholder: 'パスワードを入力',
                      required: true,
                    },
                    confirm_password: {
                      label: 'パスワード確認',
                      placeholder: 'パスワードを再入力',
                      required: true,
                    },
                  },
                }}
              >
                {({ signOut, user }) => (
                  <Layout>
                    <Dashboard user={user} signOut={signOut} />
                  </Layout>
                )}
              </Authenticator>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

