// Virtual Study Companions & Chat Command Handlers
import { sendChatMessage, state, addFlashcard } from '../state.js';

const MOTIVATIONAL_QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Don't wish it were easier. Wish you were better. — Jim Rohn",
  "Focus is a muscle, and you are building it right now.",
  "Deep work yields deep rewards. Keep distractions at bay!",
  "Pain is temporary. Pride is forever.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Your focus determines your reality. — Qui-Gon Jinn"
];

const STRETCHES = [
  "🧘 **Focus stretch**: Roll your shoulders backward 5 times, then forward 5 times. Relieve that neck tension!",
  "🧘 **Focus stretch**: Stand up and reach your hands as high as possible. Hold for 15 seconds.",
  "🧘 **Focus stretch**: Turn your head slowly to the left, hold for 5s, then slowly to the right, hold for 5s.",
  "🧘 **Focus stretch**: Pull your fingers gently back to stretch your wrists and forearms from typing."
];

const BREATHING_TIPS = [
  "🎈 **Box Breathing Exercise**: Inhale for 4 seconds, Hold for 4 seconds, Exhale for 4 seconds, Hold for 4 seconds. Repeat twice.",
  "🎈 **4-7-8 Breathing**: Inhale quietly for 4 seconds, hold your breath for 7 seconds, exhale audibly for 8 seconds to calm your nervous system."
];

// Jaypee Brothers Medical Publications reference data
const JAYPEE_BOOKS = {
  'Sciences': [
    { title: "Basics of Medical Physiology", author: "D. Venkatesh, H.H. Sudhakar", edition: "3rd Edition", desc: "A highly acclaimed physiology manual mapped to clinical competencies for medical undergraduates." },
    { title: "Review of Pharmacology", author: "Gobind Rai Garg, Sparsh Gupta", edition: "15th Edition", desc: "The ultimate pharmacology textbook guide for PG entrance exams and clinical references." },
    { title: "Ghai Essential Pediatrics", author: "Vinod K. Paul, Arvind Bagga", edition: "10th Edition", desc: "The definitive reference textbook for pediatric care, clinical practice, and diagnostics." }
  ],
  'Computer Science': [
    { title: "Object-Oriented Programming with Java", author: "Jaypee Technical Board", edition: "2nd Edition", desc: "Core OOP constructs, threads, exception handling, and GUI development principles." },
    { title: "Database Systems & Engineering", author: "A. K. Sharma", edition: "1st Edition", desc: "Design schemas, normalizations, relational calculus, and query optimization methods." }
  ],
  'Mathematics': [
    { title: "Textbook of Engineering Mathematics", author: "N. P. Bali, Manish Goyal", edition: "9th Edition", desc: "Detailed math guides for vector calculus, complex variables, and differential equations." }
  ],
  'General': [
    { title: "Basics of Human Anatomy", author: "Jaypee Brothers Editorial Team", edition: "5th Edition", desc: "Comprehensive anatomical review textbook featuring detailed plates and dissection guides." }
  ]
};

// List of virtual companions that can spawn in study rooms
const COMPANIONS = [
  { username: 'Dr. Sarah (Intern)', avatar: '🦊', subject: 'Sciences' },
  { username: 'CoderMike', avatar: '🤖', subject: 'Computer Science' },
  { username: 'AnatomyEmma', avatar: '🦉', subject: 'Sciences' },
  { username: 'LinusDev', avatar: '🚀', subject: 'General' }
];

let companionInterval = null;

// Handle commands typed in the room chat
export function handleChatCommand(messageText) {
  const clean = messageText.trim().toLowerCase();
  
  if (clean === '/quote') {
    const randomIdx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    sendChatMessage(`💡 **Motivational Quote**: "${MOTIVATIONAL_QUOTES[randomIdx]}"`, 'bot-local');
    return true;
  }
  
  if (clean === '/stretch') {
    const randomIdx = Math.floor(Math.random() * STRETCHES.length);
    sendChatMessage(STRETCHES[randomIdx], 'bot-local');
    return true;
  }
  
  if (clean === '/breathe') {
    const randomIdx = Math.floor(Math.random() * BREATHING_TIPS.length);
    sendChatMessage(BREATHING_TIPS[randomIdx] || BREATHING_TIPS[0], 'bot-local');
    return true;
  }

  if (clean === '/books') {
    const category = state.activeRoom?.category || 'General';
    const books = JAYPEE_BOOKS[category] || JAYPEE_BOOKS['General'];
    
    let html = `<div class="jaypee-books-card">
      <h4>📚 Recommended Jaypee Publications for <strong>${category}</strong>:</h4>`;
      
    books.forEach(b => {
      html += `
        <div class="book-recommendation-item">
          <div class="book-recommendation-icon">📘</div>
          <div class="book-recommendation-details">
            <h5>${b.title}</h5>
            <span class="book-recommendation-author">By ${b.author} (${b.edition})</span>
            <p>${b.desc}</p>
            <a href="https://www.jaypeebrothers.com/" target="_blank" class="book-recommendation-btn">View on Jaypee Catalog</a>
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
    
    sendChatMessage(html, 'bot-local');
    return true;
  }

  return false;
}

// Start companion simulators when room is joined
export function startCompanionSimulator() {
  if (companionInterval) clearInterval(companionInterval);

  // Spawn companion bots on delay
  companionInterval = setInterval(() => {
    if (!state.activeRoom) return;

    // 25% chance of companion action every 30 seconds
    if (Math.random() > 0.25) return;

    // Select a companion fitting the room subject if possible
    const currentSubject = state.activeRoom.category;
    let pool = COMPANIONS;
    if (currentSubject && currentSubject !== 'General') {
      pool = COMPANIONS.filter(c => c.subject === currentSubject || c.subject === 'General');
    }
    const companion = pool[Math.floor(Math.random() * pool.length)];

    // Sync state to add companion to active members if not present
    if (!state.activeMembers.some(m => m.username === companion.username)) {
      state.activeMembers.push({
        username: companion.username,
        avatar: companion.avatar,
        lastSeen: Date.now()
      });
      state.activeMembers = [...state.activeMembers];
      
      const enterMessages = [
        `joined the study table to focus.`,
        `sat down with a hot cup of coffee.`,
        `opened their notebooks.`
      ];
      const enterMsg = enterMessages[Math.floor(Math.random() * enterMessages.length)];
      sendChatMessage(`${companion.username} ${enterMsg}`, 'system');
      return;
    }

    // Companion sends a study message or helps out
    const messages = [
      "Starting my next focus session now. Let's stay productive!",
      "Just completed a tough chapter. Time to review.",
      "Does anyone want to test each other with some flashcards?",
      "Checking off my task. Getting closer to my goal!",
      "Stretching my arms a bit. Remembers to take breaks, guys."
    ];
    
    // Customize for medical room
    if (currentSubject === 'Sciences' || currentSubject === 'General') {
      messages.push("Reading through the respiratory physiology slides. Fascinating stuff!");
      messages.push("Currently studying the anatomical structures of the cardiac valves. So much to memorize!");
    }

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    // Simulate chat message from companion
    const msg = {
      sender: companion.username,
      avatar: companion.avatar,
      text: randomMsg,
      timestamp: Date.now(),
      type: 'text'
    };

    const roomId = state.activeRoom.id;
    if (!state.chat[roomId]) state.chat[roomId] = [];
    state.chat[roomId].push(msg);
    state.chat = { ...state.chat };

  }, 30000);
}

// Stop companion simulation
export function stopCompanionSimulator() {
  if (companionInterval) {
    clearInterval(companionInterval);
    companionInterval = null;
  }
}
