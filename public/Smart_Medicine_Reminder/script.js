document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const modalOverlay = document.getElementById('medicine-modal');
    const openModalBtn = document.getElementById('add-medicine-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const medicineForm = document.getElementById('medicine-form');
    const medicineList = document.getElementById('medicine-list');
    const emptyState = document.getElementById('empty-state');
    const healthNotes = document.getElementById('health-notes');
    const notesSaveStatus = document.getElementById('notes-save-status');
    const progressCircle = document.getElementById('progress-circle');
    const progressPercentage = document.getElementById('progress-percentage');
    const pendingCountText = document.getElementById('pending-count');

    // State
    let medicines = JSON.parse(localStorage.getItem('mediTrack_medicines')) || [];
    let notesTimeout;

    // --- Utilities ---
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // --- Theme Management ---
    const currentTheme = localStorage.getItem('mediTrack_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('mediTrack_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
    }

    // --- Modal Management ---
    openModalBtn.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Add Medicine';
        medicineForm.reset();
        document.getElementById('med-id').value = '';
        modalOverlay.classList.add('visible');
    });

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('visible');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('visible');
        }
    });

    // --- CRUD Operations ---
    medicineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('med-id').value;
        const name = document.getElementById('med-name').value.trim();
        const dosage = document.getElementById('med-dosage').value.trim();
        const time = document.getElementById('med-time').value;
        const notes = document.getElementById('med-notes').value.trim();

        if (id) {
            // Edit existing
            const index = medicines.findIndex(m => m.id === id);
            if (index !== -1) {
                medicines[index] = { ...medicines[index], name, dosage, time, notes };
            }
        } else {
            // Add new
            const newMed = {
                id: Date.now().toString(),
                name,
                dosage,
                time,
                notes,
                taken: false,
                lastUpdated: new Date().toDateString() // to reset 'taken' daily
            };
            medicines.push(newMed);
        }

        saveMedicines();
        renderMedicines();
        modalOverlay.classList.remove('visible');
    });

    function saveMedicines() {
        localStorage.setItem('mediTrack_medicines', JSON.stringify(medicines));
        updateDashboard();
    }

    // Reset "taken" status if it's a new day
    function checkDailyReset() {
        const today = new Date().toDateString();
        let updated = false;
        medicines.forEach(med => {
            if (med.lastUpdated !== today) {
                med.taken = false;
                med.lastUpdated = today;
                updated = true;
            }
        });
        if (updated) saveMedicines();
    }

    function renderMedicines() {
        checkDailyReset();
        medicineList.innerHTML = '';
        
        if (medicines.length === 0) {
            emptyState.classList.add('visible');
        } else {
            emptyState.classList.remove('visible');
            
            // Sort by time
            const sortedMeds = [...medicines].sort((a, b) => a.time.localeCompare(b.time));

            sortedMeds.forEach(med => {
                const li = document.createElement('li');
                li.className = `medicine-item ${med.taken ? 'taken' : ''}`;
                li.innerHTML = `
                    <div class="med-info">
                        <label class="checkbox-container">
                            <input type="checkbox" class="med-checkbox" data-id="${med.id}" ${med.taken ? 'checked' : ''}>
                            <span class="checkmark"></span>
                        </label>
                        <div class="med-details">
                            <h3>${escapeHTML(med.name)}</h3>
                            <p>
                                <i class="ph ph-clock"></i> ${formatTime(med.time)} &bull; 
                                <i class="ph ph-pill"></i> ${escapeHTML(med.dosage)}
                                ${med.notes ? `&bull; <i class="ph ph-info"></i> ${escapeHTML(med.notes)}` : ''}
                            </p>
                        </div>
                    </div>
                    <div class="med-actions">
                        <button class="edit-btn" data-id="${med.id}" aria-label="Edit"><i class="ph ph-pencil-simple"></i></button>
                        <button class="delete-btn" data-id="${med.id}" aria-label="Delete"><i class="ph ph-trash"></i></button>
                    </div>
                `;
                medicineList.appendChild(li);
            });
        }
        updateDashboard();
    }

    // Handle Clicks on List
    medicineList.addEventListener('click', (e) => {
        const target = e.target.closest('button') || e.target.closest('input');
        if (!target) return;

        const id = target.dataset.id;

        if (target.classList.contains('delete-btn')) {
            medicines = medicines.filter(m => m.id !== id);
            saveMedicines();
            renderMedicines();
        } else if (target.classList.contains('edit-btn')) {
            const med = medicines.find(m => m.id === id);
            if (med) {
                document.getElementById('modal-title').textContent = 'Edit Medicine';
                document.getElementById('med-id').value = med.id;
                document.getElementById('med-name').value = med.name;
                document.getElementById('med-dosage').value = med.dosage;
                document.getElementById('med-time').value = med.time;
                document.getElementById('med-notes').value = med.notes;
                modalOverlay.classList.add('visible');
            }
        } else if (target.classList.contains('med-checkbox')) {
            const med = medicines.find(m => m.id === id);
            if (med) {
                med.taken = target.checked;
                saveMedicines();
                renderMedicines(); // Re-render to strike through text
            }
        }
    });

    // --- Dashboard Progress ---
    function updateDashboard() {
        const total = medicines.length;
        const taken = medicines.filter(m => m.taken).length;
        const pending = total - taken;
        
        let percent = 0;
        if (total > 0) {
            percent = Math.round((taken / total) * 100);
        }

        // Update Ring
        const radius = progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;

        // Update Text
        progressPercentage.textContent = `${percent}%`;
        pendingCountText.textContent = pending;
    }

    // --- Health Notes ---
    healthNotes.value = localStorage.getItem('mediTrack_notes') || '';

    healthNotes.addEventListener('input', () => {
        clearTimeout(notesTimeout);
        notesTimeout = setTimeout(() => {
            localStorage.setItem('mediTrack_notes', healthNotes.value);
            notesSaveStatus.classList.add('visible');
            setTimeout(() => notesSaveStatus.classList.remove('visible'), 2000);
        }, 1000);
    });

    // Utilities
    function formatTime(timeStr) {
        const [hourString, minute] = timeStr.split(':');
        const hour = +hourString % 24;
        return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
    }

    // Init
    renderMedicines();
});
