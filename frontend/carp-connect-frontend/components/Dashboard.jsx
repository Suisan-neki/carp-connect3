import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Users, 
  Calendar,
  TrendingUp,
  Heart,
  MapPin,
  Clock,
  Star,
  Plus,
  Search,
  Ticket
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
    <div className="space-y-6 carp-fade-in">
      {/* Welcome Section */}
      <div className="carp-card">
        <div className="carp-card-header">
          <h1 className="text-2xl font-bold">
            おかえりなさい、{user?.attributes?.name || user?.username}さん！
          </h1>
          <p className="text-red-100 mt-2">
            今日もカープと一緒に素晴らしい一日を過ごしましょう⚾
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="carp-card">
          <div className="carp-card-content">
            <div className="flex items-center">
              <div className="p-3 bg-red-50 rounded-xl">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">投稿数</p>
                <p className="text-2xl font-bold carp-text-red">{stats.totalPosts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="carp-card">
          <div className="carp-card-content">
            <div className="flex items-center">
              <div className="p-3 bg-red-50 rounded-xl">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">カープ仲間</p>
                <p className="text-2xl font-bold carp-text-red">{stats.totalFriends}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="carp-card">
          <div className="carp-card-content">
            <div className="flex items-center">
              <div className="p-3 bg-red-50 rounded-xl">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">今後の試合</p>
                <p className="text-2xl font-bold carp-text-red">{stats.upcomingGames}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="carp-card">
          <div className="carp-card-content">
            <div className="flex items-center">
              <div className="p-3 bg-red-50 rounded-xl">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">今季勝利数</p>
                <p className="text-2xl font-bold carp-text-red">{stats.carpWins}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="carp-card">
          <div className="carp-card-header">
            <h2 className="text-lg font-semibold">最新の投稿</h2>
          </div>
          <div className="carp-card-content space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="border-b border-gray-100 pb-4 last:border-b-0">
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
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                        返信
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="carp-btn carp-btn-ghost w-full">
              もっと見る
            </button>
          </div>
        </div>

        {/* Upcoming Games */}
        <div className="carp-card">
          <div className="carp-card-header">
            <h2 className="text-lg font-semibold">今後の試合予定</h2>
          </div>
          <div className="carp-card-content space-y-4">
            {upcomingGames.map((game) => (
              <div key={game.id} className="border border-red-100 rounded-lg p-4 hover:bg-red-50 transition-colors">
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
                  <button className="carp-btn carp-btn-primary">
                    応援参加
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="carp-card">
        <div className="carp-card-header">
          <h2 className="text-lg font-semibold">クイックアクション</h2>
        </div>
        <div className="carp-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="carp-btn carp-btn-primary">
              <Plus className="h-5 w-5" />
              <span>新しい投稿</span>
            </button>
            <button className="carp-btn carp-btn-secondary">
              <Search className="h-5 w-5" />
              <span>仲間を探す</span>
            </button>
            <button className="carp-btn carp-btn-secondary">
              <Ticket className="h-5 w-5" />
              <span>試合予約</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}