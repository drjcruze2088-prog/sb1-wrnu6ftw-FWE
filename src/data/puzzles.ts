import { Puzzle } from '../types/game';

export const puzzles: Puzzle[] = [
  // Movies - Easy
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
  
  // Movies - Medium
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
    category: 'movie',
    emojis: '🦖🏝️⚡',
    answer: 'Jurassic Park',
    difficulty: 'medium',
    hints: ['Steven Spielberg', 'Dinosaurs', 'Theme park gone wrong']
  },
  
  // Songs - Easy
  {
    id: '7',
    category: 'song',
    emojis: '💃🕺🌙',
    answer: 'Dancing in the Moonlight',
    difficulty: 'easy',
    hints: ['Classic feel-good song', 'Night time', 'King Harvest']
  },
  {
    id: '8',
    category: 'song',
    emojis: '🌈🌧️☀️',
    answer: 'Somewhere Over the Rainbow',
    difficulty: 'easy',
    hints: ['Wizard of Oz', 'Judy Garland', 'Hope and dreams']
  },
  
  // TV Shows
  {
    id: '9',
    category: 'tv',
    emojis: '☕🏠👥💬',
    answer: 'Friends',
    difficulty: 'easy',
    hints: ['New York City', 'Central Perk', 'Six friends']
  },
  {
    id: '10',
    category: 'tv',
    emojis: '🔥🐉👑⚔️',
    answer: 'Game of Thrones',
    difficulty: 'medium',
    hints: ['HBO series', 'Westeros', 'Iron Throne']
  },
  
  // Books
  {
    id: '11',
    category: 'book',
    emojis: '⚡👓🏰',
    answer: 'Harry Potter',
    difficulty: 'easy',
    hints: ['Wizarding world', 'Hogwarts', 'J.K. Rowling']
  },
  {
    id: '12',
    category: 'book',
    emojis: '🐰⏰🎩',
    answer: 'Alice in Wonderland',
    difficulty: 'medium',
    hints: ['Lewis Carroll', 'Cheshire Cat', 'Mad Hatter']
  },
  
  // Games
  {
    id: '13',
    category: 'game',
    emojis: '🍄👨‍🔧🏰',
    answer: 'Super Mario',
    difficulty: 'easy',
    hints: ['Nintendo', 'Princess Peach', 'Mushroom Kingdom']
  },
  {
    id: '14',
    category: 'game',
    emojis: '⚔️🛡️🐉',
    answer: 'Skyrim',
    difficulty: 'medium',
    hints: ['Elder Scrolls', 'Dragonborn', 'Fantasy RPG']
  }
];

export const getCategoryIcon = (category: Puzzle['category']): string => {
  const icons = {
    movie: '🎬',
    song: '🎵',
    book: '📚',
    tv: '📺',
    game: '🎮'
  };
  return icons[category];
};

export const getDifficultyColor = (difficulty: Puzzle['difficulty']): string => {
  const colors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100'
  };
  return colors[difficulty];
};