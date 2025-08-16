import { useState, useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { ChevronDown, Heart, Users, Calendar, Trophy } from 'lucide-react';

const WelcomeSection = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAuth = () => {
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.7), rgba(220, 38, 38, 0.8)), url('/mazda-stadium.jpg')`
        }}
      >
        <div className="text-center text-white px-6 max-w-4xl">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 text-shadow-lg">
              カープコネクト
            </h1>
            <div className="w-32 h-1 bg-white mx-auto mb-6"></div>
          </div>

          {/* Main Concept */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              赤い情熱で繋がる、カープファンの新しいコミュニティ
            </h2>
            <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
              マツダスタジアムでの感動を共有し、同じ赤い魂を持つ仲間と出会える場所。
              試合観戦から日常の応援まで、カープ愛を通じて深い絆を築きましょう。
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2">熱い応援</h3>
              <p className="text-sm opacity-90">カープへの愛を共有</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2">仲間との絆</h3>
              <p className="text-sm opacity-90">新しい友達を見つけよう</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2">試合情報</h3>
              <p className="text-sm opacity-90">最新の試合予定をチェック</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2">勝利の喜び</h3>
              <p className="text-sm opacity-90">一緒に勝利を祝おう</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-8">
            <button
              onClick={scrollToAuth}
              className="bg-white text-red-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              今すぐ参加する
            </button>
          </div>

          {/* Scroll Hint */}
          {showScrollHint && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="h-8 w-8 text-white opacity-70" />
              <p className="text-sm mt-2 opacity-70">スクロールして登録・ログイン</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomAuthenticator = ({ children }) => {
  return (
    <div>
      <WelcomeSection />
      
      {/* Authentication Section */}
      <div id="auth-section" className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              カープコネクトに参加
            </h2>
            <p className="text-gray-600">
              アカウントを作成するか、既存のアカウントでログインしてください
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Authenticator
              components={{
                Header() {
                  return (
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  );
                }
              }}
              formFields={{
                signIn: {
                  username: {
                    placeholder: 'メールアドレスを入力',
                    label: 'メールアドレス'
                  },
                  password: {
                    placeholder: 'パスワードを入力',
                    label: 'パスワード'
                  }
                },
                signUp: {
                  username: {
                    placeholder: 'メールアドレスを入力',
                    label: 'メールアドレス'
                  },
                  password: {
                    placeholder: 'パスワードを入力',
                    label: 'パスワード'
                  },
                  confirm_password: {
                    placeholder: 'パスワードを再入力',
                    label: 'パスワード確認'
                  }
                }
              }}
              labels={{
                'Sign In': 'ログイン',
                'Sign Up': 'アカウント作成',
                'Create Account': 'アカウント作成',
                'Forgot your password?': 'パスワードをお忘れですか？',
                'Reset password': 'パスワードリセット',
                'Send code': 'コードを送信',
                'Confirm': '確認',
                'Back to Sign In': 'ログインに戻る',
                'Confirm Sign Up': 'アカウント確認',
                'Resend Code': 'コードを再送信'
              }}
            >
              {children}
            </Authenticator>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAuthenticator;
