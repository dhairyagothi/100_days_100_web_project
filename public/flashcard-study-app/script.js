// Get DOM elements
const flashcardForm = document.getElementById('flashcardForm');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const cardsContainer = document.getElementById('cardsContainer');
const emptyState = document.getElementById('emptyState');
const cardCountDisplay = document.getElementById('cardCount');

// Initialize flashcards array
let flashcards = [];

// Load flashcards from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFlashcards();
    displayFlashcards();
    updateCardCount();
});

// Load flashcards from localStorage
function loadFlashcards() {
    const storedCards = localStorage.getItem('flashcards');
    if (storedCards) {
        flashcards = JSON.parse(storedCards);
    }
}

// Save flashcards to localStorage
function saveFlashcards() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Update card count display
function updateCardCount() {
    cardCountDisplay.textContent = flashcards.length;
}

// Toggle empty state visibility
function toggleEmptyState() {
    if (flashcards.length === 0) {
        emptyState.style.display = 'block';
        cardsContainer.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        cardsContainer.style.display = 'grid';
    }
}

// Handle form submission
flashcardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    
    if (!question || !answer) {
        alert('Please fill in both question and answer');
        return;
    }
    
    // Create new flashcard object
    const newCard = {
        id: Date.now(),
        question: question,
        answer: answer,
        createdAt: new Date().toISOString()
    };
    
    // Add to flashcards array
    flashcards.unshift(newCard); // Add to beginning of array
    
    // Save to localStorage
    saveFlashcards();
    
    // Reset form
    flashcardForm.reset();
    
    // Update display
    displayFlashcards();
    updateCardCount();
    
    // Show success feedback
    showNotification('Flashcard added successfully!');
});

// Display all flashcards
function displayFlashcards() {
    cardsContainer.innerHTML = '';
    
    toggleEmptyState();
    
    flashcards.forEach(card => {
        const cardElement = createCardElement(card);
        cardsContainer.appendChild(cardElement);
    });
}

// Create a single flashcard element
function createCardElement(card) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';
    
    cardWrapper.innerHTML = `
        <div class="flashcard" data-id="${card.id}">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <div class="card-label">Question</div>
                    <div class="card-content">${escapeHtml(card.question)}</div>
                    <div class="flip-hint">Click to reveal answer</div>
                </div>
                <div class="flashcard-back">
                    <div class="card-label">Answer</div>
                    <div class="card-content">${escapeHtml(card.answer)}</div>
                    <div class="flip-hint">Click to see question</div>
                </div>
            </div>
            <button class="delete-btn" data-id="${card.id}" title="Delete card">
                <span>🗑️</span>
            </button>
        </div>
    `;
    
    // Add flip functionality
    const flashcard = cardWrapper.querySelector('.flashcard');
    flashcard.addEventListener('click', (e) => {
        // Don't flip if clicking delete button
        if (e.target.closest('.delete-btn')) {
            return;
        }
        flashcard.classList.toggle('flipped');
    });
    
    // Add delete functionality
    const deleteBtn = cardWrapper.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteFlashcard(card.id);
    });
    
    return cardWrapper;
}

// Delete a flashcard
function deleteFlashcard(id) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this flashcard?')) {
        return;
    }
    
    // Remove from array
    flashcards = flashcards.filter(card => card.id !== id);
    
    // Save to localStorage
    saveFlashcards();
    
    // Update display
    displayFlashcards();
    updateCardCount();
    
    // Show notification
    showNotification('Flashcard deleted successfully!');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form when focused on textarea
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement === questionInput || document.activeElement === answerInput) {
            flashcardForm.dispatchEvent(new Event('submit'));
        }
    }
});
