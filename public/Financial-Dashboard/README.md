# Financial Dashboard - Budget Tracker

A simple yet elegant budget tracking application with real-time pie chart visualization for managing personal expenses across multiple categories.

## Description

The Financial Dashboard is an intuitive budget management tool designed for quick expense tracking. Add expenses to predefined categories (Food, Rent, Fun) and watch a dynamic pie chart update in real-time to visualize your spending breakdown. Perfect for personal finance management, learning Chart.js, or building intuition about spending habits with instant visual feedback.

## Features

- **Easy Entry Input**: Simple text and number fields for category and amount
- **Predefined Categories**: Food, Rent, Fun (can be extended)
- **Real-Time Visualization**: Pie chart updates instantly as you add entries
- **Category Tracking**: Accumulated totals per category displayed in chart
- **Input Validation**: Alerts if invalid category is entered
- **Dynamic Data Updates**: Chart recalculates and re-renders on every entry
- **Beautiful UI**:
  - Gradient background with floating blur effects
  - Glass-morphism dashboard design
  - Smooth hover animations
  - Responsive layout for mobile and desktop
- **Color-Coded Categories**: Each category has distinct color in pie chart (red, blue, yellow)
- **Professional Styling**: 
  - Shadow effects
  - Rounded corners
  - Gradient text for title
  - Smooth transitions and animations
- **Mobile Responsive**: Adapts layout for screens < 768px
- **No Backend Required**: Pure client-side application

## Tech Stack

- **HTML5** — semantic structure, form inputs
- **CSS3** — gradients, backdrop-filter, animations, responsive design, flexbox, box-shadows
- **Vanilla JavaScript (ES6)** — DOM manipulation, event handling, object manipulation
- **Chart.js** — pie chart visualization and dynamic updates (via CDN)

## Folder Structure

```text
Financial-Dashboard/
│
├── index.html      # Single-file app — structure, styling, logic, chart
└── README.md       # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required (Chart.js loaded via CDN).

### Option 1: Open Directly
1. Navigate to the `Financial-Dashboard` folder.
2. Double-click `index.html` to open in your browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Adding Expenses

1. **Enter Category**: Type one of the valid categories in the first input:
   - Food
   - Rent
   - Fun
2. **Enter Amount**: Type the expense amount (number) in the second input
3. **Add Entry**: Click the "Add Entry" button
4. **Chart Updates**: Pie chart instantly updates to show new totals

### Understanding the Display

**Pie Chart Breakdown**:
- **Red Slice** (Food): Total food expenses
- **Blue Slice** (Rent): Total rent/housing expenses
- **Yellow Slice** (Fun): Total entertainment/fun expenses
- Slices resize proportionally as you add entries

### Example Workflow

```
1. Enter: "Food" | "15.50" → Click Add Entry
   Chart shows: Food 15.50 (100% initially)

2. Enter: "Rent" | "500" → Click Add Entry
   Chart updates: Food 15.50 (3%), Rent 500 (97%)

3. Enter: "Fun" | "25" → Click Add Entry
   Chart updates: Food 15.50 (2.9%), Rent 500 (93.7%), Fun 25 (3.7%)
```

### Validating Input

**Valid Entry**:
- Category must match exactly: "Food", "Rent", or "Fun"
- Amount must be a valid number
- Success: Chart updates with new data

**Invalid Entry**:
- Wrong category name (e.g., "Groceries", "Electricity")
- Error: Alert displays "Please use: Food, Rent, or Fun"
- Chart remains unchanged

## How It Works

### Data Structure

```javascript
let expenses = { 
    Food: 0,
    Rent: 0,
    Fun: 0
};
```

Expenses stored in object with categories as keys and cumulative amounts as values.

### Chart Initialization

```javascript
const chart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: Object.keys(expenses),           // Category names
        datasets: [{
            data: Object.values(expenses),        // Current amounts
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']  // Colors
        }]
    }
});
```

Chart.js creates pie chart with initial data structure. Data is bound to expenses object.

### Adding Entries

```javascript
function addEntry() {
    const cat = document.getElementById('category').value;
    const amt = parseFloat(document.getElementById('amount').value);
    
    if (expenses.hasOwnProperty(cat)) {
        expenses[cat] += amt;                    // Add to category
        chart.data.datasets[0].data = Object.values(expenses);  // Update chart data
        chart.update();                          // Re-render chart
    } else {
        alert("Please use: Food, Rent, or Fun");
    }
}
```

Process:
1. Read inputs from form fields
2. Check if category exists in expenses object
3. Add amount to category total
4. Extract new values from expenses object
5. Update chart dataset with new values
6. Call `chart.update()` to re-render chart

### Dynamic Chart Updates

The key to real-time updates:
```javascript
chart.data.datasets[0].data = Object.values(expenses);
chart.update();
```

By updating the `data` array and calling `update()`, Chart.js animates the pie slices to their new proportions instantly.

## Implementation Notes

- **Object Property Check**: `hasOwnProperty()` validates category exists before adding
- **parseFloat()**: Converts string input to number for calculations
- **Object Methods**: `Object.keys()` and `Object.values()` dynamically sync with data structure
- **Chart Reference**: Single chart instance persists across function calls for seamless updates
- **Input Binding**: No dedicated state management; chart data tied directly to expenses object
- **CSS Architecture**: Multiple overlapping CSS blocks create cascading overrides (final version wins)
- **Responsive Images**: Canvas element scales responsively with viewport
- **Backdrop Filter**: Creates glass-morphism effect on dashboard card

## Educational Value

This project demonstrates:

- Chart.js library integration and pie chart creation
- Dynamic chart data updates without page reload
- Object manipulation in JavaScript
- Form input validation
- Function calls tied to button clicks
- Real-time DOM updates
- Gradient backgrounds and animations
- Responsive design with media queries
- CSS variable usage
- Backdrop-filter for modern UI effects
- JavaScript object properties and methods

## Common Use Cases

**Personal Budget Tracking**:
1. Start day with fresh page
2. Add expenses throughout the day
3. See spending breakdown at glance
4. Identify which category dominates

**Learning Chart.js**:
1. See how Chart.js initializes
2. Understand dynamic data updates
3. Learn pie chart customization
4. Practice with real-time rendering

**Expense Management**:
1. Track spending by category
2. Visualize budget allocation
3. Make informed spending decisions
4. Monitor overspending in specific areas

## Limitations & Considerations

- **Fixed Categories**: Only Food, Rent, Fun (hardcoded)
- **No Persistence**: Data resets on page refresh
- **No History**: Cannot view past entries or trends
- **Single Session**: No way to export or save data
- **No Edit/Delete**: Cannot modify entries after adding
- **Positive Values Only**: No support for income or refunds
- **No Calculations**: No running totals or budget limits

## Future Enhancements

Potential improvements:

- **Custom Categories**: Allow users to add/remove categories
- **localStorage Persistence**: Save data between sessions
- **Edit/Delete Entries**: Modify or remove past entries
- **Monthly Budgets**: Set and track budget limits per category
- **Historical Tracking**: View expenses over weeks/months
- **Export Data**: Download expense data as CSV or PDF
- **Multiple Charts**: Bar chart, line graph for trends
- **Budget Alerts**: Notify when approaching budget limits
- **Income Tracking**: Record income alongside expenses
- **Currency Support**: Format amounts in different currencies
- **Notes Field**: Add descriptions to entries
- **Date Tracking**: Record when each expense occurred
- **Category Goals**: Set spending targets per category
- **Dark Mode**: Theme toggle for dark/light modes
- **Data Import**: Load data from files

## Advanced Modifications

**Adding New Categories**:

```javascript
// 1. Add to expenses object
let expenses = { 
    Food: 0,
    Rent: 0,
    Fun: 0,
    Transportation: 0  // New category
};

// 2. Add color to array
backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0']
```

**Persisting Data**:

```javascript
// Save on every entry
function addEntry() {
    // ... existing code ...
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Load on page load
window.addEventListener('load', () => {
    const saved = localStorage.getItem('expenses');
    if (saved) expenses = JSON.parse(saved);
});
```

**Form Submission**:

```html
<!-- Use form instead of button -->
<form onsubmit="addEntry(event)">
    <input type="text" id="category">
    <input type="number" id="amount">
    <button type="submit">Add Entry</button>
</form>

<script>
function addEntry(e) {
    e.preventDefault();
    // ... existing logic ...
}
</script>
```

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript
- CSS Grid and Flexbox
- CSS custom properties
- Canvas API (for Chart.js)

**Tested on**: Chrome, Firefox, Safari, Edge

## Performance Notes

- **Lightweight**: Single-file application, minimal dependencies
- **Chart.js**: Well-optimized charting library
- **Real-Time Updates**: Animation handled efficiently by Chart.js
- **No Memory Leaks**: Single chart instance reused

## Accessibility

- Clear input labels as placeholders
- Large, tappable buttons for mobile
- Color-coded categories with labeled chart
- Alert feedback for invalid input
- Semantic HTML structure

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
