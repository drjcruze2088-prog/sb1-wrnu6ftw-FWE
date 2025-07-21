import React from 'react';
import { useGameState } from './hooks/useGameState';
import { HomePage } from './components/HomePage';
import { GameLobby } from './components/GameLobby';
import { GamePlay } from './components/GamePlay';

function App() {
  const {
    gameState,
    error,
    createRoom,
    joinRoom,
    startGame,
    submitGuess,
    sendMessage,
    leaveRoom,
    clearError
  } = useGameState();

  const handleCreateRoom = (roomName: string, playerName: string) => {
    createRoom(roomName, playerName);
  };

  const handleJoinRoom = (roomCode: string, playerName: string) => {
    joinRoom(roomCode, playerName);
  };

  // Home Page - No room joined
  if (!gameState.currentRoom || !gameState.currentPlayer) {
    return (
      <HomePage
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        error={error}
        onClearError={clearError}
      />
    );
  }

  // Game Lobby - Room joined but game not started
  if (!gameState.currentRoom.isActive) {
    return (
      <GameLobby
        room={gameState.currentRoom}
        currentPlayer={gameState.currentPlayer}
        onStartGame={startGame}
        onLeaveRoom={leaveRoom}
      />
    );
  }

  // Game Play - Game is active
  return (
    <GamePlay
      room={gameState.currentRoom}
      currentPlayer={gameState.currentPlayer}
      messages={gameState.messages}
      onSubmitGuess={submitGuess}
      onSendMessage={sendMessage}
      onLeaveRoom={leaveRoom}
    />
  );
}

export default App;