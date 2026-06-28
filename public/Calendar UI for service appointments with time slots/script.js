const SERVICE_DURATIONS = {
  checkup: 30,
  consultation: 45,
  procedure: 60,
  followup: 20,
  vaccination: 15,
  labwork: 30,
};

const BUSINESS_HOURS = {
  start: 8,
  end: 20,
  interval: 30,
};

const bookedAppointments = new Set();

class Calendar {
  constructor() {
    window.calendarInstance = this;
    this.currentDate = new Date();
    this.selectedDate = null;
    this.selectedTime = null;
    this.selectedService = null;
    this.lastConfirmed = null;
    this.appointments = [];
    this.reschedulingId = null;

    this.initializeElements();
    this.attachEventListeners();
    this.loadAppointments();
    this.renderCalendar();
    this.renderAppointments();
    this.animateInitialLoad();
    this.initializeHoverEffects();
  }

  initializeElements() {
    this.calendarDays = document.getElementById('calendarDays');
    this.currentMonthElement = document.getElementById('currentMonth');
    this.prevMonthButton = document.getElementById('prevMonth');
    this.nextMonthButton = document.getElementById('nextMonth');
    this.timeSlotsContainer = document.getElementById('timeSlots');
    this.serviceSelect = document.getElementById('serviceType');
    this.confirmButton = document.getElementById('confirmBooking');
    this.darkModeToggle = document.getElementById('darkModeToggle');

    this.selectedServiceElement = document.getElementById('selectedService');
    this.selectedDateElement = document.getElementById('selectedDate');
    this.selectedTimeElement = document.getElementById('selectedTime');

    // Appointment management elements
    this.appointmentsSection = document.getElementById('appointmentsSection');
    this.emptyAppointmentsState = document.getElementById('emptyAppointmentsState');
    this.appointmentsList = document.getElementById('appointmentsList');
    this.appointmentModal = document.getElementById('appointmentModal');
    this.closeModalButton = document.getElementById('closeModal');
    this.modalBody = document.getElementById('modalBody');
    this.rescheduleNotice = document.getElementById('rescheduleNotice');
    this.rescheduleIdVal = document.getElementById('rescheduleIdVal');
    this.cancelRescheduleButton = document.getElementById('cancelReschedule');
  }

  animateInitialLoad() {
    anime({
      targets: 'header h1',
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutExpo',
      complete: () => {
        anime({
          targets: 'header h1',
          scale: [1, 1.05, 1],
          duration: 800,
          easing: 'easeInOutQuad',
        });
      },
    });

    anime({
      targets: '.booking-container',
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 300,
      easing: 'easeOutExpo',
    });

    anime({
      targets: '.service-selection',
      translateX: [-30, 0],
      opacity: [0, 1],
      duration: 600,
      delay: 500,
      easing: 'easeOutElastic(1, .8)',
    });

    anime({
      targets: '.calendar-nav',
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 600,
      delay: 700,
      easing: 'easeOutExpo',
    });

    anime({
      targets: '.weekdays div',
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 500,
      easing: 'easeOutExpo',
    });
  }

  initializeDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (
      !savedTheme &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    anime({
      targets: this.darkModeToggle,
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      duration: 500,
      easing: 'easeOutExpo',
    });

    anime({
      targets: 'body',
      backgroundColor: [
        { value: newTheme === 'dark' ? '#f5f5f5' : '#1a1a1a', duration: 0 },
        { value: newTheme === 'dark' ? '#1a1a1a' : '#f5f5f5', duration: 300 },
      ],
      easing: 'easeOutExpo',
    });

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  attachEventListeners() {
    this.prevMonthButton.addEventListener('click', () =>
      this.navigateMonth(-1)
    );
    this.nextMonthButton.addEventListener('click', () => this.navigateMonth(1));
    this.serviceSelect.addEventListener('change', (e) =>
      this.handleServiceSelection(e)
    );
    this.confirmButton.addEventListener('click', () =>
      this.handleBookingConfirmation()
    );
    this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

    if (this.closeModalButton) {
      this.closeModalButton.addEventListener('click', () => this.closeModal());
    }
    if (this.cancelRescheduleButton) {
      this.cancelRescheduleButton.addEventListener('click', () => this.cancelReschedule());
    }
    if (this.appointmentModal) {
      this.appointmentModal.addEventListener('click', (e) => {
        if (e.target === this.appointmentModal) {
          this.closeModal();
        }
      });
    }
  }

  loadAppointments() {
    const saved = localStorage.getItem('appointmentsList');
    if (saved) {
      this.appointments = JSON.parse(saved);
      bookedAppointments.clear();
      this.appointments.forEach((appt) => {
        if (appt.status === 'Upcoming') {
          const slotKey = `${appt.dateString}-${appt.time}`;
          bookedAppointments.add(slotKey);
        }
      });
    } else {
      const legacyBooked = localStorage.getItem('bookedAppointments');
      if (legacyBooked) {
        try {
          const parsed = JSON.parse(legacyBooked);
          parsed.forEach(key => bookedAppointments.add(key));
        } catch (e) {}
      }
      this.appointments = [];
    }
  }

  saveAppointments() {
    localStorage.setItem('appointmentsList', JSON.stringify(this.appointments));
    localStorage.setItem(
      'bookedAppointments',
      JSON.stringify([...bookedAppointments])
    );
  }

  navigateMonth(direction) {
    anime({
      targets: direction === -1 ? this.prevMonthButton : this.nextMonthButton,
      scale: [1, 1.2, 1],
      duration: 300,
      easing: 'easeOutExpo',
    });

    anime({
      targets: '.calendar-grid',
      translateX: [direction * 100, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutExpo',
    });

    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.renderCalendar();
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    anime({
      targets: this.currentMonthElement,
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutExpo',
    });

    this.currentMonthElement.textContent = `${this.currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    this.calendarDays.innerHTML = '';

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    for (let i = 0; i < firstDay.getDay(); i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'day disabled';
      this.calendarDays.appendChild(emptyDay);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'day';
      dayElement.textContent = day;

      const currentDate = new Date(year, month, day);

      if (currentDate < new Date().setHours(0, 0, 0, 0)) {
        dayElement.classList.add('disabled');
      } else {
        dayElement.addEventListener('mouseenter', () => {
          if (!dayElement.classList.contains('disabled')) {
            anime({
              targets: dayElement,
              scale: [1, 1.2],
              backgroundColor: [
                { value: 'var(--container-bg)', duration: 0 },
                { value: 'var(--hover-bg)', duration: 300 },
              ],
              boxShadow: [
                { value: '0 0 0 rgba(0,0,0,0)', duration: 0 },
                { value: '0 5px 15px rgba(0,0,0,0.2)', duration: 300 },
              ],
              duration: 300,
              easing: 'easeOutExpo',
            });
          }
        });

        dayElement.addEventListener('mouseleave', () => {
          if (
            !dayElement.classList.contains('disabled') &&
            !dayElement.classList.contains('selected')
          ) {
            anime({
              targets: dayElement,
              scale: [1.2, 1],
              backgroundColor: [
                { value: 'var(--hover-bg)', duration: 0 },
                { value: 'var(--container-bg)', duration: 300 },
              ],
              boxShadow: [
                { value: '0 5px 15px rgba(0,0,0,0.2)', duration: 0 },
                { value: '0 0 0 rgba(0,0,0,0)', duration: 300 },
              ],
              duration: 300,
              easing: 'easeOutExpo',
            });
          }
        });

        dayElement.addEventListener('click', () =>
          this.handleDateSelection(currentDate)
        );
      }

      if (
        this.selectedDate &&
        this.selectedDate.getDate() === day &&
        this.selectedDate.getMonth() === month &&
        this.selectedDate.getFullYear() === year
      ) {
        dayElement.classList.add('selected');
      }

      this.calendarDays.appendChild(dayElement);
    }

    anime({
      targets: '.day',
      scale: [0.8, 1],
      opacity: [0, 1],
      delay: anime.stagger(20, {
        from: 'center',
        grid: [7, 6],
        axis: 'x',
      }),
      duration: 300,
      easing: 'easeOutExpo',
    });
  }

  handleDateSelection(date) {
    if (this.selectedDate) {
      anime({
        targets: '.day.selected',
        scale: [1.1, 1],
        backgroundColor: [
          { value: '#3498db', duration: 0 },
          { value: '#2980b9', duration: 300 },
        ],
        duration: 300,
        easing: 'easeOutExpo',
      });
    }

    this.selectedDate = date;
    this.renderCalendar();
    this.renderTimeSlots();
    this.updateBookingSummary();

    anime({
      targets: '.day.selected',
      scale: [1, 1.2, 1],
      backgroundColor: [
        { value: '#2980b9', duration: 0 },
        { value: '#3498db', duration: 300 },
      ],
      duration: 500,
      easing: 'easeOutElastic(1, .8)',
    });
  }

  handleServiceSelection(event) {
    this.selectedService = event.target.value;

    anime({
      targets: '.service-selection',
      translateX: [-10, 0],
      scale: [0.95, 1],
      duration: 300,
      easing: 'easeOutExpo',
      complete: () => {
        anime({
          targets: '.service-selection select',
          scale: [1, 1.05, 1],
          duration: 400,
          easing: 'easeInOutQuad',
        });
      },
    });

    this.updateBookingSummary();
  }

  renderTimeSlots() {
    if (!this.selectedDate) return;

    this.timeSlotsContainer.innerHTML = '';
    const duration = SERVICE_DURATIONS[this.selectedService] || 30;

    for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += BUSINESS_HOURS.interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotElement = document.createElement('div');
        slotElement.className = 'time-slot';
        slotElement.textContent = timeString;

        const slotKey = `${this.selectedDate.toISOString().split('T')[0]}-${timeString}`;
        if (bookedAppointments.has(slotKey)) {
          slotElement.classList.add('booked');
        } else {
          slotElement.addEventListener('mouseenter', () => {
            if (!slotElement.classList.contains('selected')) {
              anime({
                targets: slotElement,
                scale: [1, 1.1],
                translateY: [0, -5],
                backgroundColor: [
                  { value: 'var(--container-bg)', duration: 0 },
                  { value: 'var(--hover-bg)', duration: 300 },
                ],
                boxShadow: [
                  { value: '0 0 0 rgba(0,0,0,0)', duration: 0 },
                  { value: '0 5px 15px rgba(0,0,0,0.2)', duration: 300 },
                ],
                duration: 300,
                easing: 'easeOutExpo',
              });
            }
          });

          slotElement.addEventListener('mouseleave', () => {
            if (!slotElement.classList.contains('selected')) {
              anime({
                targets: slotElement,
                scale: [1.1, 1],
                translateY: [-5, 0],
                backgroundColor: [
                  { value: 'var(--hover-bg)', duration: 0 },
                  { value: 'var(--container-bg)', duration: 300 },
                ],
                boxShadow: [
                  { value: '0 5px 15px rgba(0,0,0,0.2)', duration: 0 },
                  { value: '0 0 0 rgba(0,0,0,0)', duration: 300 },
                ],
                duration: 300,
                easing: 'easeOutExpo',
              });
            }
          });

          slotElement.addEventListener('click', () =>
            this.handleTimeSelection(timeString)
          );
        }

        if (this.selectedTime === timeString) {
          slotElement.classList.add('selected');
        }

        this.timeSlotsContainer.appendChild(slotElement);
      }
    }

    const slotsPerRow = Math.floor(this.timeSlotsContainer.offsetWidth / 150);
    const totalSlots = this.timeSlotsContainer.children.length;
    const rows = Math.ceil(totalSlots / slotsPerRow);

    anime({
      targets: '.time-slot',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(50, {
        from: 'center',
        grid: [slotsPerRow, rows],
        axis: 'x',
      }),
      duration: 500,
      easing: 'easeOutExpo',
      complete: () => {
        anime({
          targets: '.time-slot:not(.booked):not(.selected)',
          scale: [1, 1.02, 1],
          duration: 800,
          delay: anime.stagger(100, {
            from: 'center',
            grid: [slotsPerRow, rows],
            axis: 'x',
          }),
          easing: 'easeInOutQuad',
        });
      },
    });
  }

  handleTimeSelection(time) {
    if (this.selectedTime) {
      anime({
        targets: '.time-slot.selected',
        scale: [1, 1],
        translateY: [0, 0],
        backgroundColor: [
          { value: '#3498db', duration: 0 },
          { value: 'var(--container-bg)', duration: 300 },
        ],
        boxShadow: [
          { value: '0 5px 15px rgba(0,0,0,0.2)', duration: 0 },
          { value: '0 0 0 rgba(0,0,0,0)', duration: 300 },
        ],
        duration: 300,
        easing: 'easeOutExpo',
      });
    }

    this.selectedTime = time;
    this.renderTimeSlots();

    anime({
      targets: '.time-slot.selected',
      scale: [1, 1.2, 1],
      translateY: [0, -5, 0],
      backgroundColor: [
        { value: 'var(--container-bg)', duration: 0 },
        { value: '#3498db', duration: 300 },
      ],
      boxShadow: [
        { value: '0 0 0 rgba(0,0,0,0)', duration: 0 },
        { value: '0 5px 15px rgba(0,0,0,0.2)', duration: 300 },
      ],
      duration: 500,
      easing: 'easeOutElastic(1, .8)',
      complete: () => {
        anime({
          targets: '.time-slot.selected',
          scale: [1, 1.05, 1],
          duration: 300,
          easing: 'easeInOutQuad',
        });
      },
    });

    this.updateBookingSummary();
  }

  updateBookingSummary() {
    this.selectedServiceElement.textContent = this.selectedService
      ? `Service: ${this.serviceSelect.options[this.serviceSelect.selectedIndex].text}`
      : 'No service selected';

    this.selectedDateElement.textContent = this.selectedDate
      ? `Date: ${this.selectedDate.toLocaleDateString()}`
      : 'No date selected';

    this.selectedTimeElement.textContent = this.selectedTime
      ? `Time: ${this.selectedTime}`
      : 'No time selected';

    this.confirmButton.disabled = !(
      this.selectedService &&
      this.selectedDate &&
      this.selectedTime
    );

    anime({
      targets: [
        this.selectedServiceElement,
        this.selectedDateElement,
        this.selectedTimeElement,
      ],
      translateX: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 300,
      easing: 'easeOutExpo',
      complete: () => {
        if (!this.confirmButton.disabled) {
          anime({
            targets: this.confirmButton,
            scale: [1, 1.05, 1],
            backgroundColor: [
              { value: '#27ae60', duration: 0 },
              { value: '#2ecc71', duration: 300 },
            ],
            duration: 500,
            easing: 'easeInOutQuad',
          });
        }
      },
    });
  }

  showWarningToast(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box error';
    alertBox.innerHTML = `
      <div class="alert-content">
        <h3>Booking Warning</h3>
        <p class="error-details" style="font-family: inherit; font-size: 1rem; color: #c53030; background: none; border: none; padding: 0;">${message}</p>
      </div>
    `;
    document.body.appendChild(alertBox);

    anime({
      targets: alertBox,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutExpo',
      complete: () => {
        setTimeout(() => {
          anime({
            targets: alertBox,
            translateY: [0, -50],
            opacity: [1, 0],
            duration: 500,
            easing: 'easeInExpo',
            complete: () => alertBox.remove(),
          });
        }, 4000);
      },
    });
  }

  showToastNotification(message, type = 'success') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert-box ${type === 'error' ? 'error' : ''}`;
    alertBox.innerHTML = `
      <div class="alert-content">
        <h3>${type === 'error' ? 'Error' : type === 'info' ? 'Info' : 'Success'}</h3>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(alertBox);

    anime({
      targets: alertBox,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutExpo',
      complete: () => {
        setTimeout(() => {
          anime({
            targets: alertBox,
            translateY: [0, -50],
            opacity: [1, 0],
            duration: 500,
            easing: 'easeInExpo',
            complete: () => alertBox.remove(),
          });
        }, 3000);
      },
    });
  }

  handleBookingConfirmation() {
    if (!this.selectedService || !this.selectedDate || !this.selectedTime)
      return;

    const dateString = this.selectedDate.toISOString().split('T')[0];
    const slotKey = `${dateString}-${this.selectedTime}`;

    // Duplicate Prevention Check
    const currentRescheduledAppt = this.reschedulingId 
      ? this.appointments.find(a => a.id === this.reschedulingId)
      : null;
    
    const isTargetSlotBooked = bookedAppointments.has(slotKey);
    const isSameAsOriginalSlot = currentRescheduledAppt 
      ? `${currentRescheduledAppt.dateString}-${currentRescheduledAppt.time}` === slotKey
      : false;

    if (isTargetSlotBooked && !isSameAsOriginalSlot) {
      this.showWarningToast('An appointment already exists for this time slot.');
      return;
    }

    const serviceText = this.serviceSelect.options[this.serviceSelect.selectedIndex].text;

    anime({
      targets: '#confirmBooking',
      scale: [1, 1.2, 1],
      backgroundColor: [
        { value: '#2ecc71', duration: 0 },
        { value: '#27ae60', duration: 300 },
      ],
      duration: 500,
      easing: 'easeOutExpo',
    });

    if (this.reschedulingId) {
      // RESCHEDULE FLOW
      const apptIndex = this.appointments.findIndex(a => a.id === this.reschedulingId);
      if (apptIndex !== -1) {
        const oldAppt = this.appointments[apptIndex];
        const oldSlotKey = `${oldAppt.dateString}-${oldAppt.time}`;
        
        // Free old slot
        bookedAppointments.delete(oldSlotKey);

        // Update appointment details
        this.appointments[apptIndex] = {
          ...oldAppt,
          service: this.selectedService,
          serviceText: serviceText,
          date: new Date(this.selectedDate),
          dateString: dateString,
          time: this.selectedTime,
          updatedAt: new Date().toLocaleString()
        };

        // Block new slot
        bookedAppointments.add(slotKey);
        this.saveAppointments();

        this.lastConfirmed = this.appointments[apptIndex];
        this.reschedulingId = null;
        
        if (this.rescheduleNotice) this.rescheduleNotice.style.display = 'none';
        this.confirmButton.textContent = 'Confirm Appointment';

        this.showSuccessAlert('Appointment Updated!', 'Your changes have been successfully saved.');
      }
    } else {
      // NEW BOOKING FLOW
      const newAppt = {
        id: 'APT-' + Math.floor(100000 + Math.random() * 900000),
        service: this.selectedService,
        serviceText: serviceText,
        date: new Date(this.selectedDate),
        dateString: dateString,
        time: this.selectedTime,
        status: 'Upcoming',
        createdAt: new Date().toLocaleString()
      };

      this.appointments.unshift(newAppt);
      bookedAppointments.add(slotKey);
      this.saveAppointments();

      this.lastConfirmed = newAppt;

      this.showSuccessAlert('Appointment Confirmed!', `Service: ${serviceText}<br>Date: ${new Date(this.selectedDate).toLocaleDateString()}<br>Time: ${this.selectedTime}`);
    }

    this.selectedService = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.serviceSelect.value = '';

    this.renderCalendar();
    this.renderTimeSlots();
    this.updateBookingSummary();
    this.renderAppointments();
  }

  showSuccessAlert(title, messageHtml) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.innerHTML = `
      <div class="alert-content">
        <h3>${title}</h3>
        <p>${messageHtml}</p>
        <p class="reminder">Please arrive 10 minutes before your appointment time.</p>
        <button id="downloadPDF" class="download-button">Download Confirmation</button>
      </div>
    `;
    document.body.appendChild(alertBox);

    const downloadButton = alertBox.querySelector('#downloadPDF');
    downloadButton.addEventListener('click', () => this.generatePDF());

    anime({
      targets: alertBox,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutExpo',
      complete: () => {
        setTimeout(() => {
          anime({
            targets: alertBox,
            translateY: [0, -50],
            opacity: [1, 0],
            duration: 500,
            easing: 'easeInExpo',
            complete: () => alertBox.remove(),
          });
        }, 6000);
      },
    });
  }

  renderAppointments() {
    if (!this.appointmentsList || !this.emptyAppointmentsState) return;

    if (this.appointments.length === 0) {
      this.appointmentsList.style.display = 'none';
      this.emptyAppointmentsState.style.display = 'flex';
      return;
    }

    this.emptyAppointmentsState.style.display = 'none';
    this.appointmentsList.style.display = 'grid';
    this.appointmentsList.innerHTML = '';

    this.appointments.forEach((appt) => {
      const card = document.createElement('div');
      card.className = `appointment-card status-${appt.status.toLowerCase()}`;
      card.id = `appt-card-${appt.id}`;
      
      const dateObj = typeof appt.date === 'string' ? new Date(appt.date) : appt.date;
      const localDateStr = dateObj.toLocaleDateString(undefined, { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });

      card.innerHTML = `
        <div class="card-header-main">
          <div class="card-service">${appt.serviceText}</div>
          <span class="badge ${appt.status.toLowerCase()}">${appt.status}</span>
        </div>
        <div class="card-details">
          <div class="card-detail-item">
            <span class="card-detail-icon">📅</span>
            <span>${localDateStr}</span>
          </div>
          <div class="card-detail-item">
            <span class="card-detail-icon">⏰</span>
            <span>${appt.time}</span>
          </div>
          <div class="card-detail-item">
            <span class="card-detail-icon">🆔</span>
            <span>${appt.id}</span>
          </div>
        </div>
        <div class="card-timestamp">
          Booked on: ${appt.createdAt}
        </div>
        <div class="card-actions">
          <button class="btn-card btn-view" onclick="window.calendarInstance.viewDetails('${appt.id}')">View</button>
          ${appt.status === 'Upcoming' ? `
            <button class="btn-card btn-reschedule" onclick="window.calendarInstance.initiateReschedule('${appt.id}')">Reschedule</button>
            <button class="btn-card btn-cancel" onclick="window.calendarInstance.confirmCancel('${appt.id}')">Cancel</button>
          ` : ''}
        </div>
      `;

      this.appointmentsList.appendChild(card);
    });

    anime({
      targets: '.appointment-card',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 500,
      easing: 'easeOutExpo'
    });
  }

  viewDetails(id) {
    const appt = this.appointments.find(a => a.id === id);
    if (!appt || !this.appointmentModal || !this.modalBody) return;

    const dateObj = typeof appt.date === 'string' ? new Date(appt.date) : appt.date;
    const localDateStr = dateObj.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    this.modalBody.innerHTML = `
      <h3 class="modal-detail-title">Appointment Details</h3>
      <div class="modal-detail-list">
        <div class="modal-detail-item"><strong>Appointment ID</strong> ${appt.id}</div>
        <div class="modal-detail-item"><strong>Service</strong> ${appt.serviceText}</div>
        <div class="modal-detail-item"><strong>Date</strong> ${localDateStr}</div>
        <div class="modal-detail-item"><strong>Time Slot</strong> ${appt.time}</div>
        <div class="modal-detail-item"><strong>Status</strong> <span class="badge ${appt.status.toLowerCase()}">${appt.status}</span></div>
        <div class="modal-detail-item"><strong>Booked At</strong> ${appt.createdAt}</div>
        ${appt.updatedAt ? `<div class="modal-detail-item"><strong>Last Updated</strong> ${appt.updatedAt}</div>` : ''}
      </div>
      <div class="modal-actions">
        <button class="modal-btn btn-cancel" onclick="window.calendarInstance.closeModal()">Close</button>
        ${appt.status === 'Upcoming' ? `
          <button class="modal-btn btn-confirm" style="background: var(--primary-color);" onclick="window.calendarInstance.closeModal(); window.calendarInstance.initiateReschedule('${appt.id}')">Reschedule</button>
        ` : ''}
      </div>
    `;

    this.openModal();
  }

  confirmCancel(id) {
    const appt = this.appointments.find(a => a.id === id);
    if (!appt || !this.appointmentModal || !this.modalBody) return;

    this.modalBody.innerHTML = `
      <h3 class="modal-detail-title" style="color: #e74c3c;">Cancel Appointment?</h3>
      <p style="margin-bottom: 20px; color: var(--text-color); text-align: left;">Are you sure you want to cancel your <strong>${appt.serviceText}</strong> appointment on <strong>${new Date(appt.date).toLocaleDateString()}</strong> at <strong>${appt.time}</strong>?</p>
      <div class="modal-actions">
        <button class="modal-btn btn-cancel" onclick="window.calendarInstance.closeModal()">No, Keep It</button>
        <button class="modal-btn btn-confirm" onclick="window.calendarInstance.cancelAppointment('${appt.id}')">Yes, Cancel It</button>
      </div>
    `;

    this.openModal();
  }

  cancelAppointment(id) {
    const apptIndex = this.appointments.findIndex(a => a.id === id);
    if (apptIndex === -1) return;

    const appt = this.appointments[apptIndex];
    const slotKey = `${appt.dateString}-${appt.time}`;
    
    // Free the slot
    bookedAppointments.delete(slotKey);

    // Update state to Cancelled
    this.appointments[apptIndex].status = 'Cancelled';
    this.appointments[apptIndex].updatedAt = new Date().toLocaleString();

    this.saveAppointments();
    this.closeModal();
    this.renderCalendar();
    this.renderTimeSlots();
    this.renderAppointments();

    this.showToastNotification('Appointment cancelled successfully.', 'success');

    if (this.reschedulingId === id) {
      this.cancelReschedule();
    }
  }

  initiateReschedule(id) {
    const appt = this.appointments.find(a => a.id === id);
    if (!appt) return;

    this.reschedulingId = id;

    if (this.rescheduleNotice && this.rescheduleIdVal) {
      this.rescheduleIdVal.textContent = id;
      this.rescheduleNotice.style.display = 'flex';
    }

    this.serviceSelect.value = appt.service;
    this.selectedService = appt.service;

    const apptDate = new Date(appt.date);
    this.currentDate = new Date(apptDate);
    this.selectedDate = apptDate;
    this.selectedTime = appt.time;

    this.renderCalendar();
    this.renderTimeSlots();
    this.updateBookingSummary();

    this.confirmButton.textContent = 'Update Appointment';

    const container = document.querySelector('.booking-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
    }

    this.showToastNotification('Please select a new date and time slot for your appointment.', 'info');
  }

  cancelReschedule() {
    this.reschedulingId = null;
    if (this.rescheduleNotice) {
      this.rescheduleNotice.style.display = 'none';
    }
    this.confirmButton.textContent = 'Confirm Appointment';

    this.selectedService = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.serviceSelect.value = '';

    this.renderCalendar();
    this.renderTimeSlots();
    this.updateBookingSummary();

    this.showToastNotification('Rescheduling cancelled.', 'info');
  }

  openModal() {
    if (this.appointmentModal) {
      this.appointmentModal.style.display = 'flex';
      anime({
        targets: this.appointmentModal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutExpo'
      });
      anime({
        targets: '.modal-content',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutBack'
      });
    }
  }

  closeModal() {
    if (this.appointmentModal) {
      anime({
        targets: this.appointmentModal,
        opacity: [1, 0],
        duration: 250,
        easing: 'easeInExpo',
        complete: () => {
          this.appointmentModal.style.display = 'none';
        }
      });
    }
  }

  generatePDF() {
    try {
      if (!this.lastConfirmed)
        throw new Error('No appointment details available.');
      const { serviceText, date, time } = this.lastConfirmed;
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const doc = new window.jspdf.jsPDF();

      doc.setFontSize(20);
      doc.text('Medical Appointment Confirmation', 20, 20);

      doc.setFontSize(12);
      doc.text('123 Medical Center Drive', 20, 40);
      doc.text('Healthcare City, HC 12345', 20, 50);
      doc.text('Phone: (555) 123-4567', 20, 60);

      doc.setFontSize(14);
      doc.text('Appointment Details:', 20, 80);

      doc.setFontSize(12);
      doc.text(`Service: ${serviceText}`, 20, 95);
      doc.text(`Date: ${dateObj.toLocaleDateString()}`, 20, 105);
      doc.text(`Time: ${time}`, 20, 115);

      doc.setFontSize(12);
      doc.text('Important Notes:', 20, 135);
      doc.setFontSize(10);
      doc.text(
        '• Please arrive 10 minutes before your appointment time',
        20,
        145
      );
      doc.text('• Bring your insurance card and ID', 20, 155);
      doc.text(
        '• Wear a mask and follow social distancing guidelines',
        20,
        165
      );

      doc.setFontSize(10);
      doc.text(
        'This is an automated confirmation. Please keep this for your records.',
        20,
        250
      );

      const filename = `appointment_confirmation_${dateObj.toISOString().split('T')[0]}.pdf`;

      doc.save(filename);

      const downloadButton = document.querySelector('#downloadPDF');
      if (downloadButton) {
        anime({
          targets: downloadButton,
          scale: [1, 1.1, 1],
          backgroundColor: [
            { value: 'var(--primary-color)', duration: 0 },
            { value: 'var(--primary-hover)', duration: 300 },
          ],
          duration: 500,
          easing: 'easeOutElastic(1, .8)',
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      const alertBox = document.createElement('div');
      alertBox.className = 'alert-box error';
      alertBox.innerHTML = `
                <div class="alert-content">
                    <h3>Error</h3>
                    <p>There was an error generating the PDF. Please try again.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
      document.body.appendChild(alertBox);

      anime({
        targets: alertBox,
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutExpo',
        complete: () => {
          setTimeout(() => {
            anime({
              targets: alertBox,
              translateY: [0, -50],
              opacity: [1, 0],
              duration: 500,
              easing: 'easeInExpo',
              complete: () => alertBox.remove(),
            });
          }, 3000);
        },
      });
    }
  }

  initializeHoverEffects() {
    this.serviceSelect.addEventListener('mouseenter', () => {
      anime({
        targets: '.service-selection',
        scale: [1, 1.02],
        boxShadow: [
          { value: '0 2px 10px rgba(0, 0, 0, 0.1)', duration: 0 },
          { value: '0 5px 20px rgba(0, 0, 0, 0.15)', duration: 300 },
        ],
        duration: 300,
        easing: 'easeOutExpo',
      });
    });

    this.serviceSelect.addEventListener('mouseleave', () => {
      anime({
        targets: '.service-selection',
        scale: [1.02, 1],
        boxShadow: [
          { value: '0 5px 20px rgba(0, 0, 0, 0.15)', duration: 0 },
          { value: '0 2px 10px rgba(0, 0, 0, 0.1)', duration: 300 },
        ],
        duration: 300,
        easing: 'easeOutExpo',
      });
    });

    [this.prevMonthButton, this.nextMonthButton].forEach((button) => {
      button.addEventListener('mouseenter', () => {
        anime({
          targets: button,
          scale: [1, 1.1],
          backgroundColor: [
            { value: 'var(--primary-color)', duration: 0 },
            { value: 'var(--primary-hover)', duration: 300 },
          ],
          duration: 300,
          easing: 'easeOutExpo',
        });
      });

      button.addEventListener('mouseleave', () => {
        anime({
          targets: button,
          scale: [1.1, 1],
          backgroundColor: [
            { value: 'var(--primary-hover)', duration: 0 },
            { value: 'var(--primary-color)', duration: 300 },
          ],
          duration: 300,
          easing: 'easeOutExpo',
        });
      });
    });

    this.timeSlotsContainer.addEventListener('mouseover', (e) => {
      if (
        e.target.classList.contains('time-slot') &&
        !e.target.classList.contains('booked')
      ) {
        anime({
          targets: e.target,
          scale: [1, 1.05],
          backgroundColor: [
            { value: 'var(--container-bg)', duration: 0 },
            { value: 'var(--hover-bg)', duration: 300 },
          ],
          duration: 300,
          easing: 'easeOutExpo',
        });
      }
    });

    this.timeSlotsContainer.addEventListener('mouseout', (e) => {
      if (
        e.target.classList.contains('time-slot') &&
        !e.target.classList.contains('booked')
      ) {
        anime({
          targets: e.target,
          scale: [1.05, 1],
          backgroundColor: [
            { value: 'var(--hover-bg)', duration: 0 },
            { value: 'var(--container-bg)', duration: 300 },
          ],
          duration: 300,
          easing: 'easeOutExpo',
        });
      }
    });

    const bookingSummary = document.querySelector('.booking-summary');
    bookingSummary.addEventListener('mouseenter', () => {
      anime({
        targets: bookingSummary,
        translateY: [0, -5],
        boxShadow: [
          { value: '0 2px 10px rgba(0, 0, 0, 0.1)', duration: 0 },
          { value: '0 8px 25px rgba(0, 0, 0, 0.15)', duration: 300 },
        ],
        duration: 300,
        easing: 'easeOutExpo',
      });
    });

    bookingSummary.addEventListener('mouseleave', () => {
      anime({
        targets: bookingSummary,
        translateY: [-5, 0],
        boxShadow: [
          { value: '0 8px 25px rgba(0, 0, 0, 0.15)', duration: 0 },
          { value: '0 2px 10px rgba(0, 0, 0, 0.1)', duration: 300 },
        ],
        duration: 300,
        easing: 'easeOutExpo',
      });
    });

    this.confirmButton.addEventListener('mouseenter', () => {
      if (!this.confirmButton.disabled) {
        anime({
          targets: this.confirmButton,
          scale: [1, 1.05],
          backgroundColor: [
            { value: 'var(--success-color)', duration: 0 },
            { value: 'var(--success-hover)', duration: 300 },
          ],
          duration: 300,
          easing: 'easeOutExpo',
        });
      }
    });

    this.confirmButton.addEventListener('mouseleave', () => {
      if (!this.confirmButton.disabled) {
        anime({
          targets: this.confirmButton,
          scale: [1.05, 1],
          backgroundColor: [
            { value: 'var(--success-hover)', duration: 0 },
            { value: 'var(--success-color)', duration: 300 },
          ],
          duration: 300,
          easing: 'easeOutExpo',
        });
      }
    });

    this.darkModeToggle.addEventListener('mouseenter', () => {
      anime({
        targets: this.darkModeToggle,
        rotate: [0, 15],
        scale: [1, 1.1],
        duration: 300,
        easing: 'easeOutExpo',
      });
    });

    this.darkModeToggle.addEventListener('mouseleave', () => {
      anime({
        targets: this.darkModeToggle,
        rotate: [15, 0],
        scale: [1.1, 1],
        duration: 300,
        easing: 'easeOutExpo',
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.removeAttribute('hidden');
  setTimeout(() => {
    new Calendar();
    if (spinner) spinner.setAttribute('hidden', '');
  }, 800);
});
