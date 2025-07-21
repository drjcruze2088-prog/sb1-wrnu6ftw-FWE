import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Trophy, Clock, Lightbulb } from 'lucide-react';
import { GameRoom, Player, GameMessage } from '../types/game';
import { getCategoryIcon, getDifficultyColor } from '../data/puzzles';

interface GamePlayProps {
  room: GameRoom;
  currentPlayer: Player;
  messages: GameMessage[];
  onSubmitGuess: (guess: string) => boolean;
  onSendMessage: (message: string) => void;
  onLeaveRoom: () => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  room,
  currentPlayer,
  messages,
  onSubmitGuess,
  onSendMessage,
  onLeaveRoom
}) => {
  const [guess, setGuess] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;

    const isCorrect = onSubmitGuess(guess);
    setGuess('');
    
    if (isCorrect) {
      setShowHint(false);
      setHintIndex(0);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    onSendMessage(chatMessage);
    setChatMessage('');
  };

  const handleHint = () => {
    if (!room.currentPuzzle || !room.currentPuzzle.hints.length) return;
    
    setShowHint(true);
    if (hintIndex < room.currentPuzzle.hints.length - 1) {
      setHintIndex(prev => prev + 1);
    }
  };

  if (!room.currentPuzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🎮</div>
          <p className="text-xl text-gray-600">Loading next puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🎭 Find with Emojis</h1>
            <p className="text-gray-600">Room: {room.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Round</p>
              <p className="text-xl font-bold">{room.round}/{room.maxRounds}</p>
            </div>
            <button
              onClick={onLeaveRoom}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              Leave
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Puzzle Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(room.currentPuzzle.difficulty)}`}>
                  {getCategoryIcon(room.currentPuzzle.category)} {room.currentPuzzle.category.toUpperCase()} - {room.currentPuzzle.difficulty.toUpperCase()}
                </span>
              </div>
              
              <div className="text-8xl mb-6 leading-none">
                {room.currentPuzzle.emojis}
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                What {room.currentPuzzle.category} is this?
              </h2>

              {showHint && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-yellow-600" size={20} />
                    <span className="font-semibold text-yellow-800">Hint {hintIndex + 1}:</span>
                  </div>
                  <p className="text-yellow-700">{room.currentPuzzle.hints[hintIndex]}</p>
                </div>
              )}

              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleHint}
                  disabled={!room.currentPuzzle.hints.length || hintIndex >= room.currentPuzzle.hints.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 disabled:bg-gray-100 disabled:text-gray-400 text-yellow-700 rounded-lg transition-colors"
                >
                  <Lightbulb size={16} />
                  {showHint ? 'Next Hint' : 'Get Hint'}
                </button>
              </div>
            </div>

            {/* Guess Form */}
            <form onSubmit={handleGuessSubmit} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter your guess..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Guess
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Leaderboard
              </h3>
              <div className="space-y-2">
                {room.players
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        player.id === currentPlayer.id ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤'}
                        </span>
                        <span className={`${player.id === currentPlayer.id ? 'font-bold' : ''}`}>
                          {player.name}
                        </span>
                      </div>
                      <span className="font-semibold">{player.score}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-80 flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle size={20} />
                Chat
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-2 rounded-lg text-sm ${
                      message.type === 'system'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : message.type === 'guess'
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    {message.type !== 'system' && (
                      <span className="font-semibold">{message.playerName}: </span>
                    )}
                    <span>{message.message}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};