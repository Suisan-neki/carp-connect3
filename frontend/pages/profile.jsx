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

const iconMap = {
  trophy: Trophy,
  star: Star,
  heart: Heart,
};

// --- 静的デモデータ ---
const mockProfile = {
  id: 'user1',
  name: '水産',
  birthdate: '2003-07-25',
  location: '広島県広島市',
  bio: '愛媛→広島、大学2年生',
  favorite_player: '矢野雅哉',
  carp_history: '2016年からのファン',
  attendance_count: 10,
  posts_count: 42,
  friends_count: 18,
  likes_received: 234,
  profile_image_url: null,
};

const mockAchievements = [
  {
    id: '1',
    title: '若鯉応援団',
    description: '期待の若手を熱烈応援中！',
    icon: 'star',
    color: 'blue',
  },
  {
    id: '2',
    title: '新世代カープファン',
    description: '2016年から熱烈応援！',
    icon: 'heart',
    color: 'red',
  },
  {
    id: '3',
    title: '瀬戸内カープ魂',
    description: '愛媛から広島へ！',
    icon: 'trophy',
    color: 'yellow',
  }
];
// --- ここまで ---


export default function Profile() {
  const [profile, setProfile] = useState(mockProfile);
  const [editProfile, setEditProfile] = useState(mockProfile);
  const [achievements, setAchievements] = useState(mockAchievements);
  const [editAchievements, setEditAchievements] = useState(mockAchievements);
  const [isEditing, setIsEditing] = useState(false);

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
      content: 'ユナさんの投稿にいいねしました',
      time: '4時間前'
    },
    {
      id: 3,
      type: 'friend',
      content: 'はやとさんと友達になりました',
      time: '1日前'
    }
  ]);

  // 「保存」ボタンの処理（静的デモ用）
  const handleSaveProfile = () => {
    setProfile(editProfile);
    setAchievements(editAchievements);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile(profile);
    setEditAchievements(achievements);
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

  if (!profile) {
    return <Layout><div className="text-center p-10">プロフィールデータの読み込みに失敗しました。</div></Layout>;
  }


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
                <p className="text-2xl font-bold carp-text-red">{profile.posts_count}</p>
                <p className="text-sm text-gray-600">投稿数</p>
              </div>
            </div>
            <div className="carp-card">
              <div className="carp-card-content text-center">
                <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold carp-text-red">{profile.friends_count}</p>
                <p className="text-sm text-gray-600">カープ仲間</p>
              </div>
            </div>
            <div className="carp-card">
              <div className="carp-card-content text-center">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold carp-text-red">{profile.likes_received}</p>
                <p className="text-sm text-gray-600">いいね獲得</p>
              </div>
            </div>
            <div className="carp-card">
              <div className="carp-card-content text-center">
                <Calendar className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold carp-text-red">{profile.attendance_count}</p>
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
                        value={editProfile.favorite_player}
                        onChange={(e) => setEditProfile({ ...editProfile, favorite_player: e.target.value })}
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
                      <span className="text-gray-700">好きな選手: {profile.favorite_player}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{profile.carp_history}</span>
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
                {isEditing ? (
                  editAchievements.map((achievement, index) => (
                    <div key={achievement.id} className="space-y-2 p-3 bg-red-50 rounded-lg">
                      <div className="carp-form-group">
                        <label className="carp-label">バッジ{index + 1} タイトル</label>
                        <input
                          type="text"
                          value={achievement.title}
                          onChange={(e) => {
                            const newAchievements = [...editAchievements];
                            newAchievements[index].title = e.target.value;
                            setEditAchievements(newAchievements);
                          }}
                          className="carp-input"
                        />
                      </div>
                      <div className="carp-form-group">
                        <label className="carp-label">バッジ{index + 1} 説明</label>
                        <input
                          type="text"
                          value={achievement.description}
                          onChange={(e) => {
                            const newAchievements = [...editAchievements];
                            newAchievements[index].description = e.target.value;
                            setEditAchievements(newAchievements);
                          }}
                          className="carp-input"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  achievements.map((achievement) => {
                    const IconComponent = iconMap[achievement.icon];
                    const colorClass = `text-${achievement.color}-600 bg-${achievement.color}-100`;
                    return (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          {IconComponent && <IconComponent className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    );
                  })
                )}
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