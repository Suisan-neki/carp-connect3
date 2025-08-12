from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid

profile_bp = Blueprint(\'profile\', __name__)

# 仮のユーザープロフィールデータ（実際の実装ではDynamoDBを使用）
profiles_storage = {
    \'user1\': {
        \'id\': \'user1\',
        \'name\': \'山田太郎\',
        \'email\': \'yamada@example.com\',
        \'phone\': \'+81-90-1234-5678\',
        \'birthdate\': \'1995-05-15\',
        \'location\': \'広島県広島市\',
        \'bio\': \'カープ愛歴25年！マツダスタジアムに通い続けています。一緒に応援してくれる仲間を探しています⚾\',
        \'favorite_player\': \'鈴木誠也\',
        \'carp_history\': \'2000年からのファン\',
        \'attendance_count\': 127,
        \'posts_count\': 42,
        \'friends_count\': 18,
        \'likes_received\': 234,
        \'profile_image_url\': None,
        \'created_at\': \'2025-01-01T00:00:00Z\',
        \'updated_at\': \'2025-08-07T12:00:00Z\'
    }
}

achievements_storage = {
    \'user1\': [
        {
            \'id\': \'1\',
            \'title\': \'カープファン歴20年\',
            \'description\': \'20年以上カープを応援し続けています\',
            \'icon\': \'trophy\',
            \'color\': \'yellow\',
            \'earned_at\': \'2025-01-01T00:00:00Z\'
        },
        {
            \'id\': \'2\',
            \'title\': \'スタジアム常連\',
            \'description\': \'100試合以上スタジアムで観戦\',
            \'icon\': \'star\',
            \'color\': \'blue\',
            \'earned_at\': \'2025-06-01T00:00:00Z\'
        },
        {
            \'id\': \'3\',
            \'title\': \'コミュニティリーダー\',
            \'description\': \'多くの投稿でいいねを獲得\',
            \'icon\': \'heart\',
            \'color\': \'red\',
            \'earned_at\': \'2025-07-01T00:00:00Z\'
        }
    ]
}

activity_storage = {
    \'user1\': [
        {
            \'id\': \'1\',
            \'type\': \'post\',
            \'content\': \'今日の試合、最高でした！\',
            \'timestamp\': \'2025-08-07T10:00:00Z\'
        },
        {
            \'id\': \'2\',
            \'type\': \'like\',
            \'content\': \'カープ女子の投稿にいいねしました\',
            \'timestamp\': \'2025-08-07T08:00:00Z\'
        },
        {
            \'id\': \'3\',
            \'type\': \'friend\',
            \'content\': \'赤ヘル太郎さんと友達になりました\',
            \'timestamp\': \'2025-08-06T15:00:00Z\'
        }
    ]
}

@profile_bp.route(\'/profile/<user_id>\', methods=[\'GET\'])
def get_profile(user_id):
    """ユーザープロフィールを取得"""
    try:
        profile = profiles_storage.get(user_id)
        if not profile:
            return jsonify({
                \'success\': False,
                \'error\': \'Profile not found\'
            }), 404
        
        return jsonify({
            \'success\': True,
            \'profile\': profile
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@profile_bp.route(\'/profile/<user_id>\', methods=[\'PUT\'])
def update_profile(user_id):
    """ユーザープロフィールを更新"""
    try:
        profile = profiles_storage.get(user_id)
        if not profile:
            return jsonify({
                \'success\': False,
                \'error\': \'Profile not found\'
            }), 404
        
        data = request.get_json()
        
        # 更新可能なフィールド
        updatable_fields = [
            \'name\', \'location\', \'bio\', \'favorite_player\', 
            \'carp_history\', \'attendance_count\'
        ]
        
        for field in updatable_fields:
            if field in data:
                profile[field] = data[field]
        
        profile[\'updated_at\'] = datetime.utcnow().isoformat() + \'Z\'
        
        return jsonify({
            \'success\': True,
            \'profile\': profile
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@profile_bp.route(\'/profile/<user_id>/achievements\', methods=[\'GET\'])
def get_achievements(user_id):
    """ユーザーの実績・バッジを取得"""
    try:
        achievements = achievements_storage.get(user_id, [])
        
        return jsonify({
            \'success\': True,
            \'achievements\': achievements
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@profile_bp.route(\'/profile/<user_id>/activity\', methods=[\'GET\'])
def get_activity(user_id):
    """ユーザーの最近のアクティビティを取得"""
    try:
        activity = activity_storage.get(user_id, [])
        
        # 時刻でソート（新しい順）
        sorted_activity = sorted(activity, key=lambda x: x[\'timestamp\'], reverse=True)
        
        # 最新10件を返す
        recent_activity = sorted_activity[:10]
        
        return jsonify({
            \'success\': True,
            \'activity\': recent_activity
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@profile_bp.route(\'/profile/<user_id>/stats\', methods=[\'GET\'])
def get_profile_stats(user_id):
    """ユーザーの統計情報を取得"""
    try:
        profile = profiles_storage.get(user_id)
        if not profile:
            return jsonify({
                \'success\': False,
                \'error\': \'Profile not found\'
            }), 404
        
        stats = {
            \'posts_count\': profile[\'posts_count\'],
            \'friends_count\': profile[\'friends_count\'],
            \'likes_received\': profile[\'likes_received\'],
            \'attendance_count\': profile[\'attendance_count\'],
            \'achievements_count\': len(achievements_storage.get(user_id, [])),
            \'member_since\': profile[\'created_at\']
        }
        
        return jsonify({
            \'success\': True,
            \'stats\': stats
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@profile_bp.route(\'/profile/<user_id>/friends\', methods=[\'GET\'])
def get_friends(user_id):
    """ユーザーの友達一覧を取得"""
    try:
        # 仮の友達データ
        friends = [
            {
                \'id\': \'friend1\',
                \'name\': \'赤ヘル太郎\',
                \'location\': \'広島県広島市\',
                \'favorite_player\': \'菊池涼介\',
                \'online\': True
            },
            {
                \'id\': \'friend2\',
                \'name\': \'カープ女子\',
                \'location\': \'広島県呉市\',
                \'favorite_player\': \'森下暢仁\',
                \'online\': False
            },
            {
                \'id\': \'friend3\',
                \'name\': \'広島っ子\',
                \'location\': \'広島県福山市\',
                \'favorite_player\': \'大瀬良大地\',
                \'online\': True
            }
        ]
        
        return jsonify({
            \'success\': True,
            \'friends\': friends,
            \'total\': len(friends)
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@profile_bp.route(\'/profile/<user_id>/follow\', methods=[\'POST\'])
def follow_user(user_id):
    """ユーザーをフォロー"""
    try:
        data = request.get_json()
        target_user_id = data.get(\'target_user_id\')
        
        if not target_user_id:
            return jsonify({
                \'success\': False,
                \'error\': \'target_user_id is required\'
            }), 400
        
        # フォロー処理（実際の実装ではDynamoDBに保存）
        # ここでは簡単にfriends_countを増加
        profile = profiles_storage.get(user_id)
        if profile:
            profile[\'friends_count\'] += 1
        
        return jsonify({
            \'success\': True,
            \'message\': \'Successfully followed user\'
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@profile_bp.route(\'/profile/<user_id>/unfollow\', methods=[\'POST\'])
def unfollow_user(user_id):
    """ユーザーのフォローを解除"""
    try:
        data = request.get_json()
        target_user_id = data.get(\'target_user_id\')
        
        if not target_user_id:
            return jsonify({
                \'success\': False,
                \'error\': \'target_user_id is required\'
            }), 400
        
        # フォロー解除処理
        profile = profiles_storage.get(user_id)
        if profile and profile[\'friends_count\'] > 0:
            profile[\'friends_count\'] -= 1
        
        return jsonify({
            \'success\': True,
            \'message\': \'Successfully unfollowed user\'
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

