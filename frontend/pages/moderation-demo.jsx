import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Play,
  RefreshCw
} from 'lucide-react';

export default function ModerationDemo() {
  const [testContent, setTestContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState(null);
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTestCases();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/moderation/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('統計取得エラー:', error);
    }
  };

  const fetchTestCases = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/moderation/test-cases');
      const data = await response.json();
      if (data.success) {
        setTestCases(data.test_cases);
      }
    } catch (error) {
      console.error('テストケース取得エラー:', error);
    }
  };

  const analyzeContent = async (content) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/moderation/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          type: 'demo',
          user_id: 'demo_user',
          content_id: `demo_${Date.now()}`
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.moderation);
        fetchStats(); // 統計を更新
      } else {
        console.error('分析エラー:', data.error);
      }
    } catch (error) {
      console.error('分析リクエストエラー:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    if (testContent.trim()) {
      analyzeContent(testContent);
    }
  };

  const handleTestCase = (testCase) => {
    setTestContent(testCase.content);
    analyzeContent(testCase.content);
  };

  return (
    <>
      <Head>
        <title>コンテンツモデレーション デモ - カープコネクト</title>
      </Head>

      <Layout>
        <div className="space-y-6 carp-fade-in">
          {/* ヘッダー */}
          <div className="carp-card">
            <div className="carp-card-header">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <h1 className="text-2xl font-bold">コンテンツモデレーション デモ</h1>
              </div>
              <p className="text-red-100 mt-2">
                Amazon Bedrockを使った国産LLM（ELYZA-japanese-Llama-2）による自動コンテンツ検証のデモです
              </p>
            </div>
          </div>

          {/* 統計情報 */}
          {stats && (
            <div className="carp-card">
              <div className="carp-card-header">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">分析統計</h2>
                </div>
              </div>
              <div className="carp-card-content">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.total_analyzed}</div>
                    <div className="text-sm text-gray-600">総分析数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.safe_content}</div>
                    <div className="text-sm text-gray-600">安全</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.flagged_content}</div>
                    <div className="text-sm text-gray-600">要注意</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.blocked_content}</div>
                    <div className="text-sm text-gray-600">ブロック</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  最終更新: {new Date(stats.last_updated).toLocaleString('ja-JP')}
                </div>
              </div>
            </div>
          )}

          {/* コンテンツ分析 */}
          <div className="carp-card">
            <div className="carp-card-header">
              <h2 className="text-lg font-semibold">コンテンツ分析</h2>
            </div>
            <div className="carp-card-content space-y-4">
              <div>
                <label className="carp-label">分析したいコンテンツを入力してください</label>
                <textarea
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  rows={4}
                  className="carp-input carp-textarea"
                  placeholder="ここに分析したいテキストを入力してください..."
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !testContent.trim()}
                className="carp-btn carp-btn-primary"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>分析中...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>分析実行</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 分析結果 */}
          {analysisResult && (
            <div className="carp-card">
              <div className="carp-card-header">
                <h2 className="text-lg font-semibold">分析結果</h2>
              </div>
              <div className="carp-card-content space-y-4">
                <div className={`p-4 rounded-lg border ${
                  analysisResult.safe_to_post 
                    ? analysisResult.risk_score > 0 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {analysisResult.safe_to_post ? (
                      analysisResult.risk_score > 0 ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`font-medium ${
                      analysisResult.safe_to_post 
                        ? analysisResult.risk_score > 0 
                          ? 'text-yellow-800' 
                          : 'text-green-800'
                        : 'text-red-800'
                    }`}>
                      {analysisResult.reason}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">リスクスコア:</span> {analysisResult.risk_score}
                    </div>
                    <div>
                      <span className="font-medium">信頼度:</span> {(analysisResult.confidence * 100).toFixed(1)}%
                    </div>
                  </div>

                  {analysisResult.detected_issues && analysisResult.detected_issues.length > 0 && (
                    <div className="mt-3">
                      <div className="font-medium text-sm mb-1">検出された問題:</div>
                      <ul className="space-y-1">
                        {analysisResult.detected_issues.map((issue, index) => (
                          <li key={index} className="text-sm">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  分析時刻: {new Date(analysisResult.timestamp).toLocaleString('ja-JP')}
                </div>
              </div>
            </div>
          )}

          {/* テストケース */}
          <div className="carp-card">
            <div className="carp-card-header">
              <h2 className="text-lg font-semibold">テストケース</h2>
            </div>
            <div className="carp-card-content">
              <div className="grid gap-3">
                {testCases.map((testCase, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{testCase.name}</div>
                        <div className="text-sm text-gray-600 mb-2">{testCase.content}</div>
                        <div className={`inline-block px-2 py-1 rounded text-xs ${
                          testCase.expected === 'safe' ? 'bg-green-100 text-green-800' :
                          testCase.expected === 'flagged' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          期待結果: {testCase.expected}
                        </div>
                      </div>
                      <button
                        onClick={() => handleTestCase(testCase)}
                        className="carp-btn carp-btn-secondary text-xs"
                      >
                        テスト実行
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
