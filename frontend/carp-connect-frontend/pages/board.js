import { useState, useEffect } from \'react\';
import Head from \'next/head\';
import Layout from \'../components/layout/Layout\';
import { 
  MessageSquare, 
  Heart, 
  Reply, 
  Plus,
  TrendingUp,
  Clock,
  Users
} from \'lucide-react\';

export default function Board() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: \'赤ヘル太郎\',
      title: \'今日の試合について語ろう！\',
      content: \'9回裏の逆転劇、本当に感動しました！みんなはどう思った？\',
      time: \'2時間前\',
      likes: 24,
      replies: 8,
      category: \'試合感想\'
    },
    {
      id: 2,
      author: \'カープ女子\',
      title: \'マツダスタジアムのおすすめグルメ\',
      content: \'スタジアムで食べられる美味しいものを教えて！特にビールのおつまみが知りたいです🍺\',
      time: \'4時間前\',
      likes: 18,
      replies: 12,
      category: \'グルメ\'
    },
    {
      id: 3,
      author: \'広島っ子\',
      title: \'来週の巨人戦、一緒に応援しませんか？\',
      content: \'来週の巨人戦のチケットを取りました！一緒に応援してくれる仲間を募集中です。\',
      time: \'6時間前\',
      likes: 31,
      replies: 15,
      category: \'応援募集\'
    },
    {
      id: 4,
      author: \'カープ歴20年\',
      title: \'今季の戦力分析\',
      content: \'新加入選手の活躍もあって、今年は期待できそうですね。特に投手陣の層が厚くなった印象です。\',
      time: \'8時間前\',
      likes: 42,
      replies: 23,
      category: \'戦力分析\'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: \'\',
    content: \'\',
    category: \'試合感想\'
  });

  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const categories = [\'試合感想\', \'グルメ\', \'応援募集\', \'戦力分析\', \'その他\'];

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      const post = {
        id: posts.length + 1,
        author: \'あなた\',
        title: newPost.title,
        content: newPost.content,
        time: \'たった今\',
        likes: 0,
        replies: 0,
        category: newPost.category
      };
      setPosts([post, ...posts]);
      setNewPost({ title: \'\', content: \'\', category: \'試合感想\' });
      setShowNewPostForm(false);
    }
  };

  return (
    <>
      <Head>
        <title>掲示板 - カープコネクト</title>
      </Head>
      
      <Layout>
        <div className=\"space-y-6\">
          {/* Header */}
          <div className=\"flex items-center justify-between\">
            <div>
              <h1 className=\"text-2xl font-bold text-gray-900\">カープ掲示板</h1>
              <p className=\"text-gray-600\">カープファン同士で情報交換しよう！</p>
            </div>
            <button
              onClick={() => setShowNewPostForm(true)}
              className=\"flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700\"
            >
              <Plus className=\"h-5 w-5\" />
              <span>新規投稿</span>
            </button>
          </div>

          {/* Stats */}
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
            <div className=\"bg-white rounded-lg p-6 shadow-sm border\">
              <div className=\"flex items-center\">
                <div className=\"p-2 bg-red-100 rounded-lg\">
                  <MessageSquare className=\"h-6 w-6 text-red-600\" />
                </div>
                <div className=\"ml-4\">
                  <p className=\"text-sm font-medium text-gray-600\">総投稿数</p>
                  <p className=\"text-2xl font-bold text-gray-900\">1,234</p>
                </div>
              </div>
            </div>

            <div className=\"bg-white rounded-lg p-6 shadow-sm border\">
              <div className=\"flex items-center\">
                <div className=\"p-2 bg-blue-100 rounded-lg\">
                  <Users className=\"h-6 w-6 text-blue-600\" />
                </div>
                <div className=\"ml-4\">
                  <p className=\"text-sm font-medium text-gray-600\">アクティブユーザー</p>
                  <p className=\"text-2xl font-bold text-gray-900\">89</p>
                </div>
              </div>
            </div>

            <div className=\"bg-white rounded-lg p-6 shadow-sm border\">
              <div className=\"flex items-center\">
                <div className=\"p-2 bg-green-100 rounded-lg\">
                  <TrendingUp className=\"h-6 w-6 text-green-600\" />
                </div>
                <div className=\"ml-4\">
                  <p className=\"text-sm font-medium text-gray-600\">今日の投稿</p>
                  <p className=\"text-2xl font-bold text-gray-900\">42</p>
                </div>
              </div>
            </div>
          </div>

          {/* New Post Form */}
          {showNewPostForm && (
            <div className=\"bg-white rounded-lg shadow-sm border p-6\">
              <h2 className=\"text-lg font-semibold text-gray-900 mb-4\">新しい投稿</h2>
              <form onSubmit={handleSubmitPost} className=\"space-y-4\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    カテゴリー
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500\"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    タイトル
                  </label>
                  <input
                    type=\"text\"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500\"
                    placeholder=\"投稿のタイトルを入力してください\"
                    required
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    内容
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500\"
                    placeholder=\"投稿の内容を入力してください\"
                    required
                  />
                </div>
                <div className=\"flex space-x-3\">
                  <button
                    type=\"submit\"
                    className=\"bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700\"
                  >
                    投稿する
                  </button>
                  <button
                    type=\"button\"
                    onClick={() => setShowNewPostForm(false)}
                    className=\"bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400\"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posts List */}
          <div className=\"space-y-4\">
            {posts.map((post) => (
              <div key={post.id} className=\"bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow\">
                <div className=\"flex items-start justify-between\">
                  <div className=\"flex-1\">
                    <div className=\"flex items-center space-x-2 mb-2\">
                      <span className=\"inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full\">
                        {post.category}
                      </span>
                      <span className=\"text-sm text-gray-500\">{post.time}</span>
                    </div>
                    <h3 className=\"text-lg font-semibold text-gray-900 mb-2\">
                      {post.title}
                    </h3>
                    <p className=\"text-gray-700 mb-4\">{post.content}</p>
                    <div className=\"flex items-center space-x-6\">
                      <div className=\"flex items-center space-x-2\">
                        <div className=\"w-8 h-8 bg-red-100 rounded-full flex items-center justify-center\">
                          <Heart className=\"h-4 w-4 text-red-600\" />
                        </div>
                        <span className=\"font-medium text-gray-900\">{post.author}</span>
                      </div>
                      <div className=\"flex items-center space-x-4\">
                        <button className=\"flex items-center space-x-1 text-gray-500 hover:text-red-600\">
                          <Heart className=\"h-4 w-4\" />
                          <span className=\"text-sm\">{post.likes}</span>
                        </button>
                        <button className=\"flex items-center space-x-1 text-gray-500 hover:text-blue-600\">
                          <Reply className=\"h-4 w-4\" />
                          <span className=\"text-sm\">{post.replies}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}
