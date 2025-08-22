import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import {
  MessageSquare,
  Heart,
  Reply,
  Plus,
  TrendingUp,
  Clock,
  Users,
  ArrowRight,
  Eye
} from 'lucide-react';

export default function Board() {
  const [topics, setTopics] = useState([
    {
      id: '1',
      author: 'ケンタ',
      title: '今日の試合について語ろう！',
      content: '9回裏の逆転劇、本当に感動しました！みんなはどう思った？',
      created_at: '2025/08/12(月) 20:15:23.45',
      likes: 24,
      reply_count: 2,
      category: '試合感想'
    },
    {
      id: '4',
      author: 'ミユ',
      title: 'マツダスタジアムのおすすめグルメ',
      content: 'スタジアムで食べられる美味しいものを教えて！特にビールのおつまみが知りたいです🍺',
      created_at: '2025/08/12(月) 18:30:15.23',
      likes: 18,
      reply_count: 1,
      category: 'グルメ'
    },
    {
      id: '6',
      author: 'タクミ',
      title: '来週の巨人戦、一緒に応援しませんか？',
      content: '来週の巨人戦のチケットを取りました！一緒に応援してくれる仲間を募集中です。',
      created_at: '2025/08/12(月) 16:45:08.91',
      likes: 31,
      reply_count: 0,
      category: '応援募集'
    }
  ]);

  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: '試合感想'
  });

  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const categories = ['試合感想', 'グルメ', '応援募集', '戦力分析', 'その他'];
  const router = useRouter();

  const handleSubmitTopic = (e) => {
    e.preventDefault();
    if (newTopic.title && newTopic.content) {
      const topic = {
        id: String(topics.length + 1),
        author: 'あなた',
        title: newTopic.title,
        content: newTopic.content,
        created_at: new Date().toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\//g, '/').replace(',', ''),
        likes: 0,
        reply_count: 0,
        category: newTopic.category
      };
      setTopics([topic, ...topics]);
      setNewTopic({ title: '', content: '', category: '試合感想' });
      setShowNewTopicForm(false);
    }
  };

  const handleTopicClick = (topicId) => {
    router.push(`/board/${topicId}`);
  };

  return (
    <>
      <Head>
        <title>掲示板 - カープコネクト</title>
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="carp-card">
            <div className="carp-card-header">
              <h1 className="text-xl font-bold">カープ掲示板</h1>
              <p className="text-red-100 mt-1">カープファン同士で情報交換しよう！</p>
            </div>
          </div>

          {/* New Topic Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowNewTopicForm(true)}
              className="carp-btn carp-btn-primary"
            >
              <Plus className="h-4 w-4" />
              <span>新規トピック作成</span>
            </button>
          </div>

          {/* New Topic Form */}
          {showNewTopicForm && (
            <div className="carp-card">
              <div className="carp-card-header">
                <h2 className="text-lg font-semibold">新しいトピック</h2>
              </div>
              <div className="carp-card-content">
                <form onSubmit={handleSubmitTopic} className="space-y-4">
                  <div className="carp-form-group">
                    <label className="carp-label">カテゴリー</label>
                    <select
                      value={newTopic.category}
                      onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                      className="carp-input"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="carp-form-group">
                    <label className="carp-label">タイトル</label>
                    <input
                      type="text"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                      className="carp-input"
                      placeholder="トピックのタイトルを入力してください"
                      required
                    />
                  </div>
                  <div className="carp-form-group">
                    <label className="carp-label">内容</label>
                    <textarea
                      value={newTopic.content} 
                      onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                      rows={4}
                      className="carp-input carp-textarea"
                      placeholder="トピックの最初の投稿内容を入力してください"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    投稿された内容は、自動モデレーションシステムによって不適切な内容がないか確認されます。
                  </p>
                  <div className="flex space-x-3">
                    <button type="submit" className="carp-btn carp-btn-primary">
                      トピック作成
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTopicForm(false)}
                      className="carp-btn carp-btn-ghost"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Topic List */}
          <div className="carp-board">
            {topics.map((topic) => (
              <div key={topic.id} className="carp-board-post cursor-pointer hover:bg-red-50 transition-colors" onClick={() => handleTopicClick(topic.id)}>
                <div className="carp-board-post-header flex justify-between items-center">
                  <div>
                    <span className="carp-board-post-name font-bold text-lg">{topic.title}</span>
                    <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded ml-2">
                      {topic.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{topic.author}</span>
                    <Clock className="h-4 w-4" />
                    <span>{topic.created_at}</span>
                  </div>
                </div>
                <div className="carp-board-post-content text-gray-700 mt-2 line-clamp-2">
                  {topic.content}
                </div>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{topic.likes} いいね</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{topic.reply_count} 返信</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{topic.reply_count} 閲覧</span> {/* 仮で返信数を閲覧数として表示 */}
                  </div>
                  <button className="carp-board-reply-link text-xs flex items-center space-x-1">
                    <span>トピックを見る</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <button className="carp-btn carp-btn-ghost">
              もっと見る
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}
