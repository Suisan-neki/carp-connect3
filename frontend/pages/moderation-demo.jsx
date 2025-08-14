import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Clock,
  Users,
  MessageSquare,
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
    // 統計情報とテストケースを取得
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
      console.error('統計情報の取得に失敗:', error);
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
      console.error('テストケースの取得に失敗:', error);
    }
  };

  const analyzeContent = async (content) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/moderation/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          type: 'post',
          user_id: 'demo_user',
          content_id: `demo_${Date.now()}`
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.moderation);
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

  const getActionIcon = (action) => {
    switch (action) {
      case 'allow':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warn':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'review':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'block':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'allow':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warn':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'block':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Head>
        <title>コンテンツモデレーション デモ - カープコネクト</title>
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="carp-card">
            <div className="carp-card-header">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-red-600" />
                <div>
                  <h1 className="text-2xl font-bold">コンテンツモデレーション デモ</h1>
                  <p className="text-red-100 mt-1">Amazon Bedrock + ELYZA-japanese-Llama-2 による自動コンテンツ検証</p>
                </div>
              </div>
            </div>
          </div>

          {/* 統計情報 */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="carp-card">
                <div className="carp-card-content">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">総分析数</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total_analyzed.toLocaleString()}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="carp-card">
                <div className="carp-card-content">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">ブロック数</p>
                      <p className="text-2xl font-bold text-red-600">{stats.blocked_content}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </div>
              </div>
              <div className="carp-card">
                <div className="carp-card-content">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">精度</p>
                      <p className="text-2xl font-bold text-green-600">{(stats.analysis_accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              </div>
              <div className="carp-card">
                <div className="carp-card-content">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">応答時間</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.average_response_time}s</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* コンテンツ分析テスト */}
          <div className="carp-card">
            <div className="carp-card-header">
              <h2 className="text-lg font-semibold">コンテンツ分析テスト</h2>
              <p className="text-sm text-gray-600 mt-1">投稿内容を入力して、AIによる自動モデレーションをテストできます</p>
            </div>
            <div className="carp-card-content space-y-4">
              <div>
                <label className="carp-label">テスト投稿内容</label>
                <textarea
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  rows={4}
                  className="carp-input carp-textarea"
                  placeholder="分析したい投稿内容を入力してください..."
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!testContent.trim() || isAnalyzing}
                className="carp-btn carp-btn-primary"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
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
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getActionIcon(analysisResult.action)}
                    <div>
                      <p className="font-medium">判定結果</p>
                      <p className="text-sm text-gray-600">{analysisResult.reason}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getActionColor(analysisResult.action)}`}>
                    {analysisResult.action.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">リスクスコア</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          analysisResult.score >= 0.7 ? 'bg-red-500' :
                          analysisResult.score >= 0.4 ? 'bg-yellow-500' :
                          analysisResult.score >= 0.2 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${analysisResult.score * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{(analysisResult.score * 100).toFixed(1)}%</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">投稿可否</p>
                    <div className={`flex items-center space-x-2 ${analysisResult.safe_to_post ? 'text-green-600' : 'text-red-600'}`}>
                      {analysisResult.safe_to_post ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {analysisResult.safe_to_post ? '投稿可能' : '投稿不可'}
                      </span>
                    </div>
                  </div>
                </div>

                {analysisResult.detected_issues && analysisResult.detected_issues.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">検出された問題</p>
                    <ul className="space-y-1">
                      {analysisResult.detected_issues.map((issue, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* テストケース */}
          <div className="carp-card">
            <div className="carp-card-header">
              <h2 className="text-lg font-semibold">テストケース</h2>
              <p className="text-sm text-gray-600 mt-1">様々なパターンのコンテンツでモデレーション機能をテストできます</p>
            </div>
            <div className="carp-card-content">
              <div className="grid grid-cols-1 gap-3">
                {testCases.map((testCase) => (
                  <div key={testCase.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">{testCase.description}</p>
                        <p className="text-sm text-gray-600 mb-2">"{testCase.content}"</p>
                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getActionColor(testCase.expected_action)}`}>
                          {getActionIcon(testCase.expected_action)}
                          <span className="ml-1">期待結果: {testCase.expected_action.toUpperCase()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTestCase(testCase)}
                        className="carp-btn carp-btn-ghost text-sm"
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
