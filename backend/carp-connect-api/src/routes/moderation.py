from flask import Blueprint, request, jsonify
import re
import time
from datetime import datetime

moderation_bp = Blueprint('moderation', __name__)

# 統計データ（メモリ内保存）
moderation_stats = {
    'total_analyzed': 0,
    'blocked_content': 0,
    'flagged_content': 0,
    'safe_content': 0,
    'last_updated': datetime.now().isoformat()
}

# 不適切なキーワードのリスト
INAPPROPRIATE_KEYWORDS = [
    '死ね', 'バカ', 'アホ', 'クソ', 'ゴミ', 'カス', 'ブス', 'デブ',
    '殺す', '消えろ', 'うざい', 'きもい', 'むかつく', 'ざまあ'
]

# 政治・宗教関連キーワード
POLITICAL_RELIGIOUS_KEYWORDS = [
    '政治', '選挙', '政党', '宗教', '神', '仏', '創価', '共産党'
]

# スパム関連キーワード
SPAM_KEYWORDS = [
    '稼げる', '副業', '投資', '儲かる', 'お金', '無料', 'プレゼント',
    'クリック', 'URL', 'http', 'www', '.com'
]

def analyze_content_with_llm(content, content_type, user_id, content_id):
    """
    Amazon Bedrockを模擬したコンテンツ分析
    実際の実装では、ここでBedrockのAPIを呼び出します
    """
    
    # 分析結果の初期化
    analysis = {
        'content': content,
        'content_type': content_type,
        'user_id': user_id,
        'content_id': content_id,
        'timestamp': datetime.now().isoformat(),
        'risk_score': 0,
        'detected_issues': [],
        'safe_to_post': True,
        'reason': '',
        'confidence': 0.95
    }
    
    # 不適切なキーワードの検出
    inappropriate_found = []
    for keyword in INAPPROPRIATE_KEYWORDS:
        if keyword in content:
            inappropriate_found.append(f"不適切な言葉: '{keyword}'")
            analysis['risk_score'] += 30
    
    # 政治・宗教関連の検出
    political_religious_found = []
    for keyword in POLITICAL_RELIGIOUS_KEYWORDS:
        if keyword in content:
            political_religious_found.append(f"政治・宗教関連: '{keyword}'")
            analysis['risk_score'] += 20
    
    # スパム関連の検出
    spam_found = []
    for keyword in SPAM_KEYWORDS:
        if keyword in content:
            spam_found.append(f"スパム関連: '{keyword}'")
            analysis['risk_score'] += 25
    
    # 検出された問題をまとめる
    analysis['detected_issues'] = inappropriate_found + political_religious_found + spam_found
    
    # リスクスコアに基づく判定
    if analysis['risk_score'] >= 50:
        analysis['safe_to_post'] = False
        analysis['reason'] = '不適切な内容が検出されました。投稿をブロックします。'
        moderation_stats['blocked_content'] += 1
    elif analysis['risk_score'] >= 20:
        analysis['safe_to_post'] = True
        analysis['reason'] = '注意が必要な内容が検出されました。投稿は許可されますが、ご注意ください。'
        moderation_stats['flagged_content'] += 1
    else:
        analysis['safe_to_post'] = True
        analysis['reason'] = '問題のない内容です。'
        moderation_stats['safe_content'] += 1
    
    # 統計を更新
    moderation_stats['total_analyzed'] += 1
    moderation_stats['last_updated'] = datetime.now().isoformat()
    
    return analysis

@moderation_bp.route('/analyze', methods=['POST'])
def analyze_content():
    """コンテンツ分析エンドポイント"""
    try:
        data = request.get_json()
        
        # 必須パラメータの確認
        required_fields = ['content', 'type', 'user_id', 'content_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'必須フィールド "{field}" が不足しています'
                }), 400
        
        # コンテンツ分析を実行
        moderation_result = analyze_content_with_llm(
            content=data['content'],
            content_type=data['type'],
            user_id=data['user_id'],
            content_id=data['content_id']
        )
        
        return jsonify({
            'success': True,
            'moderation': moderation_result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'分析中にエラーが発生しました: {str(e)}'
        }), 500

@moderation_bp.route('/stats', methods=['GET'])
def get_moderation_stats():
    """モデレーション統計情報を取得"""
    return jsonify({
        'success': True,
        'stats': moderation_stats
    })

@moderation_bp.route('/test-cases', methods=['GET'])
def get_test_cases():
    """テストケースを取得"""
    test_cases = [
        {
            'name': '正常なコンテンツ',
            'content': '今日の試合、とても良かったです！カープの勝利に感動しました。',
            'expected': 'safe'
        },
        {
            'name': '不適切な言葉',
            'content': 'あの選手はバカだ。死ねばいいのに。',
            'expected': 'blocked'
        },
        {
            'name': '政治的内容',
            'content': '今度の選挙では○○政党に投票しましょう。',
            'expected': 'flagged'
        },
        {
            'name': 'スパム的内容',
            'content': '簡単に稼げる副業があります！詳しくはこのURLをクリック！',
            'expected': 'flagged'
        },
        {
            'name': '軽微な問題',
            'content': 'あの審判の判定はちょっとむかつくなあ。',
            'expected': 'flagged'
        }
    ]
    
    return jsonify({
        'success': True,
        'test_cases': test_cases
    })
