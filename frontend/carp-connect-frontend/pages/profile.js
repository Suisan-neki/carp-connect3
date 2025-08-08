import { useState, useEffect } from \'react\';
import Head from \'next/head\';
import Layout from \'../components/layout/Layout\';
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
} from \'lucide-react\';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: \'山田太郎\',
    email: \'yamada@example.com\',
    phone: \'+81-90-1234-5678\',
    birthdate: \'1995-05-15\',
    location: \'広島県広島市\',
    bio: \'カープ愛歴25年！マツダスタジアムに通い続けています。一緒に応援してくれる仲間を探しています⚾\',
    favoritePlayer: \'鈴木誠也\',
    carpHistory: \'2000年からのファン\',
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
      title: \'カープファン歴20年\',
      description: \'20年以上カープを応援し続けています\',
      icon: Trophy,
      color: \'text-yellow-600 bg-yellow-100\'
    },
    {
      id: 2,
      title: \'スタジアム常連\',
      description: \'100試合以上スタジアムで観戦\',
      icon: Star,
      color: \'text-blue-600 bg-blue-100\'
    },
    {
      id: 3,
      title: \'コミュニティリーダー\',
      description: \'多くの投稿でいいねを獲得\',
      icon: Heart,
      color: \'text-red-600 bg-red-100\'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: \'post\',
      content: \'今日の試合、最高でした！\',
      time: \'2時間前\'
    },
    {
      id: 2,
      type: \'like\',
      content: \'カープ女子の投稿にいいねしました\',
      time: \'4時間前\'
    },
    {
      id: 3,
      type: \'friend\',
      content: \'赤ヘル太郎さんと友達になりました\',
      time: \'1日前\'
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
        <div className=\
