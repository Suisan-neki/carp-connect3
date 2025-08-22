from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
import uuid
import boto3
import os

board_bp = Blueprint('board', __name__)

# DynamoDBリソースの初期化
dynamodb = boto3.resource('dynamodb')
posts_table_name = os.environ.get('POSTS_TABLE')
posts_table = dynamodb.Table(posts_table_name)

@board_bp.route('/board/posts', methods=['GET'])
def get_posts():
    """掲示板の投稿一覧を取得"""
    try:
        category = request.args.get('category')
        
        if category:
            # カテゴリが指定されている場合、GSIを使ってクエリ
            response = posts_table.query(
                IndexName='CategoryIndex',
                KeyConditionExpression=boto3.dynamodb.conditions.Key('category').eq(category),
                ScanIndexForward=False  # 新しい順にソート
            )
            items = response.get('Items', [])
        else:
            # カテゴリが指定されていない場合、テーブルをスキャン
            # 注意: Scanは大規模テーブルでは非効率。本番環境では要件に応じて設計を見直すこと。
            response = posts_table.scan()
            items = response.get('Items', [])
            # Scan結果をPython側でソート
            items.sort(key=lambda x: x.get('created_at', ''), reverse=True)

        return jsonify({
            'success': True,
            'posts': items,
            'total': len(items)
        }), 200
    except Exception as e:
        print(f"Error getting posts: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@board_bp.route('/board/posts', methods=['POST'])
def create_post():
    """新しい投稿を作成"""
    try:
        data = request.get_json()
        # API GatewayのAuthorizerから渡された認証情報を取得
        auth_context = request.environ.get('aws.event', {}).get('requestContext', {}).get('authorizer', {})
        user_id = auth_context.get('claims', {}).get('sub')
        user_name = auth_context.get('claims', {}).get('name')

        if not user_id or not user_name:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401

        required_fields = ['title', 'content', 'category']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        post_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()

        new_post = {
            'id': post_id,
            'userId': user_id,
            'author': user_name,
            'title': data['title'],
            'content': data['content'],
            'category': data['category'],
            'created_at': created_at,
            'likes': 0,
            'replies': 0
        }

        posts_table.put_item(Item=new_post)

        return jsonify({
            'success': True,
            'post': new_post
        }), 201
    except Exception as e:
        print(f"Error creating post: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Note: The following endpoints are placeholders and not yet implemented with DynamoDB.

@board_bp.route('/board/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    """特定の投稿を取得 (未実装)"""
    return jsonify({'success': False, 'error': 'Not yet implemented'}), 501

@board_bp.route('/board/posts/<post_id>/like', methods=['POST'])
def like_post(post_id):
    """投稿にいいねを追加 (未実装)"""
    return jsonify({'success': False, 'error': 'Not yet implemented'}), 501

@board_bp.route('/board/categories', methods=['GET'])
def get_categories():
    """投稿カテゴリー一覧を取得"""
    # This can remain as mock data for now.
    categories = ['試合感想', 'グルメ', '応援募集', '戦力分析', 'その他']
    return jsonify({
        'success': True,
        'categories': categories
    }), 200

@board_bp.route('/board/stats', methods=['GET'])
def get_board_stats():
    """掲示板の統計情報を取得 (未実装)"""
    return jsonify({'success': False, 'error': 'Not yet implemented'}), 501