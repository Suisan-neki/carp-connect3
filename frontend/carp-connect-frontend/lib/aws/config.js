import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
      userPoolId: import.meta.env.VITE_USER_POOL_ID || 'ap-northeast-1_XXXXXXXXX',
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: true,
      },
    },
  },
  API: {
    REST: {
      CarpConnectAPI: {
        endpoint: import.meta.env.VITE_API_GATEWAY_URL || 'https://api.example.com',
        region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
      },
    },
  },
};

// Amplifyの設定を初期化
Amplify.configure(awsConfig );

export default awsConfig;
