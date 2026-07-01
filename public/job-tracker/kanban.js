class KanbanBoard {
    constructor(appInstance) {
        this.app = appInstance;
    }

    init() {
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const dropZones = document.querySelectorAll('.drop-zone');

        dropZones.forEach(zone => {
            // Drag enter/over zone
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            // Drag leaves zone
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            // Drop card in zone
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const appId = e.dataTransfer.getData('text/plain');
                const column = zone.closest('.kanban-column');
                if (!column || !appId) return;

                const targetStatus = column.getAttribute('data-status');
                this.handleCardDrop(appId, targetStatus);
            });
        });
    }

    attachDraggableEvents(cardElement) {
        cardElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', cardElement.getAttribute('data-id'));
            e.dataTransfer.effectAllowed = 'move';
            
            // Delay adding class slightly to allow the drag shadow image to capture the full card opacity
            setTimeout(() => {
                cardElement.classList.add('dragging');
            }, 0);
        });

        cardElement.addEventListener('dragend', () => {
            cardElement.classList.remove('dragging');
        });
    }

    handleCardDrop(appId, newStatus) {
        // Notify the main app to update the status of this job record
        const updated = this.app.updateApplicationStatus(appId, newStatus);
        
        if (updated) {
            // Redraw Kanban Board and List panels, plus charts
            this.app.renderAll();
            
            // Visual feedback confetti if dropped to "Offer"!
            if (newStatus === 'Offer') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
                });
            }
        }
    }
}

// Attach class definition to window scope
window.KanbanBoard = KanbanBoard;
