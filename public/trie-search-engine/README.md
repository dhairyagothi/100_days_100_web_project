# 🚀 High-Throughput Trie Prefix Search Engine

A high-performance prefix search engine built using a **Trie (Prefix Tree)** data structure. The project demonstrates fast auto-complete and prefix-based searching by indexing thousands of records into memory and retrieving matching results in real time.

## ✨ Features

* ⚡ Fast prefix search using a Trie data structure
* 🔍 Real-time auto-complete suggestions
* 📦 Indexes **50,000** sample records
* 🧠 Efficient O(K) prefix traversal (where K is the query length)
* 🎨 Modern responsive dark-themed UI
* 📱 Responsive design for desktop and mobile
* 📊 Displays query execution time and number of matches
* 🧩 Modular JavaScript architecture using ES Modules

## 📂 Project Structure

```
.
├── index.html          # Main webpage
├── style.css           # Application styling
├── app.js              # UI logic and Trie interaction
├── trieKernel.js       # Trie implementation
├── image.png
└── README.md
```

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (ES6 Modules)

## ⚙️ How It Works

1. Creates a Trie data structure.
2. Generates 50,000 sample company and role records.
3. Inserts searchable keywords into the Trie.
4. As the user types, the application:

   * Traverses the Trie using the entered prefix.
   * Collects matching records.
   * Displays the top 10 results instantly.
   * Shows the query execution time.

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```

### Navigate to the project

```bash
cd trie-search-engine
```

### Run the project

Because this project uses ES Modules (`type="module"`), it should be served using a local server.

Examples:

Using VS Code Live Server:

* Install the **Live Server** extension.
* Right-click `index.html`.
* Select **Open with Live Server**.

Or using Python:

```bash
python -m http.server
```

Then open:

```
http://localhost:8000
```

## 📈 Time Complexity

| Operation       | Complexity |
| --------------- | ---------- |
| Insert          | O(L)       |
| Prefix Search   | O(K)       |
| Collect Matches | O(M)       |

Where:

* **L** = Length of inserted word
* **K** = Length of search prefix
* **M** = Number of matching records

## 🎯 Sample Search Queries

Try searching for:

* Google
* Meta
* Amazon
* OpenAI
* Microsoft
* Data
* Systems
* Frontend
* Kernel
* AI

## 💡 Future Improvements

* Fuzzy search
* Ranked search results
* Compressed (Radix) Trie
* Search history
* Keyboard navigation
* Highlight matched prefixes
* Dynamic dataset loading
* Unit tests
* Performance benchmarking

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using JavaScript and Trie data structures.
