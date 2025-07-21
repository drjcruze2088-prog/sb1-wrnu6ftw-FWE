import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GameRoom, Player, Puzzle, GameMessage } from '../types/game';
import { io, Socket } from 'socket.io-client';

const initialState: GameState = {
  currentRoom: null,
  currentPlayer: null,
  availableRooms: [],
  messages: [],
  isConnected: false
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      setGameState(prev => ({ ...prev, isConnected: true }));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setGameState(prev => ({ ...prev, isConnected: false }));
    });

    socket.on('room-created', ({ roomId, room, playerId }) => {
      const currentPlayer = room.players.find((p: Player) => p.id === playerId);
      setGameState(prev => ({
        ...prev,
        currentRoom: room,
        currentPlayer: currentPlayer || null,
        messages: []
      }));
      setError(null);
    });

    socket.on('player-joined', ({ room, playerId }) => {
      setGameState(prev => ({
        ...prev,
        currentRoom: room,
        currentPlayer: prev.currentPlayer || room.players.find((p: Player) => p.id === socket.id) || null
      }));
    });

    socket.on('player-left', ({ room, leftPlayerId }) => {
      setGameState(prev => ({
        ...prev,
        currentRoom: room
      }));
    });

    socket.on('game-started', ({ room }) => {
      setGameState(prev => ({
        ...prev,
        currentRoom: room,
        messages: []
      }));
    });

    socket.on('new-message', (message) => {
      setGameState(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
    });

    socket.on('correct-guess', ({ room }) => {
      setGameState(prev => ({
        ...prev,
        currentRoom: room,
        currentPlayer: prev.currentPlayer ? 
          room.players.find((p: Player) => p.id === prev.currentPlayer!.id) || prev.currentPlayer 
          : null
      }));
    });

    socket.on('next-puzzle', ({ room }) => {
      setGameState(prev => ({
        ...prev,
        currentRoom: room
      }));
    });

    socket.on('game-over', ({ room, winner }) => {
      setGameState(prev => ({
        ...prev,
        currentRoom: room
      }));
      
      // Add game over message
      const gameOverMessage: GameMessage = {
        id: Date.now().toString(),
        playerId: 'system',
        playerName: 'Game',
        message: `🏆 Game Over! ${winner.name} wins with ${winner.score} points!`,
        timestamp: Date.now(),
        type: 'system'
      };
      
      setGameState(prev => ({
        ...prev,
        messages: [...prev.messages, gameOverMessage]
      }));
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = useCallback((roomName: string, playerName: string) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('create-room', { roomName, playerName });
  }, []);

  const joinRoom = useCallback((roomId: string, playerName: string) => {
    if (!socketRef.current) return false;
    
    socketRef.current.emit('join-room', { roomId, playerName });
    return true;
  }, []);

  const startGame = useCallback(() => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('start-game');
  }, []);

  const submitGuess = useCallback((guess: string) => {
    if (!socketRef.current || !gameState.currentRoom?.currentPuzzle) return false;
    
    socketRef.current.emit('submit-guess', { guess });
    return true; // We'll get the result via socket events
  }, [gameState.currentRoom]);

  const sendMessage = useCallback((messageText: string) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('send-message', { message: messageText });
  }, []);

  const leaveRoom = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = io(window.location.origin);
      
      // Re-setup event listeners
      const socket = socketRef.current;
      
      socket.on('connect', () => {
        setGameState(prev => ({ ...prev, isConnected: true }));
      });
      
      socket.on('disconnect', () => {
        setGameState(prev => ({ ...prev, isConnected: false }));
      });
    }
    
    setGameState(initialState);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    gameState,
    error,
    createRoom,
    joinRoom,
    startGame,
    submitGuess,
    sendMessage,
    leaveRoom,
    clearError
  };
};