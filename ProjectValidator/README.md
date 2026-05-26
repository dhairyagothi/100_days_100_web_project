# 🔍 Project Validator — Automated Demo & Path Validation System

Fixes #4198

## 📌 What is this?
A lightweight automated validation system that scans all 112+ projects
in this repository and checks for common issues like missing files,
broken asset paths, and empty folders.

## 📁 Files
| File | Purpose |
|------|---------|
| `validate.js` | Node.js script — scans all projects |
| `report.html` | Visual report dashboard in browser |
| `validation-report.json` | Auto-generated after running script |

## 🚀 How to Run

### Step 1 — Go to ProjectValidator folder
```bash
cd ProjectValidator
```

### Step 2 — Run the validator
```bash
node validate.js
```

### Step 3 — View visual report
Open `report.html` in browser

## ✅ What it Checks
- Missing `index.html` in project folders
- Empty project folders
- Broken asset paths (`src` references)
- Generates JSON report automatically

## 📊 Sample Output
```
🔍 Starting Project Validation...
✅ PASS: Calculator
✅ PASS: TodoApp
❌ FAIL: BrokenProject
   ⚠️  Missing: index.html
==================================================
📊 VALIDATION SUMMARY
Total Projects : 112
✅ Passed      : 98
❌ Failed      : 14
```