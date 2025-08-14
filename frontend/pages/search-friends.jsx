import Layout from "../components/layout/Layout";
import { FaSearch, FaUser, FaMale, FaFemale, FaTag } from "react-icons/fa"; // react-iconsからインポート

export default function SearchFriends() {
  return (
    <Layout>
      <div className="space-y-6 carp-fade-in">
        <div className="carp-card">
          <div className="carp-card-header">
            <h1 className="text-2xl font-bold">仲間を探す</h1>
            <p className="text-red-100 mt-2">カープの熱量で、新たな仲間と出会い、地域との繋がりを深めましょう！</p>
          </div>
          <div className="carp-card-content space-y-4">
            <div className="flex items-center space-x-2">
              <FaUser className="h-5 w-5 text-gray-500" /> {/* FaUser に変更 */}
              <input
                type="text"
                placeholder="ユーザー名で検索"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaMale className="h-5 w-5 text-gray-500" /> {/* FaMale に変更 */}
                <label className="flex items-center space-x-1">
                  <input type="radio" name="gender" value="male" className="form-radio text-red-600" />
                  <span>男性</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <FaFemale className="h-5 w-5 text-gray-500" /> {/* FaFemale に変更 */}
                <label className="flex items-center space-x-1">
                  <input type="radio" name="gender" value="female" className="form-radio text-red-600" />
                  <span>女性</span>
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaTag className="h-5 w-5 text-gray-500" /> {/* FaTag に変更 */}
              <input
                type="text"
                placeholder="キーワードで検索 (例: 観戦仲間, 飲み仲間)"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button className="carp-btn carp-btn-primary w-full">
              <FaSearch className="h-5 w-5" /> {/* FaSearch に変更 */}
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
            <p className="text-gray-600">さあ、あなたにぴったりのカープ仲間を見つけましょう！</p>
            {/* ここに検索結果を表示するロジックを追加 */}
          </div>
        </div>
      </div>
    </Layout>
  );
}

