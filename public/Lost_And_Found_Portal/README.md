# 🔍 Lost & Found Portal

## Technical Architecture & System Documentation

---

# Summary

The Lost & Found Portal is a serverless, client-side community platform designed to seamlessly log, browse, and reunite people with their lost belongings. It utilizes optimized local storage paradigms, HTML5 canvas image compression, and dynamic dashboard rendering to deliver a robust user experience without a backend database.

---

# System Architecture

```text
┌─────────────────┐
│    User Layer   │
└────────┬────────┘
         │
┌────────▼────────┐
│ UI & Theme Core │
└────────┬────────┘
         │
┌────────▼────────┐
│ Search & Filter │
└────────┬────────┘
         │
┌────────▼────────┐
│  State Manager  │
└────────┬────────┘
         │
┌────────▼────────┐
│ Rendering Layer │
└─────────────────┘
```

---

# Application Modules

| Module          | Responsibility                                    |
| --------------- | ------------------------------------------------- |
| Home Engine     | Dynamic metric tracking & recent listings         |
| Browse Engine   | Multi-tier search and category filtering          |
| Report Engine   | Lost & Found form processing                      |
| Detail Renderer | Individual item view and resolution handling      |
| State Manager   | localStorage synchronization & canvas compression |

---

# Component Dependency Graph

```text
index.html
    │
    ├─ View: Home
    ├─ View: Browse
    ├─ View: Report Lost/Found
    ├─ View: Item Details
    │
script.js
    │
style.css
```

---

# Rendering Pipeline

```text
User Action (Report / Claim)
     ↓
Event Listener Triggered
     ↓
JavaScript Data Processing
     ↓
LocalStorage Sync & Compression
     ↓
DOM UI Rendering
```

---

# State Management Layer

The Lost & Found Portal uses purely client-side state management through:

* localStorage persistence API
* DOM state & Glassmorphic CSS variables
* JavaScript Class encapsulation (LostAndFoundApp)
* Event-driven view switching

---

# Data Schema

```json
{
  "item": {
    "id": "1719253452000",
    "type": "lost | found",
    "name": "Black Leather Wallet",
    "category": "wallet | electronics | keys...",
    "date": "2026-06-24",
    "location": "Central Park",
    "description": "Distinguishing features...",
    "contact": "user@example.com",
    "image": "data:image/jpeg;base64,...",
    "reportedAt": "2026-06-24T14:20:52.000Z",
    "status": "active | reunited"
  }
}
```

---

# Search Processing Engine

* User inputs query or selects category filter
* JavaScript validates input against the active data array
* Engine cross-references **Name, Description, and Location**
* Active (`status !== 'reunited'`) matching items are filtered
* DOM Grid dynamically renders results

---

# Item Resolution Pipeline

```text
Active Report View
        ↓
User Clicks "Mark Reunited"
        ↓
Status Override ('reunited')
        ↓
Data Array Saved to State
        ↓
Dashboard Metrics Recalculated
```

---

# Item Detail Engine

**Responsibilities:**

* High-fidelity image rendering
* Metadata display (Date, Location, Category)
* Contact parsing & `mailto:` routing
* Item resolution workflow tracking

---

# Responsive Design Architecture

| Device  | Support |
| ------- | ------- |
| Desktop | ✅       |
| Laptop  | ✅       |
| Tablet  | ✅       |
| Mobile  | ✅       |

---

# Performance Characteristics

* Native Canvas Compression: Compresses 5MB+ image uploads by up to **90%** to prevent `QuotaExceededError` crashes
* Lightweight vanilla architecture (Zero dependencies)
* Minimal JavaScript overhead
* Instantaneous DOM view switching

---

# Scalability Opportunities

* Backend database migration (Node.js / MongoDB)
* User authentication & accounts
* Geo-location Maps API integration
* Automated email matching alerts

---

# Security Considerations

* Input regex validation (Email & Phone format enforcement)
* Date-picker restriction limits (No future dates allowed)
* Strict DOM element generation to prevent XSS

---

# Developer Quick Start

```bash
git clone repository-url
cd Lost_And_Found_Portal
```

**Run:**

```bash
# Recommended: Open via Live Server to allow 
# proper window.location.host validation and localStorage execution.
```

Open `index.html` via Live Server extension

---

# Project Structure

```text
Lost_And_Found_Portal
│
├── index.html
├── script.js
├── style.css
└── README.md
```

---

# Future Roadmap

* Interactive maps for item locations
* In-app messaging system
* Community reputation scores
* Social media share integration

---

# Contribution Workflow

```text
Fork
  ↓
Branch
  ↓
Commit
  ↓
Push
  ↓
Pull Request
```

---

# License

Open-source educational project.

---

# Maintainer Notes

This documentation serves as both a structural blueprint and a technical reference for managing the client-side state pipeline.

---

**Built for 100 Days 100 Web Projects**

⭐ Star the repository if you found it useful.