import { Amplify } from \'aws-amplify\';

const awsConfig = {
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_AWS_REGION || \'ap-northeast-1\',
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || \'ap-northeast-1_XXXXXXXXX\',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || \'xxxxxxxxxxxxxxxxxxxxxxxxxx\',
      signUpVerificationMethod: \'code\',
      loginWith: {
        email: true,
        phone: true,
      },
    },
  },
  API: {
    REST: {
      CarpConnectAPI: {
        endpoint: process.env.NEXT_PUBLIC_API_GATEWAY_URL || \'https://api.example.com\',
        region: process.env.NEXT_PUBLIC_AWS_REGION || \'ap-northeast-1\',
      },
    },
  },
};

// Amplifyの設定を初期化
Amplify.configure(awsConfig );

export default awsConfig;
