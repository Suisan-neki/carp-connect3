import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError
from typing import Dict, List, Any, Optional
import json
from datetime import datetime
import uuid

class DynamoDBHelper:
    """DynamoDB操作のヘルパークラス"""
    
    def __init__(self):
        self.dynamodb = boto3.resource(\'dynamodb\', region_name=os.getenv(\'AWS_REGION\', \'ap-northeast-1\'))
        self.posts_table_name = os.getenv(\'POSTS_TABLE\', \'carp-connect-posts-dev\')
        self.users_table_name = os.getenv(\'USERS_TABLE\', \'carp-connect-users-dev\')
        self.messages_table_name = os.getenv(\'MESSAGES_TABLE\', \'carp-connect-messages-dev\')
        
        # テーブルオブジェクトの初期化
        try:
            self.posts_table = self.dynamodb.Table(self.posts_table_name)
            self.users_table = self.dynamodb.Table(self.users_table_name)
            self.messages_table = self.dynamodb.Table(self.messages_table_name)
        except Exception as e:
            print(f"DynamoDB initialization error: {e}")
            # ローカル開発環境では無視
            self.posts_table = None
            self.users_table = None
            self.messages_table = None

    # 投稿関連の操作
    def create_post(self, post_data: Dict[str, Any]) -> Dict[str, Any]:
        """新しい投稿を作成"""
        try:
            post_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat() + \'Z\'
            
            item = {
                \'id\': post_id,
                \'author\': post_data[\'author\'],
                \'title\': post_data[\'title\'],
                \'content\': post_data[\'content\'],
                \'category\': post_data[\'category\'],
                \'created_at\': timestamp,
                \'updated_at\': timestamp,
                \'likes\': 0,
                \'replies\': 0,
                \'status\': \'active\'
            }
            
            if self.posts_table:
                self.posts_table.put_item(Item=item)
            
            return item
        except ClientError as e:
            raise Exception(f"Failed to create post: {e}")

    def get_posts(self, category: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """投稿一覧を取得"""
        try:
            if not self.posts_table:
                # ローカル開発環境用のダミーデータ
                return self._get_dummy_posts()
            
            if category:
                response = self.posts_table.query(
                    IndexName=\'CategoryIndex\',
                    KeyConditionExpression=Key(\'category\').eq(category),
                    ScanIndexForward=False,  # 新しい順
                    Limit=limit
                )
            else:
                response = self.posts_table.scan(Limit=limit)
                # 作成日時でソート
                items = response.get(\'Items\', [])
                items.sort(key=lambda x: x.get(\'created_at\', \'\'), reverse=True)
                response[\'Items\'] = items
            
            return response.get(\'Items\', [])
        except ClientError as e:
            raise Exception(f"Failed to get posts: {e}")

    def get_post_by_id(self, post_id: str) -> Optional[Dict[str, Any]]:
        """特定の投稿を取得"""
        try:
            if not self.posts_table:
                return None
            
            response = self.posts_table.get_item(Key={\'id\': post_id})
            return response.get(\'Item\')
        except ClientError as e:
            raise Exception(f"Failed to get post: {e}")

    def update_post_likes(self, post_id: str, increment: int = 1) -> int:
        """投稿のいいね数を更新"""
        try:
            if not self.posts_table:
                return 1  # ダミー値
            
            response = self.posts_table.update_item(
                Key={\'id\': post_id},
                UpdateExpression=\'ADD likes :val\',
                ExpressionAttributeValues={\':val\': increment},
                ReturnValues=\'UPDATED_NEW\'
            )
            return response[\'Attributes\'][\'likes\']
        except ClientError as e:
            raise Exception(f"Failed to update post likes: {e}")

    # ユーザー関連の操作
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """新しいユーザーを作成"""
        try:
            user_id = user_data.get(\'user_id\', str(uuid.uuid4()))
            timestamp = datetime.utcnow().isoformat() + \'Z\'
            
            item = {
                \'user_id\': user_id,
                \'email\': user_data[\'email\'],
                \'name\': user_data[\'name\'],
                \'phone\': user_data.get(\'phone\', \'\'),
                \'birthdate\': user_data.get(\'birthdate\', \'\'),
                \'location\': user_data.get(\'location\', \'\'),
                \'bio\': user_data.get(\'bio\', \'\'),
                \'favorite_player\': user_data.get(\'favorite_player\', \'\'),
                \'carp_history\': user_data.get(\'carp_history\', \'\'),
                \'attendance_count\': 0,
                \'posts_count\': 0,
                \'friends_count\': 0,
                \'likes_received\': 0,
                \'created_at\': timestamp,
                \'updated_at\': timestamp,
                \'status\': \'active\'
            }
            
            if self.users_table:
                self.users_table.put_item(Item=item)
            
            return item
        except ClientError as e:
            raise Exception(f"Failed to create user: {e}")

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """ユーザー情報を取得"""
        try:
            if not self.users_table:
                # ローカル開発環境用のダミーデータ
                return self._get_dummy_user(user_id)
            
            response = self.users_table.get_item(Key={\'user_id\': user_id})
            return response.get(\'Item\')
        except ClientError as e:
            raise Exception(f"Failed to get user: {e}")

    def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """ユーザー情報を更新"""
        try:
            if not self.users_table:
                return self._get_dummy_user(user_id)
            
            # 更新式の構築
            update_expression = "SET updated_at = :timestamp"
            expression_values = {\':timestamp\': datetime.utcnow().isoformat() + \'Z\'}
            
            for key, value in update_data.items():
                if key not in [\'user_id\', \'created_at\']:
                    update_expression += f", {key} = :{key}"
                    expression_values[f":{key}"] = value
            
            response = self.users_table.update_item(
                Key={\'user_id\': user_id},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_values,
                ReturnValues=\'ALL_NEW\'
            )
            return response[\'Attributes\']
        except ClientError as e:
            raise Exception(f"Failed to update user: {e}")

    # メッセージ関連の操作
    def create_message(self, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """新しいメッセージを作成"""
        try:
            message_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat() + \'Z\'
            
            item = {
                \'conversation_id\': message_data[\'conversation_id\'],
                \'timestamp\': timestamp,
                \'message_id\': message_id,
                \'user_id\': message_data[\'user_id\'],
                \'sender_name\': message_data[\'sender_name\'],
                \'content\': message_data[\'content\'],
                \'message_type\': message_data.get(\'message_type\', \'text\'),
                \'status\': \'sent\'
            }
            
            if self.messages_table:
                self.messages_table.put_item(Item=item)
            
            return item
        except ClientError as e:
            raise Exception(f"Failed to create message: {e}")

    def get_messages(self, conversation_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """会話のメッセージ一覧を取得"""
        try:
            if not self.messages_table:
                # ローカル開発環境用のダミーデータ
                return self._get_dummy_messages(conversation_id)
            
            response = self.messages_table.query(
                KeyConditionExpression=Key(\'conversation_id\').eq(conversation_id),
                ScanIndexForward=True,  # 古い順
                Limit=limit
            )
            
            return response.get(\'Items\', [])
        except ClientError as e:
            raise Exception(f"Failed to get messages: {e}")

    # ダミーデータ（ローカル開発用）
    def _get_dummy_posts(self) -> List[Dict[str, Any]]:
        """ローカル開発用のダミー投稿データ"""
        return [
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
            }
        ]

    def _get_dummy_user(self, user_id: str) -> Dict[str, Any]:
        """ローカル開発用のダミーユーザーデータ"""
        return {
            \'user_id\': user_id,
            \'name\': \'山田太郎\',
            \'email\': \'yamada@example.com\',
            \'phone\': \'+81-90-1234-5678\',
            \'birthdate\': \'1995-05-15\',
            \'location\': \'広島県広島市\',
            \'bio\': \'カープ愛歴25年！マツダスタジアムに通い続けています。\',
            \'favorite_player\': \'鈴木誠也\',
            \'carp_history\': \'2000年からのファン\',
            \'attendance_count\': 127,
            \'posts_count\': 42,
            \'friends_count\': 18,
            \'likes_received\': 234
        }

    def _get_dummy_messages(self, conversation_id: str) -> List[Dict[str, Any]]:
        """ローカル開発用のダミーメッセージデータ"""
        return [
            {
                \'conversation_id\': conversation_id,
                \'timestamp\': \'2025-08-07T14:30:00Z\',
                \'message_id\': \'1\',
                \'user_id\': \'user2\',
                \'sender_name\': \'赤ヘル太郎\',
                \'content\': \'こんにちは！今日の試合見ましたか？\',
                \'message_type\': \'text\'
            },
            {
                \'conversation_id\': conversation_id,
                \'timestamp\': \'2025-08-07T14:32:00Z\',
                \'message_id\': \'2\',
                \'user_id\': \'user1\',
                \'sender_name\': \'あなた\',
                \'content\': \'はい！最後の逆転劇は本当に感動しました！\',
                \'message_type\': \'text\'
            }
        ]

# グローバルインスタンス
db_helper = DynamoDBHelper()

