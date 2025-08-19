import React, { useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';
import '@aws-amplify/ui-react/styles.css';

// This component will ONLY be rendered by the Authenticator AFTER a successful login.
const PostLoginRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the main content page.
    router.push('/home');
  }, [router]);

  return <div>ログインに成功しました。リダイレクトしています...</div>;
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Authenticator>
          {/* The Authenticator will render this child component upon a successful login */}
          <PostLoginRedirect />
        </Authenticator>
      </div>
    </div>
  );
}
