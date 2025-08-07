import { useState, useEffect } from \'react\';
import Head from \'next/head\';
import Layout from \'../components/layout/Layout\';
import { 
  MessageSquare, 
  Send, 
  Search,
  Plus,
  Users,
  Circle,
  MoreVertical
} from \'lucide-react\';

export default function Messages() {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: \'赤ヘル太郎\',
      lastMessage: \'今度の試合、一緒に見に行きませんか？\',
      time: \'2分前\',
      unread: 2,
      online: true,
      type: \'dm\'
    },
    {
      id: 2,
      name: \'カープ女子会\',
      lastMessage: \'みんな: スタジアムグルメの写真をシェアしよう！\',
      time: \'15分前\',
      unread: 5,
      online: false,
      type: \'group\',
      members: 8
    },
    {
      id: 3,
      name: \'広島っ子\',
      lastMessage: \'ありがとうございました！\',
      time: \'1時間前\',
      unread: 0,
      online: false,
      type: \'dm\'
    },
    {
      id: 4,
      name: \'応援団メンバー\',
      lastMessage: \'次の応援歌の練習をしましょう\',
      time: \'3時間前\',
      unread: 1,
      online: true,
      type: \'group\',
      members: 15
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: \'赤ヘル太郎\',
      content: \'こんにちは！今日の試合見ましたか？\',
      time: \'14:30\',
      isOwn: false
    },
    {
      id: 2,
      sender: \'あなた\',
      content: \'はい！最後の逆転劇は本当に感動しました！\',
      time: \'14:32\',
      isOwn: true
    },
    {
      id: 3,
      sender: \'赤ヘル太郎\',
      content: \'本当にそうですね！来週の試合も楽しみです\',
      time: \'14:35\',
      isOwn: false
    },
    {
      id: 4,
      sender: \'赤ヘル太郎\',
      content: \'今度の試合、一緒に見に行きませんか？\',
      time: \'14:38\',
      isOwn: false
    }
  ]);

  const [newMessage, setNewMessage] = useState(\'\');
  const [searchTerm, setSearchTerm] = useState(\'\');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: \'あなた\',
        content: newMessage,
        time: new Date().toLocaleTimeString(\'ja-JP\', { hour: \'2-digit\', minute: \'2-digit\' }),
        isOwn: true
      };
      setMessages([...messages, message]);
      setNewMessage(\'\');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>メッセージ - カープコネクト</title>
      </Head>
      
      <Layout>
        <div className=\"h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow-sm border overflow-hidden\">
          {/* Conversations List */}
          <div className=\"w-1/3 border-r border-gray-200 flex flex-col\">
            {/* Header */}
            <div className=\"p-4 border-b border-gray-200\">
              <div className=\"flex items-center justify-between mb-4\">
                <h2 className=\"text-lg font-semibold text-gray-900\">メッセージ</h2>
                <button className=\"p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg\">
                  <Plus className=\"h-5 w-5\" />
                </button>
              </div>
              
              {/* Search */}
              <div className=\"relative\">
                <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400\" />
                <input
                  type=\"text\"
                  placeholder=\"会話を検索...\"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=\"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500\"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className=\"flex-1 overflow-y-auto\">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation.id === conversation.id ? \'bg-red-50 border-red-200\' : \'\'
                  }`}
                >
                  <div className=\"flex items-center space-x-3\">
                    <div className=\"relative\">
                      <div className=\"w-12 h-12 bg-red-100 rounded-full flex items-center justify-center\">
                        {conversation.type === \'group\' ? (
                          <Users className=\"h-6 w-6 text-red-600\" />
                        ) : (
                          <MessageSquare className=\"h-6 w-6 text-red-600\" />
                        )}
                      </div>
                      {conversation.online && conversation.type === \'dm\' && (
                        <Circle className=\"absolute -bottom-1 -right-1 h-4 w-4 text-green-500 fill-current\" />
                      )}
                    </div>
                    
                    <div className=\"flex-1 min-w-0\">
                      <div className=\"flex items-center justify-between\">
                        <h3 className=\"text-sm font-medium text-gray-900 truncate\">
                          {conversation.name}
                          {conversation.type === \'group\' && (
                            <span className=\"ml-1 text-xs text-gray-500\">
                              ({conversation.members}人)
                            </span>
                          )}
                        </h3>
                        <span className=\"text-xs text-gray-500\">{conversation.time}</span>
                      </div>
                      <div className=\"flex items-center justify-between\">
                        <p className=\"text-sm text-gray-600 truncate\">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className=\"inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-600 rounded-full\">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className=\"flex-1 flex flex-col\">
            {/* Chat Header */}
            <div className=\"p-4 border-b border-gray-200 bg-gray-50\">
              <div className=\"flex items-center justify-between\">
                <div className=\"flex items-center space-x-3\">
                  <div className=\"w-10 h-10 bg-red-100 rounded-full flex items-center justify-center\">
                    {selectedConversation.type === \'group\' ? (
                      <Users className=\"h-5 w-5 text-red-600\" />
                    ) : (
                      <MessageSquare className=\"h-5 w-5 text-red-600\" />
                    )}
                  </div>
                  <div>
                    <h3 className=\"font-medium text-gray-900\">
                      {selectedConversation.name}
                    </h3>
                    {selectedConversation.type === \'group\' ? (
                      <p className=\"text-sm text-gray-500\">
                        {selectedConversation.members}人のメンバー
                      </p>
                    ) : (
                      <p className=\"text-sm text-gray-500\">
                        {selectedConversation.online ? \'オンライン\' : \'最終ログイン: 1時間前\'}
                      </p>
                    )}
                  </div>
                </div>
                <button className=\"p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg\">
                  <MoreVertical className=\"h-5 w-5\" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className=\"flex-1 overflow-y-auto p-4 space-y-4\">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? \'justify-end\' : \'justify-start\'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${message.isOwn ? \'order-2\' : \'order-1\'}`}>
                    {!message.isOwn && (
                      <p className=\"text-xs text-gray-500 mb-1\">{message.sender}</p>
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? \'bg-red-600 text-white\'
                          : \'bg-gray-100 text-gray-900\'
                      }`}
                    >
                      <p className=\"text-sm\">{message.content}</p>
                    </div>
                    <p className=\"text-xs text-gray-500 mt-1\">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className=\"p-4 border-t border-gray-200\">
              <form onSubmit={handleSendMessage} className=\"flex space-x-3\">
                <input
                  type=\"text\"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder=\"メッセージを入力...\"
                  className=\"flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500\"
                />
                <button
                  type=\"submit\"
                  className=\"bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2\"
                >
                  <Send className=\"h-4 w-4\" />
                  <span>送信</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
