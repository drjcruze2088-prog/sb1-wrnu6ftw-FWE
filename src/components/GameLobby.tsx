import React, { useState } from 'react';
import { Play, Users, Copy, Check } from 'lucide-react';
import { GameRoom, Player } from '../types/game';

interface GameLobbyProps {
  room: GameRoom;
  currentPlayer: Player;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({
  room,
  currentPlayer,
  onStartGame,
  onLeaveRoom
}) => {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code');
    }
  };

  const isHost = room.players[0]?.id === currentPlayer.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎭 Find with Emojis
          </h1>
          <p className="text-gray-600">Room: {room.name}</p>
        </div>

        {/* Room Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Game Lobby</h2>
            <button
              onClick={copyRoomCode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="font-mono font-bold">{room.id}</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Players List */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users size={20} />
                Players ({room.players.length}/{room.maxPlayers})
              </h3>
              <div className="space-y-2">
                {room.players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.id === currentPlayer.id
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {index === 0 ? '👑' : '👤'}
                      </span>
                      <span className="font-medium">{player.name}</span>
                      {player.id === currentPlayer.id && (
                        <span className="text-sm text-blue-600">(You)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Score: {player.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Rules */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Game Rules</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🎯 Guess movies, songs, books, TV shows, and games from emoji clues</p>
                <p>⚡ First correct answer gets points</p>
                <p>🏆 Play {room.maxRounds} rounds</p>
                <p>💬 Use chat to discuss with other players</p>
                <p>🌟 Have fun and be creative!</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 pt-6 border-t">
            {isHost && (
              <button
                onClick={onStartGame}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Play size={20} />
                Start Game
              </button>
            )}
            <button
              onClick={onLeaveRoom}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              Leave Room
            </button>
          </div>

          {!isHost && (
            <p className="text-sm text-gray-500 mt-2">
              Waiting for the host to start the game...
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Share the room code with friends to invite them</li>
            <li>• Think outside the box - emoji clues can be creative!</li>
            <li>• Use the chat to collaborate or give hints</li>
            <li>• Different categories have different point values</li>
          </ul>
        </div>
      </div>
    </div>
  );
};