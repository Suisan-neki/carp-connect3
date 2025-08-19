import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { 
  Home, 
  MessageSquare, 
  Users, 
  User, 
  LogOut, 
  Menu,
  X,
  Heart
} from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      // ブラウザのストレージを強制的にクリアする
      localStorage.clear();
      // Amplifyの公式サインアウトを実行
      await Auth.signOut({ global: true });
    } catch (error) {
      // signOutはセッションがない場合にエラーを出すことがあるため、コンソールに出力するのみ
      console.error('Error during sign out process:', error);
    } finally {
      // どのような場合でも、最終的にログインページへハードリフレッシュする
      window.location.href = '/';
    }
  };

  const navigation = [
    { name: 'ホーム', href: '/home', icon: Home },
    { name: '掲示板', href: '/board', icon: MessageSquare },
    { name: 'DM', href: '/messages', icon: Users },
    { name: 'プロフィール', href: '/profile', icon: User },
  ];

  return (
      <div className="min-h-screen carp-bg-gradient">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-4 carp-gradient">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-white" />
                <span className="ml-2 text-3xl font-bold text-white" style={{ fontFamily: 'TamanegeKaisyoGeki, sans-serif' }}>カープコネクト</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-red-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="carp-nav-item"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="p-4 border-t border-red-100">
              <button
                onClick={handleSignOut}
                className="carp-nav-item w-full"
              >
                <LogOut className="h-5 w-5 mr-3" />
                ログアウト
              </button>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-red-100">
            <div className="flex h-16 items-center px-4 carp-gradient">
              <Heart className="h-8 w-8 text-white" />
              <span className="ml-2 text-3xl font-bold text-white" style={{ fontFamily: 'TamanegeKaisyoGeki, sans-serif' }}>カープコネクト</span>
            </div>
            <nav className="flex-1 px-4 py-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="carp-nav-item"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="p-4 border-t border-red-100">
              <button
                onClick={handleSignOut}
                className="carp-nav-item w-full"
              >
                <LogOut className="h-5 w-5 mr-3" />
                ログアウト
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-red-100 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:text-red-600 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-red-200" />
                <div className="flex items-center text-sm text-gray-600">
                  <Heart className="h-4 w-4 text-red-600 mr-1" />
                  <span>カープコネクト</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}