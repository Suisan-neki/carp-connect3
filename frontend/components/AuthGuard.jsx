import React, { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function AuthGuard({ children }) {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  useEffect(() => {
    // 認証状態が「未認証」と確定したら、ログインページへハードリフレッシュ
    if (authStatus === 'unauthenticated') {
      window.location.href = '/login';
    }
  }, [authStatus]);

  // 認証済みと確定するまでは、ローディング画面を表示
  if (authStatus !== 'authenticated') {
    return <div>Loading...</div>;
  }

  // 認証済みであれば、保護されたコンテンツを表示
  return children;
}
