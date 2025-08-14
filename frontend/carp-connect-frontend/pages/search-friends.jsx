import Layout from "../components/layout/Layout";
import { Search, User, Male, Female, Tag } from "lucide-react";

export default function SearchFriends() {
  return (
    <Layout>
      <div className="space-y-6 carp-fade-in">
        <div className="carp-card">
          <div className="carp-card-header">
            <h1 className="text-2xl font-bold">仲間を探す</h1>
            <p className="text-red-100 mt-2">条件を指定してカープ仲間を見つけましょう！</p>
          </div>
          <div className="carp-card-content space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="ユーザー名で検索"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Male className="h-5 w-5 text-gray-500" />
                <label className="flex items-center space-x-1">
                  <input type="radio" name="gender" value="male" className="form-radio text-red-600" />
                  <span>男性</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Female className="h-5 w-5 text-gray-500" />
                <label className="flex items-center space-x-1">
                  <input type="radio" name="gender" value="female" className="form-radio text-red-600" />
                  <span>女性</span>
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="キーワードで検索 (例: 観戦仲間, 飲み仲間)"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button className="carp-btn carp-btn-primary w-full">
              <Search className="h-5 w-5" />
              <span>検索</span>
            </button>
          </div>
        </div>

        {/* Search Results (Placeholder) */}
        <div className="carp-card">
          <div className="carp-card-header">
            <h2 className="text-lg font-semibold">検索結果</h2>
          </div>
          <div className="carp-card-content">
            <p className="text-gray-600">検索条件を入力して、仲間を探しましょう。</p>
            {/* ここに検索結果を表示するロジックを追加 */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
