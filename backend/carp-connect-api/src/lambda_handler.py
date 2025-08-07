import os
import sys
import json
from typing import Dict, Any

# パスの設定
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# AWS Lambda用のライブラリ
try:
    from awslambdaric import LambdaContext
    from aws_lambda_powertools import Logger, Tracer, Metrics
    from aws_lambda_powertools.logging import correlation_paths
    from aws_lambda_powertools.metrics import MetricUnit
except ImportError:
    # ローカル開発環境では無視
    pass

# Flaskアプリケーションのインポート
from src.main import app

# ログ設定
logger = Logger()
tracer = Tracer()
metrics = Metrics()

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda用のハンドラー関数
    API GatewayからのリクエストをFlaskアプリケーションに転送
    """
    try:
        # リクエストの詳細をログに記録
        logger.info("Lambda function invoked", extra={
            "event": event,
            "context": {
                "function_name": getattr(context, \'function_name\', \'unknown\'),
                "function_version": getattr(context, \'function_version\', \'unknown\'),
                "aws_request_id": getattr(context, \'aws_request_id\', \'unknown\')
            }
        })

        # メトリクスの記録
        metrics.add_metric(name="LambdaInvocations", unit=MetricUnit.Count, value=1)

        # API Gatewayイベントの処理
        if \'httpMethod\' in event:
            return handle_api_gateway_event(event, context )
        else:
            logger.error("Unsupported event type", extra={"event": event})
            return {
                \'statusCode\': 400,
                \'body\': json.dumps({\'error\': \'Unsupported event type\'}) 
            }

    except Exception as e:
        logger.exception("Error processing Lambda event")
        metrics.add_metric(name="LambdaErrors", unit=MetricUnit.Count, value=1)
        
        return {
            \'statusCode\': 500,
            \'headers\': {
                \'Content-Type\': \'application/json\',
                \'Access-Control-Allow-Origin\': \'*\',
                \'Access-Control-Allow-Headers\': \'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\',
                \'Access-Control-Allow-Methods\': \'GET,POST,PUT,DELETE,OPTIONS\'
            },
            \'body\': json.dumps({
                \'success\': False,
                \'error\': \'Internal server error\'
            })
        }

def handle_api_gateway_event(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API Gatewayイベントを処理してFlaskアプリケーションに転送
    """
    try:
        # HTTPメソッドとパスの取得
        http_method = event.get(\'httpMethod\', \'GET\' )
        path = event.get(\'path\', \'/\')
        query_string = event.get(\'queryStringParameters\') or {}
        headers = event.get(\'headers\') or {}
        body = event.get(\'body\', \'\')

        # Flaskアプリケーションのテストクライアントを使用
        with app.test_client() as client:
            # クエリパラメータの構築
            query_string_formatted = \'&\'.join([f\"{k}={v}\" for k, v in query_string.items()])
            if query_string_formatted:
                path += f\"?{query_string_formatted}\"

            # リクエストの実行
            if http_method == \'GET\':
                response = client.get(path, headers=headers )
            elif http_method == \'POST\':
                response = client.post(path, data=body, headers=headers, content_type=headers.get(\'Content-Type\', \'application/json\' ))
            elif http_method == \'PUT\':
                response = client.put(path, data=body, headers=headers, content_type=headers.get(\'Content-Type\', \'application/json\' ))
            elif http_method == \'DELETE\':
                response = client.delete(path, headers=headers )
            elif http_method == \'OPTIONS\':
                # CORS プリフライトリクエストの処理
                return {
                    \'statusCode\': 200,
                    \'headers\': {
                        \'Access-Control-Allow-Origin\': \'*\',
                        \'Access-Control-Allow-Headers\': \'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\',
                        \'Access-Control-Allow-Methods\': \'GET,POST,PUT,DELETE,OPTIONS\'
                    },
                    \'body\': \'\'
                }
            else:
                return {
                    \'statusCode\': 405,
                    \'headers\': {
                        \'Content-Type\': \'application/json\',
                        \'Access-Control-Allow-Origin\': \'*\'
                    },
                    \'body\': json.dumps({\'error\': \'Method not allowed\'} ) 
                }

            # レスポンスの構築
            response_headers = {
                \'Content-Type\': response.content_type,
                \'Access-Control-Allow-Origin\': \'*\',
                \'Access-Control-Allow-Headers\': \'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\',
                \'Access-Control-Allow-Methods\': \'GET,POST,PUT,DELETE,OPTIONS\'
            }

            # Flaskレスポンスヘッダーの追加
            for key, value in response.headers:
                if key.lower() not in [\'content-length\', \'transfer-encoding\']:
                    response_headers[key] = value

            return {
                \'statusCode\': response.status_code,
                \'headers\': response_headers,
                \'body\': response.get_data(as_text=True)
            }

    except Exception as e:
        logger.exception("Error handling API Gateway event")
        return {
            \'statusCode\': 500,
            \'headers\': {
                \'Content-Type\': \'application/json\',
                \'Access-Control-Allow-Origin\': \'*\'
            },
            \'body\': json.dumps({
                \'success\': False,
                \'error\': str(e)
            })
        }

# ローカル開発用のテスト関数
def test_local():
    """
    ローカル開発環境でのテスト用関数
    """
    test_event = {
        \'httpMethod\': \'GET\',
        \'path\': \'/api/board/posts\',
        \'queryStringParameters\': None,
        \'headers\': {
            \'Content-Type\': \'application/json\'
        },
        \'body\': None
    }
    
    class MockContext:
        function_name = \'test-function\'
        function_version = \'1\'
        aws_request_id = \'test-request-id\'
    
    result = lambda_handler(test_event, MockContext( ))
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == \'__main__\':
    test_local()
