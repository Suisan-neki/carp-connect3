import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { 
  User, 
  Edit, 
  Camera,
  MapPin,
  Calendar,
  Heart,
  MessageSquare,
  Users,
  Trophy,
  Star,
  Settings
} from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '山田太郎',
    email: 'yamada@example.com',
    phone: '+81-90-1234-5678',
    birthdate: '1995-05-15',
    location: '広島県広島市',
    bio: 'カープ愛歴25年！マツダスタジアムに通い続けています。一緒に応援してくれる仲間を探しています⚾',
    favoritePlayer: '鈴木誠也',
    carpHistory: '2000年からのファン',
    attendanceCount: 127,
    postsCount: 42,
    friendsCount: 18,
    likesReceived: 234
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'カープファン歴20年',
      description: '20年以上カープを応援し続けています',
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 2,
      title: 'スタジアム常連',
      description: '100試合以上スタジアムで観戦',
      icon: Star,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 3,
      title: 'コミュニティリーダー',
      description: '多くの投稿でいいねを獲得',
      icon: Heart,
      color: 'text-red-600 bg-red-100'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'post',
      content: '今日の試合、最高でした！',
      time: '2時間前'
    },
    {
      id: 2,
      type: 'like',
      content: 'カープ女子の投稿にいいねしました',
      time: '4時間前'
    },
    {
      id: 3,
      type: 'friend',
      content: '赤ヘル太郎さんと友達になりました',
      time: '1日前'
    }
  ]);

  const handleSaveProfile = () => {
    setProfile(editProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <>
      <Head>
        <title>プロフィール - カープコネクト</title>
      </Head>
      
      <Layout>
        <div className="space-y-6 carp-fade-in">
          {/* Profile Header */}
          <div className="carp-card">
            <div className="carp-card-header">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  <p className="text-red-100 mb-2">{calculateAge(profile.birthdate)}歳 • {profile.location}</p>
                  <p className="text-red-100">{profile.bio}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="carp-btn carp-btn-ghost bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                >
                  <Edit className="h-4 w-4" />
                  <span>編集</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="carp-card">
              <div className="carp-card-content text-center">
                <MessageSquare className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold carp-text-red">{profile.postsCount}</p>
                <p className="text-sm text-gray-600">投稿数</p>
              </div>
            </div>
            <div className="carp-card">
              <div className="carp-card-content text-center">
                <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold carp-text-red">{profile.friendsCount}</p>
                <p className="text-sm text-gray-600">カープ仲間</p>
              </div>
            </div>
            <div className="carp-card">
              <div className="carp-card-content text-center">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold carp-text-red">{profile.likesReceived}</p>
                <p className="text-sm text-gray-600">いいね獲得</p>
              </div>
            </div>
            <div className="carp-card">
              <div className="carp-card-content text-center">
                <Calendar className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold carp-text-red">{profile.attendanceCount}</p>
                <p className="text-sm text-gray-600">観戦回数</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Details */}
            <div className="carp-card">
              <div className="carp-card-header">
                <h2 className="text-lg font-semibold">プロフィール詳細</h2>
              </div>
              <div className="carp-card-content">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="carp-form-group">
                      <label className="carp-label">氏名</label>
                      <input
                        type="text"
                        value={editProfile.name}
                        onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                        className="carp-input"
                      />
                    </div>
                    <div className="carp-form-group">
                      <label className="carp-label">自己紹介</label>
                      <textarea
                        value={editProfile.bio}
                        onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                        rows={3}
                        className="carp-input carp-textarea"
                      />
                    </div>
                    <div className="carp-form-group">
                      <label className="carp-label">居住地</label>
                      <input
                        type="text"
                        value={editProfile.location}
                        onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                        className="carp-input"
                      />
                    </div>
                    <div className="carp-form-group">
                      <label className="carp-label">好きな選手</label>
                      <input
                        type="text"
                        value={editProfile.favoritePlayer}
                        onChange={(e) => setEditProfile({ ...editProfile, favoritePlayer: e.target.value })}
                        className="carp-input"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveProfile}
                        className="carp-btn carp-btn-primary"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="carp-btn carp-btn-ghost"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{profile.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">
                        {new Date(profile.birthdate).toLocaleDateString('ja-JP')} ({calculateAge(profile.birthdate)}歳)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">好きな選手: {profile.favoritePlayer}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{profile.carpHistory}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="carp-card">
              <div className="carp-card-header">
                <h2 className="text-lg font-semibold">実績・バッジ</h2>
              </div>
              <div className="carp-card-content space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${achievement.color}`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="carp-card">
            <div className="carp-card-header">
              <h2 className="text-lg font-semibold">最近のアクティビティ</h2>
            </div>
            <div className="carp-card-content space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    {activity.type === 'post' && <MessageSquare className="h-4 w-4 text-red-600" />}
                    {activity.type === 'like' && <Heart className="h-4 w-4 text-red-600" />}
                    {activity.type === 'friend' && <Users className="h-4 w-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{activity.content}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}