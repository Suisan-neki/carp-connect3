import React from 'react';

export default function Welcome() {
  const goToLoginPage = () => {
    // ハードリフレッシュでログインページへ移動し、状態をクリーンにする
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">カープコネクトへようこそ！</h1>
        <p className="text-xl text-gray-700 mb-8">
          下のボタンからログインまたは新規登録をして、カープファンと繋がりましょう！
        </p>
        
        <button
          onClick={goToLoginPage}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out"
        >
          はじめる
        </button>
      </div>
    </div>
  );
}
