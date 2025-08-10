#!/bin/bash

# カープコネクト デプロイスクリプト
# AWS SAMを使用してサーバーレスアプリケーションをデプロイ

set -e

# 設定
STACK_NAME="carp-connect"
ENVIRONMENT="dev"
REGION="ap-northeast-1"
S3_BUCKET="carp-connect-deployment-bucket"

# カラー出力用
RED=\'\\033[0;31m\'
GREEN=\'\\033[0;32m\'
YELLOW=\'\\033[1;33m\'
NC=\'\\033[0m\' # No Color

echo -e "${GREEN}🚀 カープコネクト デプロイ開始${NC}"

# 前提条件のチェック
echo -e "${YELLOW}📋 前提条件をチェック中...${NC}"

# AWS CLIの確認
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLIがインストールされていません${NC}"
    exit 1
fi

# SAM CLIの確認
if ! command -v sam &> /dev/null; then
    echo -e "${RED}❌ SAM CLIがインストールされていません${NC}"
    echo "インストール方法: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html"
    exit 1
fi

# AWS認証情報の確認
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS認証情報が設定されていません${NC}"
    echo "aws configure を実行してください"
    exit 1
fi

echo -e "${GREEN}✅ 前提条件OK${NC}"

# S3バケットの作成（存在しない場合 ）
echo -e "${YELLOW}📦 デプロイ用S3バケットを確認中...${NC}"
if ! aws s3 ls "s3://${S3_BUCKET}" 2>&1 | grep -q \'NoSuchBucket\'; then
    echo -e "${YELLOW}S3バケット ${S3_BUCKET} を作成中...${NC}"
    aws s3 mb "s3://${S3_BUCKET}" --region ${REGION}
else
    echo -e "${GREEN}✅ S3バケット ${S3_BUCKET} が存在します${NC}"
fi

# バックエンドの依存関係をインストール
echo -e "${YELLOW}📚 バックエンドの依存関係をインストール中...${NC}"
cd backend/carp-connect-api
source venv/bin/activate
pip install -r requirements.txt
cd ../..

# SAMビルド
echo -e "${YELLOW}🔨 SAMアプリケーションをビルド中...${NC}"
cd aws-infrastructure
sam build

# SAMデプロイ
echo -e "${YELLOW}🚀 SAMアプリケーションをデプロイ中...${NC}"
sam deploy \\
    --stack-name ${STACK_NAME}-${ENVIRONMENT} \\
    --s3-bucket ${S3_BUCKET} \\
    --capabilities CAPABILITY_IAM \\
    --region ${REGION} \\
    --parameter-overrides \\
        Environment=${ENVIRONMENT} \\
        CognitoDomainPrefix=carp-connect-${ENVIRONMENT}-$(date +%s) \\
    --confirm-changeset

# デプロイ結果の取得
echo -e "${YELLOW}📊 デプロイ結果中...${NC}"
STACK_OUTPUTS=$(aws cloudformation describe-stacks \\
    --stack-name ${STACK_NAME}-${ENVIRONMENT} \\
    --region ${REGION} \\
    --query \'Stacks[0].Outputs\' \\
    --output json)

# 重要な出力値を表示
echo -e "${GREEN}🎉 デプロイ完了！${NC}"
echo -e "${GREEN}📋 重要な情報:${NC}"

USER_POOL_ID=$(echo $STACK_OUTPUTS | jq -r \'.[] | select(.OutputKey=="UserPoolId") | .OutputValue\')
USER_POOL_CLIENT_ID=$(echo $STACK_OUTPUTS | jq -r \'.[] | select(.OutputKey=="UserPoolClientId") | .OutputValue\')
API_GATEWAY_URL=$(echo $STACK_OUTPUTS | jq -r \'.[] | select(.OutputKey=="ApiGatewayUrl") | .OutputValue\')
USER_POOL_DOMAIN=$(echo $STACK_OUTPUTS | jq -r \'.[] | select(.OutputKey=="UserPoolDomain") | .OutputValue\')

echo "🔐 Cognito User Pool ID: ${USER_POOL_ID}"
echo "🔑 Cognito User Pool Client ID: ${USER_POOL_CLIENT_ID}"
echo "🌐 API Gateway URL: ${API_GATEWAY_URL}"
echo "🔗 Cognito Domain: ${USER_POOL_DOMAIN}"

# フロントエンド用の環境変数ファイルを生成
echo -e "${YELLOW}⚙️  フロントエンド用環境変数ファイルを生成中...${NC}"
cd ../frontend/carp-connect-frontend

cat > .env.local << EOF
NEXT_PUBLIC_AWS_REGION=${REGION}
NEXT_PUBLIC_USER_POOL_ID=${USER_POOL_ID}
NEXT_PUBLIC_USER_POOL_CLIENT_ID=${USER_POOL_CLIENT_ID}
NEXT_PUBLIC_API_GATEWAY_URL=${API_GATEWAY_URL}
NEXT_PUBLIC_USER_POOL_DOMAIN=${USER_POOL_DOMAIN}
EOF

echo -e "${GREEN}✅ 環境変数ファイル (.env.local) を生成しました${NC}"

# フロントエンドのビルドとデプロイ（オプション）
read -p "フロントエンドもデプロイしますか？ (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🎨 フロントエンドをビルド中...${NC}"
    npm run build
    
    echo -e "${YELLOW}🚀 フロントエンドをAmplifyにデプロイ中...${NC}"
    # Amplify CLIを使用してデプロイ
    # amplify publish
    echo -e "${YELLOW}ℹ️  Amplify CLIを使用して手動でデプロイしてください${NC}"
fi

echo -e "${GREEN}🎉 カープコネクト デプロイ完了！${NC}"
echo -e "${GREEN}🌐 アプリケーションURL: http://localhost:3000 (ローカル開発 )${NC}"
echo -e "${GREEN}📚 API URL: ${API_GATEWAY_URL}${NC}"

cd ../..

