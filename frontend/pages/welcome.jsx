import React, { useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';

export default function WelcomePage({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Welcome Message Section */}
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">カープコネクトをはじめよう</h1>
        <p className="text-xl text-gray-700">スクロールしてログインまたは新規登録</p>
      </div>

      {/* Spacer to allow scrolling */}
      <div className="h-screen"></div> 

      {/* Authenticator Section (conditionally rendered) */}
      {!user && (
        <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mb-12">
          <Authenticator />
        </div>
      )}
    </div>
  );
}

