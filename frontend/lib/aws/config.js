const awsConfig = {
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
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
        endpoint: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      },
    },
  },
};

export default awsConfig;
