import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Users, 
  Calendar,
  TrendingUp,
  Heart,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalPosts: 42,
    totalFriends: 18,
    upcomingGames: 3,
    carpWins: 15
  });

  const [recentPosts, setRecentPosts] = useState([
    {
      id: 1,
      author: '赤ヘル太郎',
      content: '今日の試合、最高でした！9回裏の逆転劇に感動😭',
      time: '2時間前',
      likes: 24
    },
    {
      id: 2,
      author: 'カープ女子',
      content: 'マツダスタジアムのビールが美味しすぎる🍺 みんなで乾杯したい！',
      time: '4時間前',
      likes: 18
    },
    {
      id: 3,
      author: '広島っ子',
      content: '来週の巨人戦、一緒に応援してくれる人募集中！',
      time: '6時間前',
      likes: 31
    }
  ]);

  const [upcomingGames, setUpcomingGames] = useState([
    {
      id: 1,
      opponent: 'vs 阪神タイガース',
      date: '2025年8月10日',
      time: '18:00',
      venue: 'マツダスタジアム'
    },
    {
      id: 2,
      opponent: 'vs 読売ジャイアンツ',
      date: '2025年8月12日',
      time: '18:00',
      venue: 'マツダスタジアム'
    },
    {
      id: 3,
      opponent: 'vs 中日ドラゴンズ',
      date: '2025年8月15日',
      time: '14:00',
      venue: 'マツダスタジアム'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          おかえりなさい、{user?.attributes?.name || user?.username}さん！
        </h1>
        <p className="text-red-100">
          今日もカープと一緒に素晴らしい一日を過ごしましょう⚾
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">投稿数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">カープ仲間</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFriends}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">今後の試合</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingGames}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">今季勝利数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.carpWins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">最新の投稿</h2>
          </div>
          <div className="p-6 space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{post.author}</span>
                      <span className="text-sm text-gray-500">{post.time}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{post.content}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="text-sm text-gray-500 hover:text-red-600">
                        返信
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full text-center text-red-600 hover:text-red-700 font-medium py-2">
              もっと見る
            </button>
          </div>
        </div>

        {/* Upcoming Games */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">今後の試合予定</h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingGames.map((game) => (
              <div key={game.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{game.opponent}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{game.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{game.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{game.venue}</span>
                    </div>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    応援参加
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
            <MessageSquare className="h-5 w-5" />
            <span>新しい投稿</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            <Users className="h-5 w-5" />
            <span>仲間を探す</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            <Calendar className="h-5 w-5" />
            <span>試合予約</span>
          </button>
        </div>
      </div>
    </div>
  );
}