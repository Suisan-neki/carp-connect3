from flask import Blueprint, request, jsonify
import re
import time
from datetime import datetime

moderation_bp = Blueprint('moderation', __name__)

# デモ用のモックアップ実装
# 実際の実装ではAmazon Bedrockを使用してELYZA-japanese-Llama-2で判定

# 不適切なキーワードのリスト（デモ用）
INAPPROPRIATE_KEYWORDS = [
    '死ね', 'バカ', 'アホ', 'クソ', 'ゴミ', 'カス',
    '殺す', '暴力', '差別', 'ヘイト', '誹謗中傷',
    '詐欺', '違法', '薬物', 'ギャンブル'
]

# 政治的・宗教的なキーワード（デモ用）
POLITICAL_RELIGIOUS_KEYWORDS = [
    '政治', '選挙', '政党', '宗教', '信仰', '神',
    '仏教', 'キリスト教', 'イスラム教', '創価学会'
]

def analyze_content_with_mock_llm(content):
    """
    モックアップLLM分析
    実際の実装ではAmazon Bedrockを使用
    """
    
    # 基本的な不適切コンテンツ検出
    inappropriate_score = 0
    detected_issues = []
    
    # 不適切なキーワードチェック
    for keyword in INAPPROPRIATE_KEYWORDS:
        if keyword in content:
            inappropriate_score += 0.3
            detected_issues.append(f"不適切な表現: '{keyword}'")
    
    # 政治的・宗教的コンテンツチェック
    for keyword in POLITICAL_RELIGIOUS_KEYWORDS:
        if keyword in content:
            inappropriate_score += 0.2
            detected_issues.append(f"政治的・宗教的内容: '{keyword}'")
    
    # 長すぎる投稿（スパム判定）
    if len(content) > 1000:
        inappropriate_score += 0.1
        detected_issues.append("投稿が長すぎます（スパムの可能性）")
    
    # 同じ文字の繰り返し（スパム判定）
    if re.search(r'(.)\1{10,}', content):
        inappropriate_score += 0.4
        detected_issues.append("同じ文字の異常な繰り返し")
    
    # URLの大量投稿（スパム判定）
    url_count = len(re.findall(r'https?://\S+', content))
    if url_count > 3:
        inappropriate_score += 0.3
        detected_issues.append(f"URL大量投稿 ({url_count}個)")
    
    # スコアを0-1の範囲に正規化
    inappropriate_score = min(inappropriate_score, 1.0)
    
    # 判定結果
    if inappropriate_score >= 0.7:
        action = "block"
        reason = "高リスク: 投稿をブロックします"
    elif inappropriate_score >= 0.4:
        action = "review"
        reason = "中リスク: 人間による確認が必要です"
    elif inappropriate_score >= 0.2:
        action = "warn"
        reason = "低リスク: 警告を表示します"
    else:
        action = "allow"
        reason = "問題なし: 投稿を許可します"
    
    return {
        "score": inappropriate_score,
        "action": action,
        "reason": reason,
        "detected_issues": detected_issues,
        "analysis_time": time.time()
    }

@moderation_bp.route('/moderation/analyze', methods=['POST'])
def analyze_content():
    """コンテンツの適切性を分析"""
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'success': False,
                'error': 'Content is required'
            }), 400
        
        content = data['content']
        content_type = data.get('type', 'post')  # post, reply, dm
        
        # モックアップLLM分析を実行
        analysis_result = analyze_content_with_mock_llm(content)
        
        # 分析結果をログに記録（実際の実装ではDynamoDBに保存）
        moderation_log = {
            'content_id': data.get('content_id', 'unknown'),
            'content_type': content_type,
            'content_preview': content[:100] + '...' if len(content) > 100 else content,
            'analysis_result': analysis_result,
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'user_id': data.get('user_id', 'anonymous')
        }
        
        return jsonify({
            'success': True,
            'moderation': {
                'score': analysis_result['score'],
                'action': analysis_result['action'],
                'reason': analysis_result['reason'],
                'detected_issues': analysis_result['detected_issues'],
                'safe_to_post': analysis_result['action'] in ['allow', 'warn']
            },
            'log_id': f"mod_{int(analysis_result['analysis_time'])}"
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@moderation_bp.route('/moderation/stats', methods=['GET'])
def get_moderation_stats():
    """モデレーション統計情報を取得（デモ用）"""
    try:
        # デモ用の統計データ
        stats = {
            'total_analyzed': 1247,
            'blocked_content': 23,
            'flagged_for_review': 45,
            'warnings_issued': 89,
            'allowed_content': 1090,
            'analysis_accuracy': 0.94,
            'average_response_time': 0.12,  # seconds
            'last_updated': datetime.utcnow().isoformat() + 'Z'
        }
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@moderation_bp.route('/moderation/test-cases', methods=['GET'])
def get_test_cases():
    """デモ用のテストケースを提供"""
    test_cases = [
        {
            'id': 1,
            'content': '今日の試合、本当に最高でした！カープの勝利に感動しました！',
            'expected_action': 'allow',
            'description': '正常なコンテンツ'
        },
        {
            'id': 2,
            'content': 'あの審判はバカだ！死ねばいいのに！',
            'expected_action': 'block',
            'description': '不適切な表現を含む'
        },
        {
            'id': 3,
            'content': '政治の話になりますが、今度の選挙では...',
            'expected_action': 'review',
            'description': '政治的内容を含む'
        },
        {
            'id': 4,
            'content': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'expected_action': 'block',
            'description': '同じ文字の異常な繰り返し'
        },
        {
            'id': 5,
            'content': 'カープの応援、ちょっと熱くなりすぎたかも。反省してます。',
            'expected_action': 'warn',
            'description': '軽微な問題を含む可能性'
        }
    ]
    
    return jsonify({
        'success': True,
        'test_cases': test_cases
    }), 200
