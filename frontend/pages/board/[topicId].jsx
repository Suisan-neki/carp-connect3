import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { ArrowLeft, MessageSquare, Heart, Users, Clock, Eye } from 'lucide-react';

export default function TopicDetail() {
  const router = useRouter();
  const { topicId } = router.query;

  // 仮のデータソース (board.jsx からコピー)
  const topics = [
    {
      id: '1',
      author: '赤ヘル太郎',
      title: '今日の試合について語ろう！',
      content: '9回裏の逆転劇、本当に感動しました！みんなはどう思った？',
      created_at: '2025/08/12(月) 20:15:23.45',
      likes: 24,
      reply_count: 2,
      category: '試合感想'
    },
    {
      id: '4',
      author: 'スタジアム常連',
      title: 'マツダスタジアムのおすすめグルメ',
      content: 'スタジアムで食べられる美味しいものを教えて！特にビールのおつまみが知りたいです🍺',
      created_at: '2025/08/12(月) 18:30:15.23',
      likes: 18,
      reply_count: 1,
      category: 'グルメ'
    },
    {
      id: '6',
      author: '応援団長',
      title: '来週の巨人戦、一緒に応援しませんか？',
      content: '来週の巨人戦のチケットを取りました！一緒に応援してくれる仲間を募集中です。',
      created_at: '2025/08/12(月) 16:45:08.91',
      likes: 31,
      reply_count: 0,
      category: '応援募集'
    }
  ];

  const topic = topics.find(t => t.id === topicId);

  if (!topic) {
    return (
      <Layout>
        <div className="carp-card p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600">トピックが見つかりません</h1>
          <p className="mt-4 text-gray-700">指定されたトピックIDのコンテンツは存在しないか、削除されました。</p>
          <button onClick={() => router.push('/board')} className="carp-btn carp-btn-primary mt-6">
            掲示板に戻る
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{topic.title} - カープコネクト</title>
      </Head>
      <Layout>
        <div className="space-y-6 carp-fade-in">
          {/* Back Button */}
          <button onClick={() => router.push('/board')} className="carp-btn carp-btn-ghost flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>掲示板に戻る</span>
          </button>

          {/* Topic Detail Card */}
          <div className="carp-card">
            <div className="carp-card-header">
              <h1 className="text-2xl font-bold">{topic.title}</h1>
              <div className="text-red-100 mt-2 flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{topic.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{topic.created_at}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{topic.reply_count} 閲覧</span> {/* 仮で返信数を閲覧数として表示 */}
                </div>
              </div>
            </div>
            <div className="carp-card-content">
              <p className="text-gray-800 whitespace-pre-wrap">{topic.content}</p>
              <div className="flex items-center space-x-4 mt-6 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Heart className="h-5 w-5" />
                  <span>{topic.likes} いいね</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-5 w-5" />
                  <span>{topic.reply_count} 返信</span>
                </div>
              </div>
            </div>
          </div>

          {/* Replies Section (Placeholder) */}
          <div className="carp-card">
            <div className="carp-card-header">
              <h2 className="text-lg font-semibold">返信</h2>
            </div>
            <div className="carp-card-content">
              <p className="text-gray-600">まだ返信はありません。最初の返信をしてみませんか？</p>
              {/* ここに返信フォームと返信リストのロジックを追加 */}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
