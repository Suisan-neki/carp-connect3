import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { 
  MessageSquare, 
  Heart, 
  Reply, 
  Plus,
  TrendingUp,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';

export default function Board() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      number: 1,
      author: '赤ヘル太郎',
      title: '今日の試合について語ろう！',
      content: '9回裏の逆転劇、本当に感動しました！みんなはどう思った？',
      time: '2025/08/12(月) 20:15:23.45',
      likes: 24,
      replies: [
        {
          id: 2,
          number: 2,
          author: 'カープ女子',
          content: '>>1\n本当に最高でした！鳥肌が立ちました',
          time: '2025/08/12(月) 20:18:45.12'
        },
        {
          id: 3,
          number: 3,
          author: '広島っ子',
          content: '>>1\n今年のカープは違うね！優勝いけるかも',
          time: '2025/08/12(月) 20:22:11.78'
        }
      ],
      category: '試合感想'
    },
    {
      id: 4,
      number: 4,
      author: 'スタジアム常連',
      title: 'マツダスタジアムのおすすめグルメ',
      content: 'スタジアムで食べられる美味しいものを教えて！特にビールのおつまみが知りたいです🍺',
      time: '2025/08/12(月) 18:30:15.23',
      likes: 18,
      replies: [
        {
          id: 5,
          number: 5,
          author: 'グルメ通',
          content: '>>4\nカープうどんは絶対食べるべき！',
          time: '2025/08/12(月) 18:45:32.67'
        }
      ],
      category: 'グルメ'
    },
    {
      id: 6,
      number: 6,
      author: '応援団長',
      title: '来週の巨人戦、一緒に応援しませんか？',
      content: '来週の巨人戦のチケットを取りました！一緒に応援してくれる仲間を募集中です。',
      time: '2025/08/12(月) 16:45:08.91',
      likes: 31,
      replies: [],
      category: '応援募集'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '試合感想'
  });

  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);

  const categories = ['試合感想', 'グルメ', '応援募集', '戦力分析', 'その他'];

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      const post = {
        id: posts.length + 1,
        number: posts.length + 1,
        author: 'あなた',
        title: newPost.title,
        content: newPost.content,
        time: new Date().toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\//g, '/').replace(',', ''),
        likes: 0,
        replies: [],
        category: newPost.category
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', category: '試合感想' });
      setShowNewPostForm(false);
    }
  };

  const handleReply = (postId, replyContent) => {
    if (!replyContent.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newReply = {
          id: Date.now(),
          number: post.replies.length + post.number + 1,
          author: 'あなた',
          content: `>>${post.number}\n${replyContent}`,
          time: new Date().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).replace(/\//g, '/').replace(',', '')
        };
        return {
          ...post,
          replies: [...post.replies, newReply]
        };
      }
      return post;
    }));
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

          {/* New Post Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowNewPostForm(true)}
              className="carp-btn carp-btn-primary"
            >
              <Plus className="h-4 w-4" />
              <span>新規投稿</span>
            </button>
          </div>

          {/* New Post Form */}
          {showNewPostForm && (
            <div className="carp-card">
              <div className="carp-card-header">
                <h2 className="text-lg font-semibold">新しい投稿</h2>
              </div>
              <div className="carp-card-content">
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <div className="carp-form-group">
                    <label className="carp-label">カテゴリー</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
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
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="carp-input"
                      placeholder="投稿のタイトルを入力してください"
                      required
                    />
                  </div>
                  <div className="carp-form-group">
                    <label className="carp-label">内容</label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      rows={4}
                      className="carp-input carp-textarea"
                      placeholder="投稿の内容を入力してください"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="carp-btn carp-btn-primary">
                      投稿する
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="carp-btn carp-btn-ghost"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Board Posts - 2ch Style */}
          <div className="carp-board">
            {posts.map((post) => (
              <div key={post.id}>
                {/* Main Post */}
                <div className="carp-board-post">
                  <div className="carp-board-post-header">
                    <span className="carp-board-post-number">{post.number}</span>
                    <span className="carp-board-post-name">{post.author}</span>
                    <span className="carp-board-post-date">{post.time}</span>
                    <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded ml-2">
                      {post.category}
                    </span>
                  </div>
                  <div className="carp-board-post-content">
                    <strong>{post.title}</strong>
                    <br />
                    {post.content}
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <button className="carp-board-reply-link text-xs">
                      返信
                    </button>
                    <span className="text-xs text-gray-500">
                      {post.likes} いいね
                    </span>
                  </div>
                </div>

                {/* Replies */}
                {post.replies.map((reply) => (
                  <div key={reply.id} className="carp-board-post">
                    <div className="carp-board-post-header">
                      <span className="carp-board-post-number">{reply.number}</span>
                      <span className="carp-board-post-name">{reply.author}</span>
                      <span className="carp-board-post-date">{reply.time}</span>
                    </div>
                    <div className="carp-board-post-content">
                      {reply.content.split('\n').map((line, index) => (
                        <div key={index}>
                          {line.startsWith('>>') ? (
                            <span className="carp-board-reply-link">{line}</span>
                          ) : (
                            line
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Reply Form */}
                <div className="carp-board-post bg-gray-50">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const replyContent = formData.get('reply');
                    handleReply(post.id, replyContent);
                    e.target.reset();
                  }}>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="reply"
                        placeholder={`>>${post.number} への返信...`}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        返信
                      </button>
                    </div>
                  </form>
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