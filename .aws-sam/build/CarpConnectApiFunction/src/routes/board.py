from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid

board_bp = Blueprint(\'board\', __name__)

# 仮のデータストレージ（実際の実装ではDynamoDBを使用）
posts_storage = [
    {
        \'id\': \'1\',
        \'author\': \'赤ヘル太郎\',
        \'title\': \'今日の試合について語ろう！\',
        \'content\': \'9回裏の逆転劇、本当に感動しました！みんなはどう思った？\',
        \'category\': \'試合感想\',
        \'created_at\': \'2025-08-07T10:00:00Z\',
        \'likes\': 24,
        \'replies\': 8
    },
    {
        \'id\': \'2\',
        \'author\': \'カープ女子\',
        \'title\': \'マツダスタジアムのおすすめグルメ\',
        \'content\': \'スタジアムで食べられる美味しいものを教えて！特にビールのおつまみが知りたいです🍺\',
        \'category\': \'グルメ\',
        \'created_at\': \'2025-08-07T08:00:00Z\',
        \'likes\': 18,
        \'replies\': 12
    },
    {
        \'id\': \'3\',
        \'author\': \'広島っ子\',
        \'title\': \'来週の巨人戦、一緒に応援しませんか？\',
        \'content\': \'来週の巨人戦のチケットを取りました！一緒に応援してくれる仲間を募集中です。\',
        \'category\': \'応援募集\',
        \'created_at\': \'2025-08-07T06:00:00Z\',
        \'likes\': 31,
        \'replies\': 15
    }
]

@board_bp.route(\'/board/posts\', methods=[\'GET\'])
def get_posts():
    """掲示板の投稿一覧を取得"""
    try:
        # カテゴリーフィルター
        category = request.args.get(\'category\')
        if category:
            filtered_posts = [post for post in posts_storage if post[\'category\'] == category]
        else:
            filtered_posts = posts_storage
        
        # 作成日時でソート（新しい順）
        sorted_posts = sorted(filtered_posts, key=lambda x: x[\'created_at\'], reverse=True)
        
        return jsonify({
            \'success\': True,
            \'posts\': sorted_posts,
            \'total\': len(sorted_posts)
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@board_bp.route(\'/board/posts\', methods=[\'POST\'])
def create_post():
    """新しい投稿を作成"""
    try:
        data = request.get_json()
        
        # バリデーション
        required_fields = [\'title\', \'content\', \'category\', \'author\']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    \'success\': False,
                    \'error\': f\'{field} is required\'
                }), 400
        
        # 新しい投稿を作成
        new_post = {
            \'id\': str(uuid.uuid4()),
            \'author\': data[\'author\'],
            \'title\': data[\'title\'],
            \'content\': data[\'content\'],
            \'category\': data[\'category\'],
            \'created_at\': datetime.utcnow().isoformat() + \'Z\',
            \'likes\': 0,
            \'replies\': 0
        }
        
        posts_storage.insert(0, new_post)
        
        return jsonify({
            \'success\': True,
            \'post\': new_post
        }), 201
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@board_bp.route(\'/board/posts/<post_id>\', methods=[\'GET\'])
def get_post(post_id):
    """特定の投稿を取得"""
    try:
        post = next((post for post in posts_storage if post[\'id\'] == post_id), None)
        if not post:
            return jsonify({
                \'success\': False,
                \'error\': \'Post not found\'
            }), 404
        
        return jsonify({
            \'success\': True,
            \'post\': post
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@board_bp.route(\'/board/posts/<post_id>/like\', methods=[\'POST\'])
def like_post(post_id):
    """投稿にいいねを追加"""
    try:
        post = next((post for post in posts_storage if post[\'id\'] == post_id), None)
        if not post:
            return jsonify({
                \'success\': False,
                \'error\': \'Post not found\'
            }), 404
        
        post[\'likes\'] += 1
        
        return jsonify({
            \'success\': True,
            \'likes\': post[\'likes\']
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@board_bp.route(\'/board/categories\', methods=[\'GET\'])
def get_categories():
    """投稿カテゴリー一覧を取得"""
    categories = [\'試合感想\', \'グルメ\', \'応援募集\', \'戦力分析\', \'その他\']
    return jsonify({
        \'success\': True,
        \'categories\': categories
    }), 200

@board_bp.route(\'/board/stats\', methods=[\'GET\'])
def get_board_stats():
    """掲示板の統計情報を取得"""
    try:
        total_posts = len(posts_storage)
        total_likes = sum(post[\'likes\'] for post in posts_storage)
        total_replies = sum(post[\'replies\'] for post in posts_storage)
        
        # 今日の投稿数（簡易実装）
        today_posts = len([post for post in posts_storage if post[\'created_at\'].startswith(\'2025-08-07\')])
        
        return jsonify({
            \'success\': True,
            \'stats\': {
                \'total_posts\': total_posts,
                \'total_likes\': total_likes,
                \'total_replies\': total_replies,
                \'today_posts\': today_posts,
                \'active_users\': 89  # 固定値（デモ用）
            }
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

