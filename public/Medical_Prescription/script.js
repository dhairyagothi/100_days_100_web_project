const STORE_KEY = "prescripto_static_data";
const SESSION_KEY = "prescripto_current_user";

const state = {
  roleChoice: "PATIENT",
  medicinesDraft: []
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function defaultData() {
  const patientId = "PAT-DEMO100";
  return {
    users: [
      {
        id: "USR-PATIENT",
        role: "PATIENT",
        fullName: "Aarav Sharma",
        email: "patient@demo.com",
        password: "123456",
        phone: "9876543210",
        gender: "Male",
        dateOfBirth: "1995-04-12",
        address: "MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        patientInfo: {
          patientId,
          bloodGroup: "B+",
          allergies: "Penicillin",
          emergencyContactName: "Riya Sharma",
          emergencyContactPhone: "9876543211"
        }
      },
      {
        id: "USR-DOCTOR",
        role: "DOCTOR",
        fullName: "Neha Mehta",
        email: "doctor@demo.com",
        password: "123456",
        phone: "9988776655",
        gender: "Female",
        city: "Mumbai",
        doctorInfo: {
          specialization: "General Physician",
          qualification: "MBBS, MD",
          experienceYears: 10,
          licenseNumber: "MCI-12345",
          hospitalName: "City Hospital",
          consultationFee: 700
        }
      },
      {
        id: "USR-CARE",
        role: "CAREGIVER",
        fullName: "Riya Sharma",
        email: "caregiver@demo.com",
        password: "123456",
        phone: "9876543211",
        gender: "Female",
        city: "Mumbai",
        caregiverInfo: {
          relationWithPatient: "Sibling",
          assignedPatientId: patientId
        }
      }
    ],
    prescriptions: [
      {
        id: "RX-DEMO1",
        doctorId: "USR-DOCTOR",
        patientId,
        diagnosis: "Seasonal fever",
        notes: "Drink water and rest for two days.",
        createdDate: today(),
        status: "ACTIVE",
        medicines: [
          {
            id: "MED-DEMO1",
            name: "Paracetamol",
            dosage: "500mg",
            timing: "MORNING_EVENING",
            durationDays: 5,
            instructions: "After food",
            startDate: today()
          },
          {
            id: "MED-DEMO2",
            name: "Cetirizine",
            dosage: "10mg",
            timing: "NIGHT",
            durationDays: 3,
            instructions: "Before sleep",
            startDate: today()
          }
        ]
      }
    ],
    logs: [
      { medicineId: "MED-DEMO1", patientId, date: today(), timing: "MORNING", status: "TAKEN" }
    ]
  };
}

function loadData() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    const seed = defaultData();
    saveData(seed);
    return seed;
  }
  return JSON.parse(raw);
}

function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function currentUser() {
  const id = localStorage.getItem(SESSION_KEY);
  return loadData().users.find((user) => user.id === id) || null;
}

function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, user.id);
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  go("home");
}

function go(route, params = {}) {
  const query = new URLSearchParams(params).toString();
  location.hash = query ? `${route}?${query}` : route;
}

function routeInfo() {
  const hash = location.hash.replace(/^#/, "") || "home";
  const [name, query = ""] = hash.split("?");
  return { name, params: Object.fromEntries(new URLSearchParams(query)) };
}

function app(html) {
  document.getElementById("app").innerHTML = html;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function topbar(actions = "") {
  return `
    <nav class="topbar">
      <button class="brand" onclick="go('home')" aria-label="Prescripto home">
        <span class="brand-mark">Rx</span>
        <span>Prescripto</span>
      </button>
      <div class="nav-actions">${actions}</div>
    </nav>
  `;
}

function pageShell(content, actions = "") {
  app(`<div class="site-shell">${topbar(actions)}${content}</div>`);
}

function renderHome() {
  const actions = `
    <button class="btn btn-outline" onclick="go('login')">Login</button>
    <button class="btn btn-primary" onclick="go('register')">Register</button>
  `;
  pageShell(`
    <main>
      <section class="hero">
        <div>
          <h1>Manage prescriptions without the paper chase.</h1>
          <p>Prescripto helps patients track medicines, doctors create prescriptions, and caregivers monitor daily medicine status from one simple browser app.</p>
          <div class="nav-actions">
            <button class="btn btn-primary" onclick="go('register')">Get started</button>
            <button class="btn" onclick="go('login')">Use demo account</button>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="prescription-sheet">
            <div class="sheet-line short"></div>
            <div class="sheet-line"></div>
            <div class="medicine-row"><div class="pill-icon"></div><div><b>Morning dose</b><br><span class="small muted">After food</span></div><span class="badge green">Taken</span></div>
            <div class="medicine-row"><div class="pill-icon"></div><div><b>Evening dose</b><br><span class="small muted">Pending</span></div><span class="badge yellow">Today</span></div>
            <div class="medicine-row"><div class="pill-icon"></div><div><b>Doctor review</b><br><span class="small muted">Adherence report</span></div><span class="badge gray">82%</span></div>
          </div>
        </div>
      </section>
      <section class="section">
        <h2 class="section-title">Built for the care team</h2>
        <div class="grid grid-3">
          <article class="card soft-blue"><h3>Patients</h3><p class="muted">View prescriptions, check today's medicines, and mark every dose as taken or missed.</p></article>
          <article class="card soft-green"><h3>Doctors</h3><p class="muted">Create prescriptions, see patients you have treated, and review adherence history.</p></article>
          <article class="card soft-violet"><h3>Caregivers</h3><p class="muted">Follow a linked patient's medicines, prescriptions, and medical profile.</p></article>
        </div>
      </section>
    </main>
  `, actions);
}

function renderLogin(message = "") {
  const messageClass = message.includes("successful") ? "ok" : "bad";
  pageShell(`
    <main class="auth-wrap">
      <section class="card auth-card">
        <h1>Welcome back</h1>
        <p class="muted">Demo logins: patient@demo.com, doctor@demo.com, caregiver@demo.com. Password: 123456.</p>
        ${message ? `<div class="message ${messageClass}">${escapeHtml(message)}</div>` : ""}
        <form onsubmit="loginSubmit(event)" class="form-grid">
          <div class="field field-full"><label>Email</label><input name="email" type="email" required placeholder="patient@demo.com"></div>
          <div class="field field-full"><label>Password</label><input name="password" type="password" required placeholder="123456"></div>
          <button class="btn btn-primary field-full" type="submit">Login</button>
        </form>
        <p class="small muted">New here? <button class="btn btn-soft" onclick="go('register')">Create account</button></p>
      </section>
    </main>
  `);
}

function loginSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const data = loadData();
  const user = data.users.find((item) => item.email.toLowerCase() === form.get("email").toLowerCase() && item.password === form.get("password"));
  if (!user) {
    renderLogin("Invalid email or password.");
    return;
  }
  setCurrentUser(user);
  go("dashboard");
}

function renderRegister(message = "") {
  if (!state.roleChoice) state.roleChoice = "PATIENT";
  const role = state.roleChoice;
  pageShell(`
    <main class="auth-wrap">
      <section class="card auth-card">
        <h1>Create account</h1>
        ${message ? `<div class="message ${message.includes("successful") ? "ok" : "bad"}">${escapeHtml(message)}</div>` : ""}
        <div class="role-tabs">
          ${["PATIENT", "DOCTOR", "CAREGIVER"].map((item) => `<button class="btn role-tab ${role === item ? "active" : ""}" onclick="chooseRole('${item}')">${item}</button>`).join("")}
        </div>
        <form onsubmit="registerSubmit(event)" class="form-grid">
          <input type="hidden" name="role" value="${role}">
          ${field("fullName", "Full name", "text", true)}
          ${field("email", "Email", "email", true)}
          ${field("password", "Password", "password", true)}
          ${field("phone", "Phone", "text", true)}
          ${selectField("gender", "Gender", ["Male", "Female", "Other"])}
          ${field("dateOfBirth", "Date of birth", "date")}
          ${field("address", "Address", "text", false, "field-full")}
          ${field("city", "City")}
          ${field("state", "State")}
          ${field("pincode", "Pincode")}
          ${roleFields(role)}
          <button class="btn btn-primary field-full" type="submit">Create account</button>
        </form>
      </section>
    </main>
  `);
}

function chooseRole(role) {
  state.roleChoice = role;
  renderRegister();
}

function field(name, label, type = "text", required = false, extraClass = "") {
  return `<div class="field ${extraClass}"><label>${label}${required ? " *" : ""}</label><input name="${name}" type="${type}" ${required ? "required" : ""}></div>`;
}

function selectField(name, label, options, required = false) {
  return `
    <div class="field">
      <label>${label}${required ? " *" : ""}</label>
      <select name="${name}" ${required ? "required" : ""}>
        <option value="">Select</option>
        ${options.map((option) => `<option value="${option}">${option}</option>`).join("")}
      </select>
    </div>
  `;
}

function roleFields(role) {
  if (role === "PATIENT") {
    return `
      ${selectField("bloodGroup", "Blood group", ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])}
      ${field("allergies", "Allergies")}
      ${field("emergencyContactName", "Emergency contact")}
      ${field("emergencyContactPhone", "Emergency phone")}
    `;
  }
  if (role === "DOCTOR") {
    return `
      ${selectField("specialization", "Specialization", ["General Physician", "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic", "Pediatrician", "Psychiatrist", "Dentist", "Other"], true)}
      ${field("qualification", "Qualification", "text", true)}
      ${field("experienceYears", "Experience years", "number")}
      ${field("licenseNumber", "License number", "text", true)}
      ${field("hospitalName", "Hospital name")}
      ${field("consultationFee", "Consultation fee", "number")}
    `;
  }
  return `
    ${selectField("relationWithPatient", "Relation with patient", ["Son", "Daughter", "Spouse", "Parent", "Sibling", "Nurse", "Other"], true)}
    ${field("assignedPatientId", "Assigned patient ID", "text", true)}
  `;
}

function registerSubmit(event) {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.target));
  const data = loadData();
  if (data.users.some((user) => user.email.toLowerCase() === form.email.toLowerCase())) {
    renderRegister("Email is already registered.");
    return;
  }
  const user = {
    id: uid("USR"),
    role: form.role,
    fullName: form.fullName,
    email: form.email,
    password: form.password,
    phone: form.phone,
    gender: form.gender,
    dateOfBirth: form.dateOfBirth,
    address: form.address,
    city: form.city,
    state: form.state,
    pincode: form.pincode
  };
  if (form.role === "PATIENT") {
    user.patientInfo = {
      patientId: uid("PAT"),
      bloodGroup: form.bloodGroup,
      allergies: form.allergies,
      emergencyContactName: form.emergencyContactName,
      emergencyContactPhone: form.emergencyContactPhone
    };
  }
  if (form.role === "DOCTOR") {
    user.doctorInfo = {
      specialization: form.specialization,
      qualification: form.qualification,
      experienceYears: Number(form.experienceYears || 0),
      licenseNumber: form.licenseNumber,
      hospitalName: form.hospitalName,
      consultationFee: Number(form.consultationFee || 0)
    };
  }
  if (form.role === "CAREGIVER") {
    user.caregiverInfo = {
      relationWithPatient: form.relationWithPatient,
      assignedPatientId: form.assignedPatientId
    };
  }
  data.users.push(user);
  saveData(data);
  renderLogin("Registration successful. Please login.");
}

function renderDashboard() {
  const user = currentUser();
  if (!user) return go("login");
  if (user.role === "PATIENT") return renderPatientDashboard(user);
  if (user.role === "DOCTOR") return renderDoctorDashboard(user);
  return renderCaregiverDashboard(user);
}

function userActions(user) {
  return `<span class="small muted">${escapeHtml(user.fullName)}</span><button class="btn btn-danger" onclick="logout()">Logout</button>`;
}

function renderPatientDashboard(user) {
  const p = user.patientInfo || {};
  pageShell(`
    <main class="section">
      <section class="card dashboard-head"><h1>Welcome, ${escapeHtml(user.fullName)}</h1><p>Patient dashboard - ${escapeHtml(p.patientId || "N/A")}</p></section>
      <div class="grid grid-2" style="margin-top:16px">
        ${infoCard("Profile", [["Email", user.email], ["Phone", user.phone], ["Gender", user.gender], ["DOB", user.dateOfBirth], ["City", user.city]])}
        ${infoCard("Medical info", [["Patient ID", p.patientId], ["Blood group", p.bloodGroup], ["Allergies", p.allergies], ["Emergency contact", p.emergencyContactName], ["Emergency phone", p.emergencyContactPhone]], "soft-blue")}
      </div>
      ${quickActions([
        ["My prescriptions", "RX", "prescriptions"],
        ["Today's medicines", "DOSE", "schedule"],
        ["Health report", "STAT", "schedule"],
        ["Logout", "OUT", "logout"]
      ])}
    </main>
  `, userActions(user));
}

function renderDoctorDashboard(user) {
  const d = user.doctorInfo || {};
  pageShell(`
    <main class="section">
      <section class="card dashboard-head doctor"><h1>Welcome, Dr. ${escapeHtml(user.fullName)}</h1><p>${escapeHtml(d.specialization || "Doctor")} - ${escapeHtml(d.hospitalName || "N/A")}</p></section>
      <div class="grid grid-2" style="margin-top:16px">
        ${infoCard("Profile", [["Email", user.email], ["Phone", user.phone], ["Gender", user.gender], ["City", user.city]])}
        ${infoCard("Professional", [["Specialization", d.specialization], ["Qualification", d.qualification], ["Experience", d.experienceYears ? `${d.experienceYears} years` : ""], ["License", d.licenseNumber], ["Hospital", d.hospitalName], ["Fee", d.consultationFee ? `Rs ${d.consultationFee}` : ""]], "soft-green")}
      </div>
      ${quickActions([
        ["New prescription", "ADD", "create-prescription"],
        ["My patients", "PTS", "doctor-patients"],
        ["Patient reports", "REP", "doctor-patients"],
        ["Logout", "OUT", "logout"]
      ])}
    </main>
  `, userActions(user));
}

function renderCaregiverDashboard(user) {
  const data = loadData();
  const c = user.caregiverInfo || {};
  const linked = patientByPatientId(data, c.assignedPatientId);
  pageShell(`
    <main class="section">
      <section class="card dashboard-head caregiver"><h1>Welcome, ${escapeHtml(user.fullName)}</h1><p>Caregiver - ${escapeHtml(c.relationWithPatient || "N/A")}</p></section>
      <div class="grid grid-2" style="margin-top:16px">
        ${infoCard("My profile", [["Email", user.email], ["Phone", user.phone], ["City", user.city], ["Relation", c.relationWithPatient], ["Assigned patient", c.assignedPatientId]])}
        ${linked ? infoCard("My patient", [["Name", linked.fullName], ["Phone", linked.phone], ["Patient ID", linked.patientInfo.patientId], ["Blood group", linked.patientInfo.bloodGroup]], "soft-violet") : `<article class="card soft-violet"><h3>No patient linked</h3><p class="muted">Check the assigned patient ID.</p></article>`}
      </div>
      ${quickActions([
        ["Patient details", "INFO", "caregiver-patient"],
        ["Medicine status", "DOSE", "caregiver-schedule"],
        ["Prescriptions", "RX", "caregiver-prescriptions"],
        ["Logout", "OUT", "logout"]
      ])}
    </main>
  `, userActions(user));
}

function infoCard(title, rows, cls = "") {
  return `<article class="card ${cls}"><h3 class="panel-title">${title}</h3>${rows.map(([label, value]) => `<div class="info-row"><span>${label}</span><span>${escapeHtml(value || "N/A")}</span></div>`).join("")}</article>`;
}

function quickActions(actions) {
  return `
    <section class="card" style="margin-top:16px">
      <h3 class="panel-title">Quick actions</h3>
      <div class="grid grid-4">
        ${actions.map(([label, symbol, route]) => `<button class="action-tile" onclick="${route === "logout" ? "logout()" : `go('${route}')`}"><span class="tile-symbol">${symbol}</span><b>${label}</b></button>`).join("")}
      </div>
    </section>
  `;
}

function patientByPatientId(data, patientId) {
  return data.users.find((user) => user.role === "PATIENT" && user.patientInfo?.patientId === patientId);
}

function doctorName(data, doctorId) {
  const doctor = data.users.find((user) => user.id === doctorId);
  return doctor ? doctor.fullName : "Unknown";
}

function renderCreatePrescription(message = "") {
  const user = currentUser();
  if (!user || user.role !== "DOCTOR") return go("dashboard");
  if (state.medicinesDraft.length === 0) {
    state.medicinesDraft = [{ name: "", dosage: "", timing: "MORNING", durationDays: 7, instructions: "" }];
  }
  pageShell(`
    <main class="section">
      <h1>Create prescription</h1>
      ${message ? `<div class="message ${message.includes("successful") ? "ok" : "bad"}">${escapeHtml(message)}</div>` : ""}
      <form onsubmit="savePrescription(event)">
        <section class="card">
          <h3 class="panel-title">Prescription details</h3>
          <div class="form-grid">
            ${field("patientId", "Patient ID", "text", true)}
            ${field("diagnosis", "Diagnosis", "text", true)}
            <div class="field field-full"><label>Notes</label><textarea name="notes" rows="3"></textarea></div>
          </div>
        </section>
        <section class="card" style="margin-top:16px">
          <div class="between"><h3 class="panel-title">Medicines</h3><button class="btn btn-soft" type="button" onclick="addMedicineDraft()">Add medicine</button></div>
          <div id="medicineDrafts">${medicineDraftHtml()}</div>
        </section>
        <button class="btn btn-primary" style="margin-top:16px;width:100%" type="submit">Create prescription</button>
      </form>
    </main>
  `, userActions(user));
}

function medicineDraftHtml() {
  return state.medicinesDraft.map((med, index) => `
    <div class="medicine-form">
      <div class="between">
        <b>Medicine ${index + 1}</b>
        ${state.medicinesDraft.length > 1 ? `<button class="btn" type="button" onclick="removeMedicineDraft(${index})">Remove</button>` : ""}
      </div>
      <div class="form-grid" style="margin-top:12px">
        <div class="field"><label>Name *</label><input name="medName${index}" required value="${escapeHtml(med.name)}"></div>
        <div class="field"><label>Dosage</label><input name="medDosage${index}" value="${escapeHtml(med.dosage)}"></div>
        <div class="field"><label>Timing</label><select name="medTiming${index}">${timingOptions(med.timing)}</select></div>
        <div class="field"><label>Duration days</label><input name="medDuration${index}" type="number" min="1" value="${escapeHtml(med.durationDays)}"></div>
        <div class="field field-full"><label>Instructions</label><input name="medInstructions${index}" value="${escapeHtml(med.instructions)}"></div>
      </div>
    </div>
  `).join("");
}

function timingOptions(selected) {
  return ["MORNING", "EVENING", "NIGHT", "MORNING_EVENING", "MORNING_NIGHT", "EVENING_NIGHT", "MORNING_EVENING_NIGHT"]
    .map((value) => `<option value="${value}" ${selected === value ? "selected" : ""}>${value.replaceAll("_", " & ")}</option>`)
    .join("");
}

function addMedicineDraft() {
  state.medicinesDraft.push({ name: "", dosage: "", timing: "MORNING", durationDays: 7, instructions: "" });
  renderCreatePrescription();
}

function removeMedicineDraft(index) {
  state.medicinesDraft.splice(index, 1);
  renderCreatePrescription();
}

function savePrescription(event) {
  event.preventDefault();
  const user = currentUser();
  const form = Object.fromEntries(new FormData(event.target));
  const data = loadData();
  const patient = patientByPatientId(data, form.patientId);
  if (!patient) {
    renderCreatePrescription("Patient ID not found.");
    return;
  }
  const medicines = state.medicinesDraft.map((_, index) => ({
    id: uid("MED"),
    name: form[`medName${index}`],
    dosage: form[`medDosage${index}`],
    timing: form[`medTiming${index}`],
    durationDays: Number(form[`medDuration${index}`] || 1),
    instructions: form[`medInstructions${index}`],
    startDate: today()
  }));
  data.prescriptions.push({
    id: uid("RX"),
    doctorId: user.id,
    patientId: form.patientId,
    diagnosis: form.diagnosis,
    notes: form.notes,
    createdDate: today(),
    status: "ACTIVE",
    medicines
  });
  saveData(data);
  state.medicinesDraft = [];
  renderCreatePrescription("Prescription created successfully.");
}

function prescriptionsFor(patientId) {
  const data = loadData();
  return data.prescriptions
    .filter((rx) => rx.patientId === patientId)
    .map((rx) => ({ ...rx, doctorName: doctorName(data, rx.doctorId) }));
}

function renderPrescriptions(patientId, title = "My prescriptions") {
  const user = currentUser();
  if (!user) return go("login");
  const list = prescriptionsFor(patientId);
  pageShell(`
    <main class="section">
      <h1>${title}</h1>
      <div class="list">
        ${list.length ? list.map(prescriptionCard).join("") : `<article class="card empty">No prescriptions yet.</article>`}
      </div>
    </main>
  `, userActions(user));
}

function prescriptionCard(rx) {
  return `
    <article class="card">
      <div class="between">
        <div><h3 class="panel-title">${escapeHtml(rx.diagnosis)}</h3><p class="small muted">By Dr. ${escapeHtml(rx.doctorName)} - ${escapeHtml(rx.createdDate)}</p></div>
        <span class="badge green">${escapeHtml(rx.status)}</span>
      </div>
      ${rx.notes ? `<p>${escapeHtml(rx.notes)}</p>` : ""}
      <div class="list">
        ${rx.medicines.map((med) => `
          <div class="schedule-row">
            <div><b>${escapeHtml(med.name)}</b><p class="small muted">${escapeHtml(med.dosage || "N/A")} - ${escapeHtml(med.timing.replaceAll("_", " & "))} - ${escapeHtml(med.durationDays)} days</p></div>
            <span class="small muted">${escapeHtml(med.instructions || "")}</span>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function medicineSlots(patientId) {
  const data = loadData();
  const slots = { MORNING: [], EVENING: [], NIGHT: [] };
  data.prescriptions.filter((rx) => rx.patientId === patientId && rx.status === "ACTIVE").forEach((rx) => {
    rx.medicines.forEach((med) => {
      Object.keys(slots).forEach((slot) => {
        if (med.timing.includes(slot)) {
          const log = data.logs.find((item) => item.patientId === patientId && item.medicineId === med.id && item.date === today() && item.timing === slot);
          slots[slot].push({ ...med, status: log?.status || "PENDING", slot });
        }
      });
    });
  });
  return slots;
}

function statsFor(patientId) {
  const logs = loadData().logs.filter((log) => log.patientId === patientId);
  const taken = logs.filter((log) => log.status === "TAKEN").length;
  const missed = logs.filter((log) => log.status === "MISSED").length;
  const totalDoses = taken + missed;
  return { taken, missed, totalDoses, adherencePercentage: totalDoses ? Math.round((taken / totalDoses) * 100) : 0 };
}

function renderSchedule(patientId, canMark, title = "Today's schedule") {
  const user = currentUser();
  if (!user) return go("login");
  const slots = medicineSlots(patientId);
  const stats = statsFor(patientId);
  pageShell(`
    <main class="section">
      <h1>${title}</h1>
      <p class="muted">${today()}</p>
      ${statsCards(stats)}
      ${["MORNING", "EVENING", "NIGHT"].map((slot) => slotCard(slot, slots[slot], patientId, canMark)).join("")}
      ${!slots.MORNING.length && !slots.EVENING.length && !slots.NIGHT.length ? `<article class="card empty">No medicines scheduled for today.</article>` : ""}
    </main>
  `, userActions(user));
}

function statsCards(stats) {
  return `
    <div class="grid grid-3" style="margin:16px 0">
      <article class="card soft-green"><h2>${stats.taken}</h2><p>Taken</p></article>
      <article class="card soft-red"><h2>${stats.missed}</h2><p>Missed</p></article>
      <article class="card soft-blue"><h2>${stats.adherencePercentage}%</h2><p>Adherence</p></article>
    </div>
  `;
}

function slotCard(slot, meds, patientId, canMark) {
  if (!meds.length) return "";
  return `
    <section class="card">
      <h3 class="panel-title">${slot.charAt(0)}${slot.slice(1).toLowerCase()}</h3>
      ${meds.map((med) => `
        <div class="schedule-row">
          <div><b>${escapeHtml(med.name)}</b><p class="small muted">${escapeHtml(med.dosage || "N/A")} - ${escapeHtml(med.instructions || "")}</p></div>
          ${statusArea(med, patientId, canMark)}
        </div>
      `).join("")}
    </section>
  `;
}

function statusArea(med, patientId, canMark) {
  if (med.status !== "PENDING" || !canMark) {
    const cls = med.status === "TAKEN" ? "green" : med.status === "MISSED" ? "red" : "yellow";
    return `<span class="badge ${cls}">${med.status}</span>`;
  }
  return `<div class="nav-actions"><button class="btn btn-green" onclick="markDose('${patientId}','${med.id}','${med.slot}','TAKEN')">Taken</button><button class="btn btn-red" onclick="markDose('${patientId}','${med.id}','${med.slot}','MISSED')">Missed</button></div>`;
}

function markDose(patientId, medicineId, timing, status) {
  const data = loadData();
  const existing = data.logs.find((log) => log.patientId === patientId && log.medicineId === medicineId && log.date === today() && log.timing === timing);
  if (existing) existing.status = status;
  else data.logs.push({ patientId, medicineId, date: today(), timing, status });
  saveData(data);
  renderSchedule(patientId, true);
}

function renderDoctorPatients() {
  const user = currentUser();
  if (!user || user.role !== "DOCTOR") return go("dashboard");
  const data = loadData();
  const patientIds = [...new Set(data.prescriptions.filter((rx) => rx.doctorId === user.id).map((rx) => rx.patientId))];
  const patients = patientIds.map((id) => patientByPatientId(data, id)).filter(Boolean);
  pageShell(`
    <main class="section">
      <h1>My patients</h1>
      <div class="grid grid-2">
        ${patients.length ? patients.map((patient) => patientCard(patient, data)).join("") : `<article class="card empty">No patients yet. Create a prescription first.</article>`}
      </div>
    </main>
  `, userActions(user));
}

function patientCard(patient, data) {
  const p = patient.patientInfo;
  const count = data.prescriptions.filter((rx) => rx.patientId === p.patientId).length;
  return `
    <article class="card">
      <div class="between"><div><h3>${escapeHtml(patient.fullName)}</h3><p class="small muted">${escapeHtml(p.patientId)}</p></div><span class="badge red">${escapeHtml(p.bloodGroup || "N/A")}</span></div>
      ${infoRows([["Phone", patient.phone], ["Email", patient.email], ["City", patient.city], ["Prescriptions", count], ["Allergies", p.allergies || "None"]])}
      <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="go('patient-report',{patientId:'${p.patientId}'})">View report</button>
    </article>
  `;
}

function infoRows(rows) {
  return rows.map(([label, value]) => `<div class="info-row"><span>${label}</span><span>${escapeHtml(value || "N/A")}</span></div>`).join("");
}

function renderPatientReport(patientId) {
  const user = currentUser();
  if (!user) return go("login");
  const data = loadData();
  const patient = patientByPatientId(data, patientId);
  if (!patient) {
    pageShell(`<main class="section"><article class="card empty">Patient not found.</article></main>`, userActions(user));
    return;
  }
  const stats = statsFor(patientId);
  const rxCount = data.prescriptions.filter((rx) => rx.patientId === patientId).length;
  const percent = stats.adherencePercentage;
  pageShell(`
    <main class="section">
      <section class="card dashboard-head">
        <h1>${escapeHtml(patient.fullName)}</h1>
        <p>${escapeHtml(patientId)} - ${escapeHtml(patient.patientInfo.bloodGroup || "N/A")} - ${rxCount} prescriptions</p>
      </section>
      ${statsCards(stats)}
      <section class="card">
        <h3 class="panel-title">Adherence progress</h3>
        <div class="progress"><div style="width:${percent}%"></div></div>
        <p class="muted">${percent >= 80 ? "Excellent adherence" : percent >= 50 ? "Moderate adherence" : "Needs improvement"}</p>
      </section>
      <section class="card" style="margin-top:16px">
        <h3 class="panel-title">Recent medication history</h3>
        ${data.logs.filter((log) => log.patientId === patientId).slice(-8).reverse().map((log) => logRow(log, data)).join("") || `<p class="muted">No medication history yet.</p>`}
      </section>
    </main>
  `, userActions(user));
}

function logRow(log, data) {
  const med = data.prescriptions.flatMap((rx) => rx.medicines).find((item) => item.id === log.medicineId);
  return `<div class="schedule-row"><div><b>${escapeHtml(med?.name || "Medicine")}</b><p class="small muted">${escapeHtml(log.date)} - ${escapeHtml(log.timing)}</p></div><span class="badge ${log.status === "TAKEN" ? "green" : "red"}">${escapeHtml(log.status)}</span></div>`;
}

function renderCaregiverPatient() {
  const user = currentUser();
  if (!user || user.role !== "CAREGIVER") return go("dashboard");
  const data = loadData();
  const patientId = user.caregiverInfo?.assignedPatientId;
  const patient = patientByPatientId(data, patientId);
  const stats = statsFor(patientId);
  pageShell(`
    <main class="section">
      <h1>Patient details</h1>
      ${patient ? `
        <div class="grid grid-2">
          ${infoCard("Personal information", [["Full name", patient.fullName], ["Phone", patient.phone], ["Email", patient.email], ["Gender", patient.gender], ["Date of birth", patient.dateOfBirth], ["City", patient.city]])}
          ${infoCard("Medical information", [["Patient ID", patient.patientInfo.patientId], ["Blood group", patient.patientInfo.bloodGroup], ["Allergies", patient.patientInfo.allergies || "None"], ["Emergency contact", patient.patientInfo.emergencyContactName], ["Emergency phone", patient.patientInfo.emergencyContactPhone]], "soft-blue")}
        </div>
        ${statsCards(stats)}
      ` : `<article class="card empty">Patient not found.</article>`}
    </main>
  `, userActions(user));
}

function renderRoute() {
  const route = routeInfo();
  const user = currentUser();
  if (route.name === "home") return renderHome();
  if (route.name === "login") return renderLogin();
  if (route.name === "register") return renderRegister();
  if (route.name === "dashboard") return renderDashboard();
  if (route.name === "create-prescription") return renderCreatePrescription();
  if (route.name === "doctor-patients") return renderDoctorPatients();
  if (route.name === "patient-report") return renderPatientReport(route.params.patientId);
  if (route.name === "prescriptions") return user?.patientInfo ? renderPrescriptions(user.patientInfo.patientId) : go("dashboard");
  if (route.name === "schedule") return user?.patientInfo ? renderSchedule(user.patientInfo.patientId, true) : go("dashboard");
  if (route.name === "caregiver-patient") return renderCaregiverPatient();
  if (route.name === "caregiver-schedule") return user?.caregiverInfo ? renderSchedule(user.caregiverInfo.assignedPatientId, false, "Medicine status") : go("dashboard");
  if (route.name === "caregiver-prescriptions") return user?.caregiverInfo ? renderPrescriptions(user.caregiverInfo.assignedPatientId, "Prescriptions") : go("dashboard");
  renderHome();
}

window.addEventListener("hashchange", renderRoute);
window.addEventListener("DOMContentLoaded", renderRoute);
