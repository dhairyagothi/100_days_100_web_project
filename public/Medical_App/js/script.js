document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const requestForm = document.getElementById('requestForm');
    const responseForm = document.getElementById('responseForm');

    const specialistSearch = document.getElementById('specialistSearch');
    const specialistTypeSelect = document.getElementById('specialistType');

    const statusMessage = document.getElementById('statusMessage');
    const progressStepper = document.getElementById('progressStepper');
    const specialistResponseSection = document.getElementById('specialist-response');

    const historyList = document.getElementById('historyList');
    const emptyHistoryState = document.getElementById('emptyHistoryState');
    const toastContainer = document.getElementById('toast-container');

    const toggleAdvancedBtn = document.getElementById('toggleAdvancedBtn');
    const advancedFields = document.getElementById('advancedFields');
    const resetRequestBtn = document.getElementById('resetRequestBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    const medicalFiles = document.getElementById('medicalFiles');
    const fileList = document.getElementById('fileList');

    const specialistCategories = [
        {
            category: "Cardiology & Vascular",
            specialists: ['Cardiologist', 'Cardiothoracic Surgeon', 'Vascular Surgeon']
        },
        {
            category: "Neurology & Head",
            specialists: ['Neurologist', 'Neurosurgeon', 'Psychiatrist', 'Ophthalmologist', 'Otolaryngologist (ENT)']
        },
        {
            category: "Internal Medicine",
            specialists: ['Internal Medicine Physician', 'Endocrinologist', 'Gastroenterologist', 'Pulmonologist', 'Nephrologist', 'Rheumatologist', 'Hematologist', 'Oncologist', 'Allergist/Immunologist']
        },
        {
            category: "General & Family",
            specialists: ['General Practitioner (GP)', 'Family Medicine Physician', 'Pediatrician', 'General Surgeon']
        },
        {
            category: "Other Specialties",
            specialists: ['Dermatologist', 'Orthopedic Surgeon', 'Plastic Surgeon', 'Urologist', 'Anesthesiologist']
        }
    ];

    const statuses = ['Available 🟢', 'Busy 🟡', 'Offline 🔴'];

    let consultationHistory = JSON.parse(localStorage.getItem('medConsultHistoryV2')) || [];

    init();

    function init() {
        const savedTheme = localStorage.getItem('medConsultTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="ph ph-sun"></i>';
        }

        updateSpecialistOptions('');
        renderHistory();
        setupEventListeners();
    }

    function setupEventListeners() {
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');

                localStorage.setItem('medConsultTheme', isDark ? 'dark' : 'light');
                themeToggleBtn.innerHTML = isDark
                    ? '<i class="ph ph-sun"></i>'
                    : '<i class="ph ph-moon"></i>';
            });
        }

        if (specialistSearch) {
            specialistSearch.addEventListener('input', (e) => {
                updateSpecialistOptions(e.target.value);
            });
        }

        if (toggleAdvancedBtn) {
            toggleAdvancedBtn.addEventListener('click', () => {
                advancedFields.classList.toggle('hidden');

                const icon = advancedFields.classList.contains('hidden')
                    ? 'ph-caret-down'
                    : 'ph-caret-up';

                const text = advancedFields.classList.contains('hidden')
                    ? 'Show Advanced Details'
                    : 'Hide Advanced Details';

                toggleAdvancedBtn.innerHTML = `<i class="ph ${icon}"></i> ${text}`;
            });
        }

        if (medicalFiles) {
            medicalFiles.addEventListener('change', handleFileSelection);
        }

        if (resetRequestBtn) {
            resetRequestBtn.addEventListener('click', () => {
                requestForm.reset();
                if (fileList) fileList.innerHTML = '';
                showToast('Form cleared', 'success');
            });
        }

        if (requestForm) {
            requestForm.addEventListener('submit', handleRequestSubmit);
        }
        if (responseForm) {
            responseForm.addEventListener('submit', handleResponseSubmit);
        }
    }

    function handleFileSelection(e) {
        if (!fileList) return;
        fileList.innerHTML = '';

        Array.from(e.target.files).forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = `
                <i class="ph ph-file"></i>
                ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
            `;
            fileList.appendChild(item);
        });
    }

    function updateSpecialistOptions(searchText) {
        if (!specialistTypeSelect) return;
        specialistTypeSelect.innerHTML =
            '<option value="">Select a Specialist...</option>';

        let foundAny = false;

        specialistCategories.forEach(group => {
            const filtered = group.specialists.filter(s =>
                s.toLowerCase().includes(searchText.toLowerCase())
            );

            if (filtered.length > 0) {
                foundAny = true;

                const optGroup = document.createElement('optgroup');
                optGroup.label = group.category;

                filtered.forEach(specialist => {
                    const statusIndex = specialist.length % 3;
                    const statusText = statuses[statusIndex];

                    const option = document.createElement('option');
                    option.value = specialist;
                    option.textContent = `${specialist} - ${statusText}`;

                    optGroup.appendChild(option);
                });

                specialistTypeSelect.appendChild(optGroup);
            }
        });

        if (!foundAny) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No specialists found...';
            specialistTypeSelect.appendChild(option);
        }
    }

    function handleRequestSubmit(e) {
        e.preventDefault();

        const patientName = document.getElementById('patientName').value.trim();
        const doctorName = document.getElementById('doctorName').value.trim();
        const condition = document.getElementById('patientCondition').value.trim();
        const specialist = specialistTypeSelect.value;

        if (!patientName || !doctorName || !condition || !specialist) {
            showToast('Please fill out all required core fields.', 'error');
            return;
        }

        const age = document.getElementById('patientAge').value;
        const gender = document.getElementById('patientGender').value;
        const contact = document.getElementById('contactInfo').value.trim();
        const priority = document.getElementById('priorityLevel').value;
        const apptDate = document.getElementById('appointmentDate').value;
        const fileCount = medicalFiles ? medicalFiles.files.length : 0;

        const newConsultation = {
            id: 'CONS-' + Math.floor(Math.random() * 10000),
            date: new Date().toLocaleString(),
            patientName,
            doctorName,
            condition,
            specialist,
            age,
            gender,
            contact,
            priority,
            apptDate: apptDate ? new Date(apptDate).toLocaleString() : 'Pending',
            files: fileCount,
            status: 'Pending'
        };

        const submitBtn = document.getElementById('submitRequestBtn');
        submitBtn.disabled = true;

        statusMessage.style.display = 'none';
        progressStepper.classList.remove('hidden');

        document.querySelectorAll('.step').forEach(s => {
            s.classList.remove('active', 'completed');
        });

        document.getElementById('step1').classList.add('active');

        setTimeout(() => {
            document.getElementById('step1').classList.replace('active', 'completed');
            document.getElementById('step2').classList.add('active');
            document.getElementById('assignedSpecialistName').textContent =
                specialist.split(' - ')[0];
        }, 1000);

        setTimeout(() => {
            document.getElementById('step2').classList.replace('active', 'completed');
            document.getElementById('step3').classList.add('active');
        }, 2000);

        setTimeout(() => {
            document.getElementById('step3').classList.replace('active', 'completed');

            submitBtn.disabled = false;

            consultationHistory.unshift(newConsultation);
            saveHistory();
            renderHistory();

            showToast('Consultation request completed successfully!', 'success');

            if (specialistResponseSection) {
                specialistResponseSection.style.display = 'block';
                document.getElementById('consultationId').value = newConsultation.id;
            }

            requestForm.reset();
            if (fileList) fileList.innerHTML = '';
            updateSpecialistOptions('');
        }, 3000);
    }

    function handleResponseSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('consultationId').value.trim();
        const suggestion = document.getElementById('suggestion').value.trim();

        if (!id || !suggestion) {
            showToast('Please provide both Consultation ID and a Suggestion.', 'error');
            return;
        }

        const index = consultationHistory.findIndex(c => c.id === id);

        if (index !== -1) {
            consultationHistory[index].status = 'Reviewed';
            consultationHistory[index].notes = suggestion;

            saveHistory();
            renderHistory();

            showToast('Suggestion added successfully!', 'success');

            responseForm.reset();
            if (specialistResponseSection) specialistResponseSection.style.display = 'none';
        } else {
            showToast('Consultation ID not found.', 'error');
        }
    }

    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';

        if (consultationHistory.length === 0) {
            if (emptyHistoryState) emptyHistoryState.style.display = 'flex';
            return;
        }

        if (emptyHistoryState) emptyHistoryState.style.display = 'none';

        consultationHistory.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';

            const badgeClass = item.status === 'Pending' ? 'pending' : 'success';
            const priorityClass = item.priority
                ? `priority-${item.priority.toLowerCase()}`
                : 'priority-normal';

            let advancedMeta = '';

            if (item.age || item.gender) {
                advancedMeta += `${item.age ? item.age + ' yrs' : ''} ${item.gender || ''} • `;
            }

            li.innerHTML = `
                <div class="history-meta">
                    <span><i class="ph ph-calendar-blank"></i> ${item.date}</span>
                    <div>
                        ${item.priority ? `<span class="badge ${priorityClass}">${item.priority}</span>` : ''}
                        <span class="badge ${badgeClass}">${item.status}</span>
                    </div>
                </div>

                <div class="history-title">
                    Patient: ${item.patientName}
                    ${advancedMeta
                        ? `<span style="font-weight:400;color:var(--clr-text-muted);font-size:0.8rem">(${advancedMeta.slice(0, -3)})</span>`
                        : ''}
                </div>

                <div class="history-details">
                    <strong>Doctor:</strong> ${item.doctorName}<br>
                    <strong>Specialist:</strong> ${item.specialist.split(' - ')[0]}<br>
                    <strong>Condition:</strong> ${item.condition}<br>
                    <strong>Appt Date:</strong> ${item.apptDate}
                    ${item.files > 0
                        ? `<br><span style="color:var(--clr-text-muted);"><i class="ph ph-paperclip"></i> ${item.files} file(s) attached</span>`
                        : ''}
                    ${item.notes
                        ? `<br><strong style="color:var(--clr-primary);">Suggestion:</strong> ${item.notes}`
                        : ''}
                </div>

                <div class="history-actions">
                    <a href="reschedule.html?id=${item.id}" class="btn btn-primary" style="padding:0.5rem 1rem;font-size:0.875rem;text-decoration:none;width:auto;">
                        <i class="ph ph-calendar-plus"></i> Reschedule
                    </a>

                    <button class="btn btn-danger-outline" onclick="cancelConsultation(${index})">
                        <i class="ph ph-trash"></i> Cancel
                    </button>
                </div>
            `;

            historyList.appendChild(li);
        });
    }

    window.cancelConsultation = function(index) {
        if (confirm('Are you sure you want to cancel this consultation request?')) {
            consultationHistory.splice(index, 1);
            saveHistory();
            renderHistory();
            showToast('Consultation cancelled.', 'success');
        }
    };

    function saveHistory() {
        localStorage.setItem(
            'medConsultHistoryV2',
            JSON.stringify(consultationHistory)
        );
    }

    function showToast(message, type = 'success') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon =
            type === 'success'
                ? 'ph-check-circle'
                : 'ph-warning-circle';

        toast.innerHTML = `
            <i class="ph ${icon}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation =
                'slideOut 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Doctor search functionality
    const doctorSearch = document.getElementById("doctorSearch");
    if (doctorSearch) {
        doctorSearch.addEventListener("input", () => {
            const value = doctorSearch.value.toLowerCase();
            document.querySelectorAll(".doctor-card").forEach(card => {
                const name = card.innerText.toLowerCase();
                card.style.display = name.includes(value) ? "" : "none";
            });
        });
    }
});

// FAQ Accordion Toggle functionality
document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
        const item = question.parentElement;
        const isActive = item.classList.toggle("active");
        
        // Update accessibility attribute dynamically
        question.setAttribute("aria-expanded", isActive);
    });
});
