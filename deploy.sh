#!/bin/bash
set -e

STACK_NAME="carp-connect"
ENVIRONMENT="dev"
REGION="ap-northeast-1"
S3_BUCKET="carp-connect-deployment-bucket"

echo "Checking prerequisites..."
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed."
    exit 1
fi
if ! command -v sam &> /dev/null; then
    echo "Error: SAM CLI is not installed."
    exit 1
fi
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS credentials are not configured."
    exit 1
fi
echo "Prerequisites OK."

echo "Checking for S3 deployment bucket..."
aws s3 ls "s3://${S3_BUCKET}" || aws s3 mb "s3://${S3_BUCKET}" --region ${REGION}

echo "Installing backend dependencies..."
cd backend/carp-connect-api
source venv/bin/activate
pip install -r requirements.txt
cd ../..

echo "Building SAM application..."
cd aws-infrastructure
sam build

echo "Deploying SAM application..."
sam deploy --stack-name ${STACK_NAME}-${ENVIRONMENT} --s3-bucket ${S3_BUCKET} --capabilities CAPABILITY_IAM --region ${REGION} --parameter-overrides Environment=${ENVIRONMENT} CognitoDomainPrefix=carp-connect-${ENVIRONMENT}-$(date +%s) --confirm-changeset

echo "Fetching deployment outputs..."
STACK_OUTPUTS=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME}-${ENVIRONMENT} --region ${REGION} --query 'Stacks[0].Outputs' --output json)

echo "Deployment complete!"
echo "Important information:"

USER_POOL_ID=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="UserPoolId") | .OutputValue')
USER_POOL_CLIENT_ID=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="UserPoolClientId") | .OutputValue')
API_GATEWAY_URL=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="ApiGatewayUrl") | .OutputValue')
USER_POOL_DOMAIN=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="UserPoolDomain") | .OutputValue')

echo "Cognito User Pool ID: ${USER_POOL_ID}"
echo "Cognito User Pool Client ID: ${USER_POOL_CLIENT_ID}"
echo "API Gateway URL: ${API_GATEWAY_URL}"
echo "Cognito Domain: ${USER_POOL_DOMAIN}"

echo "Generating frontend environment variables file..."
cd ../frontend/carp-connect-frontend

cat > .env.local << EOF
NEXT_PUBLIC_AWS_REGION=${REGION}
NEXT_PUBLIC_USER_POOL_ID=${USER_POOL_ID}
NEXT_PUBLIC_USER_POOL_CLIENT_ID=${USER_POOL_CLIENT_ID}
NEXT_PUBLIC_API_GATEWAY_URL=${API_GATEWAY_URL}
NEXT_PUBLIC_USER_POOL_DOMAIN=${USER_POOL_DOMAIN}
EOF

echo "Environment file (.env.local) generated."
echo "Deployment complete!"
echo "Application URL: http://localhost:3000 (local development)"
echo "API URL: ${API_GATEWAY_URL}"

cd ../..