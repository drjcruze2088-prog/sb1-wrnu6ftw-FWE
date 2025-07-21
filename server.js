const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static('dist'));

// Game state storage
const gameRooms = new Map();
const playerSockets = new Map();

// Puzzle data
const puzzles = [
  {
    id: '1',
    category: 'movie',
    emojis: '👑🦁',
    answer: 'The Lion King',
    difficulty: 'easy',
    hints: ['Disney classic', 'Set in Africa', 'Hakuna Matata']
  },
  {
    id: '2',
    category: 'movie',
    emojis: '🐠🔍',
    answer: 'Finding Nemo',
    difficulty: 'easy',
    hints: ['Pixar animation', 'Ocean adventure', 'Father and son']
  },
  {
    id: '3',
    category: 'movie',
    emojis: '🕷️👨‍🎓',
    answer: 'Spider-Man',
    difficulty: 'easy',
    hints: ['Marvel superhero', 'Web slinger', 'New York City']
  },
  {
    id: '4',
    category: 'movie',
    emojis: '🌟⚔️🚀',
    answer: 'Star Wars',
    difficulty: 'medium',
    hints: ['Space saga', 'The Force', 'Luke Skywalker']
  },
  {
    id: '5',
    category: 'movie',
    emojis: '💍🗻🧙‍♂️',
    answer: 'The Lord of the Rings',
    difficulty: 'medium',
    hints: ['Fantasy epic', 'Middle-earth', 'Frodo']
  },
  {
    id: '6',
    category: 'song',
    emojis: '💃🕺🌙',
    answer: 'Dancing in the Moonlight',
    difficulty: 'easy',
    hints: ['Classic feel-good song', 'Night time', 'King Harvest']
  },
  {
    id: '7',
    category: 'song',
    emojis: '🌈🌧️☀️',
    answer: 'Somewhere Over the Rainbow',
    difficulty: 'easy',
    hints: ['Wizard of Oz', 'Judy Garland', 'Hope and dreams']
  },
  {
    id: '8',
    category: 'tv',
    emojis: '☕🏠👥💬',
    answer: 'Friends',
    difficulty: 'easy',
    hints: ['New York City', 'Central Perk', 'Six friends']
  },
  {
    id: '9',
    category: 'tv',
    emojis: '🔥🐉👑⚔️',
    answer: 'Game of Thrones',
    difficulty: 'medium',
    hints: ['HBO series', 'Westeros', 'Iron Throne']
  },
  {
    id: '10',
    category: 'book',
    emojis: '⚡👓🏰',
    answer: 'Harry Potter',
    difficulty: 'easy',
    hints: ['Wizarding world', 'Hogwarts', 'J.K. Rowling']
  }
];

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getRandomPuzzle() {
  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', ({ roomName, playerName }) => {
    const roomId = generateRoomCode();
    const player = {
      id: socket.id,
      name: playerName,
      score: 0,
      isReady: false
    };

    const room = {
      id: roomId,
      name: roomName,
      players: [player],
      currentPuzzle: null,
      maxPlayers: 15,
      isActive: false,
      round: 1,
      maxRounds: 10,
      messages: []
    };

    gameRooms.set(roomId, room);
    playerSockets.set(socket.id, { roomId, playerId: socket.id });
    
    socket.join(roomId);
    socket.emit('room-created', { roomId, room, playerId: socket.id });
    
    console.log(`Room ${roomId} created by ${playerName}`);
  });

  socket.on('join-room', ({ roomId, playerName }) => {
    const room = gameRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.players.length >= room.maxPlayers) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    if (room.players.some(p => p.id === socket.id)) {
      socket.emit('error', { message: 'Already in room' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      score: 0,
      isReady: false
    };

    room.players.push(player);
    playerSockets.set(socket.id, { roomId, playerId: socket.id });
    
    socket.join(roomId);
    
    // Notify all players in the room
    io.to(roomId).emit('player-joined', { room, playerId: socket.id });
    
    console.log(`${playerName} joined room ${roomId}`);
  });

  socket.on('start-game', () => {
    const playerData = playerSockets.get(socket.id);
    if (!playerData) return;

    const room = gameRooms.get(playerData.roomId);
    if (!room) return;

    // Check if player is the host (first player)
    if (room.players[0].id !== socket.id) return;

    room.isActive = true;
    room.currentPuzzle = getRandomPuzzle();
    room.round = 1;

    io.to(playerData.roomId).emit('game-started', { room });
    
    console.log(`Game started in room ${playerData.roomId}`);
  });

  socket.on('submit-guess', ({ guess }) => {
    const playerData = playerSockets.get(socket.id);
    if (!playerData) return;

    const room = gameRooms.get(playerData.roomId);
    if (!room || !room.currentPuzzle) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const isCorrect = guess.toLowerCase().trim() === 
      room.currentPuzzle.answer.toLowerCase().trim();

    // Add guess message
    const guessMessage = {
      id: Date.now().toString(),
      playerId: socket.id,
      playerName: player.name,
      message: guess,
      timestamp: Date.now(),
      type: 'guess'
    };

    room.messages.push(guessMessage);
    io.to(playerData.roomId).emit('new-message', guessMessage);

    if (isCorrect) {
      // Award points
      player.score += 100;

      // Add success message
      const successMessage = {
        id: (Date.now() + 1).toString(),
        playerId: 'system',
        playerName: 'Game',
        message: `🎉 ${player.name} got it right! The answer was "${room.currentPuzzle.answer}"`,
        timestamp: Date.now(),
        type: 'system'
      };

      room.messages.push(successMessage);
      io.to(playerData.roomId).emit('new-message', successMessage);
      io.to(playerData.roomId).emit('correct-guess', { 
        playerId: socket.id, 
        playerName: player.name,
        answer: room.currentPuzzle.answer,
        room 
      });

      // Move to next puzzle after delay
      setTimeout(() => {
        if (room.round < room.maxRounds) {
          room.round++;
          room.currentPuzzle = getRandomPuzzle();
          io.to(playerData.roomId).emit('next-puzzle', { room });
        } else {
          // Game over
          room.isActive = false;
          const winner = room.players.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current
          );
          io.to(playerData.roomId).emit('game-over', { room, winner });
        }
      }, 3000);
    }
  });

  socket.on('send-message', ({ message }) => {
    const playerData = playerSockets.get(socket.id);
    if (!playerData) return;

    const room = gameRooms.get(playerData.roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const chatMessage = {
      id: Date.now().toString(),
      playerId: socket.id,
      playerName: player.name,
      message: message,
      timestamp: Date.now(),
      type: 'chat'
    };

    room.messages.push(chatMessage);
    io.to(playerData.roomId).emit('new-message', chatMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const playerData = playerSockets.get(socket.id);
    if (playerData) {
      const room = gameRooms.get(playerData.roomId);
      if (room) {
        // Remove player from room
        room.players = room.players.filter(p => p.id !== socket.id);
        
        if (room.players.length === 0) {
          // Delete empty room
          gameRooms.delete(playerData.roomId);
        } else {
          // Notify remaining players
          io.to(playerData.roomId).emit('player-left', { room, leftPlayerId: socket.id });
        }
      }
      playerSockets.delete(socket.id);
    }
  });
});

// Serve the React app for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});