import React, { useState } from 'react';
import { Users, Plus, ArrowRight, Gamepad2, Star, Zap } from 'lucide-react';

interface HomePageProps {
  onCreateRoom: (roomName: string, playerName: string) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
  error: string | null;
  onClearError: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCreateRoom, onJoinRoom, error, onClearError }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join' | null>(null);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !roomName.trim()) return;
    onClearError();
    onCreateRoom(roomName, playerName);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !roomCode.trim()) return;
    onClearError();
    onJoinRoom(roomCode.toUpperCase(), playerName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-400 mr-3">⚠️</div>
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
                <button
                  onClick={onClearError}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <div className="text-8xl mb-6">🎭✨</div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Find with Emojis
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join friends in the ultimate emoji guessing game! Decode movies, songs, books, and more from creative emoji clues.
          </p>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="font-semibold text-gray-800 mb-2">Multiple Categories</h3>
              <p className="text-sm text-gray-600">Movies, songs, TV shows, books, and games</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-800 mb-2">Multiplayer Fun</h3>
              <p className="text-sm text-gray-600">Play with up to 15 friends in real-time</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Instant Play</h3>
              <p className="text-sm text-gray-600">No signup required - just join and play!</p>
            </div>
          </div>
        </div>

        {/* Game Modes */}
        {!mode && (
          <div className="max-w-md mx-auto space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-200 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Plus size={24} className="text-blue-600" />
              Create New Room
            </button>
            
            <button
              onClick={() => setMode('join')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Users size={24} />
              Join Existing Room
            </button>
          </div>
        )}

        {/* Create Room Form */}
        {mode === 'create' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Create New Room
              </h2>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Gamepad2 size={20} />
                  Create Room
                </button>
              </form>
              <button
                onClick={() => setMode(null)}
                className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to options
              </button>
            </div>
          </div>
        )}

        {/* Join Room Form */}
        {mode === 'join' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Join Room
              </h2>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-character code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    maxLength={6}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight size={20} />
                  Join Room
                </button>
              </form>
              <button
                onClick={() => setMode(null)}
                className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to options
              </button>
            </div>
          </div>
        )}

        {/* How to Play */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">How to Play</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">Create or Join</h3>
              <p className="text-sm text-gray-600">Start a new room or join friends with a room code</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Decode Emojis</h3>
              <p className="text-sm text-gray-600">Look at emoji clues and guess the answer</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Race to Answer</h3>
              <p className="text-sm text-gray-600">First correct guess wins points for that round</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold mb-2">Win the Game</h3>
              <p className="text-sm text-gray-600">Player with the most points after all rounds wins!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};