from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid

messages_bp = Blueprint(\'messages\', __name__)

# 仮のデータストレージ（実際の実装ではDynamoDBを使用）
conversations_storage = [
    {
        \'id\': \'1\',
        \'name\': \'赤ヘル太郎\',
        \'type\': \'dm\',
        \'last_message\': \'今度の試合、一緒に見に行きませんか？\',
        \'last_message_time\': \'2025-08-07T12:23:00Z\',
        \'unread_count\': 2,
        \'participants\': [\'user1\', \'user2\'],
        \'online\': True
    },
    {
        \'id\': \'2\',
        \'name\': \'カープ女子会\',
        \'type\': \'group\',
        \'last_message\': \'みんな: スタジアムグルメの写真をシェアしよう！\',
        \'last_message_time\': \'2025-08-07T12:10:00Z\',
        \'unread_count\': 5,
        \'participants\': [\'user1\', \'user3\', \'user4\', \'user5\', \'user6\', \'user7\', \'user8\', \'user9\'],
        \'online\': False
    },
    {
        \'id\': \'3\',
        \'name\': \'広島っ子\',
        \'type\': \'dm\',
        \'last_message\': \'ありがとうございました！\',
        \'last_message_time\': \'2025-08-07T11:25:00Z\',
        \'unread_count\': 0,
        \'participants\': [\'user1\', \'user10\'],
        \'online\': False
    }
]

messages_storage = {
    \'1\': [
        {
            \'id\': \'1\',
            \'sender\': \'赤ヘル太郎\',
            \'content\': \'こんにちは！今日の試合見ましたか？\',
            \'timestamp\': \'2025-08-07T14:30:00Z\',
            \'is_own\': False
        },
        {
            \'id\': \'2\',
            \'sender\': \'あなた\',
            \'content\': \'はい！最後の逆転劇は本当に感動しました！\',
            \'timestamp\': \'2025-08-07T14:32:00Z\',
            \'is_own\': True
        },
        {
            \'id\': \'3\',
            \'sender\': \'赤ヘル太郎\',
            \'content\': \'本当にそうですね！来週の試合も楽しみです\',
            \'timestamp\': \'2025-08-07T14:35:00Z\',
            \'is_own\': False
        },
        {
            \'id\': \'4\',
            \'sender\': \'赤ヘル太郎\',
            \'content\': \'今度の試合、一緒に見に行きませんか？\',
            \'timestamp\': \'2025-08-07T14:38:00Z\',
            \'is_own\': False
        }
    ]
}

@messages_bp.route(\'/messages/conversations\', methods=[\'GET\'])
def get_conversations():
    """会話一覧を取得"""
    try:
        # 最新メッセージ時刻でソート
        sorted_conversations = sorted(
            conversations_storage, 
            key=lambda x: x[\'last_message_time\'], 
            reverse=True
        )
        
        return jsonify({
            \'success\': True,
            \'conversations\': sorted_conversations
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@messages_bp.route(\'/messages/conversations/<conversation_id>/messages\', methods=[\'GET\'])
def get_messages(conversation_id):
    """特定の会話のメッセージ一覧を取得"""
    try:
        messages = messages_storage.get(conversation_id, [])
        
        return jsonify({
            \'success\': True,
            \'messages\': messages
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@messages_bp.route(\'/messages/conversations/<conversation_id>/messages\', methods=[\'POST\'])
def send_message(conversation_id):
    """メッセージを送信"""
    try:
        data = request.get_json()
        
        if not data.get(\'content\'):
            return jsonify({
                \'success\': False,
                \'error\': \'Content is required\'
            }), 400
        
        # 新しいメッセージを作成
        new_message = {
            \'id\': str(uuid.uuid4()),
            \'sender\': data.get(\'sender\', \'あなた\'),
            \'content\': data[\'content\'],
            \'timestamp\': datetime.utcnow().isoformat() + \'Z\',
            \'is_own\': True
        }
        
        # メッセージを追加
        if conversation_id not in messages_storage:
            messages_storage[conversation_id] = []
        
        messages_storage[conversation_id].append(new_message)
        
        # 会話の最新メッセージを更新
        conversation = next(
            (conv for conv in conversations_storage if conv[\'id\'] == conversation_id), 
            None
        )
        if conversation:
            conversation[\'last_message\'] = data[\'content\']
            conversation[\'last_message_time\'] = new_message[\'timestamp\']
        
        return jsonify({
            \'success\': True,
            \'message\': new_message
        }), 201
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@messages_bp.route(\'/messages/conversations\', methods=[\'POST\'])
def create_conversation():
    """新しい会話を作成"""
    try:
        data = request.get_json()
        
        required_fields = [\'name\', \'type\']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    \'success\': False,
                    \'error\': f\'{field} is required\'
                }), 400
        
        new_conversation = {
            \'id\': str(uuid.uuid4()),
            \'name\': data[\'name\'],
            \'type\': data[\'type\'],  # \'dm\' or \'group\'
            \'last_message\': \'\',
            \'last_message_time\': datetime.utcnow().isoformat() + \'Z\',
            \'unread_count\': 0,
            \'participants\': data.get(\'participants\', []),
            \'online\': False
        }
        
        conversations_storage.append(new_conversation)
        
        return jsonify({
            \'success\': True,
            \'conversation\': new_conversation
        }), 201
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@messages_bp.route(\'/messages/conversations/<conversation_id>/read\', methods=[\'POST\'])
def mark_as_read(conversation_id):
    """会話を既読にマーク"""
    try:
        conversation = next(
            (conv for conv in conversations_storage if conv[\'id\'] == conversation_id), 
            None
        )
        
        if not conversation:
            return jsonify({
                \'success\': False,
                \'error\': \'Conversation not found\'
            }), 404
        
        conversation[\'unread_count\'] = 0
        
        return jsonify({
            \'success\': True,
            \'message\': \'Marked as read\'
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

@messages_bp.route(\'/messages/stats\', methods=[\'GET\'])
def get_message_stats():
    """メッセージ統計を取得"""
    try:
        total_conversations = len(conversations_storage)
        total_unread = sum(conv[\'unread_count\'] for conv in conversations_storage)
        
        return jsonify({
            \'success\': True,
            \'stats\': {
                \'total_conversations\': total_conversations,
                \'total_unread\': total_unread,
                \'online_friends\': len([conv for conv in conversations_storage if conv.get(\'online\', False)])
            }
        }), 200
    except Exception as e:
        return jsonify({
            \'success\': False,
            \'error\': str(e)
        }), 500

