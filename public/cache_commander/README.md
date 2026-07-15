# Cache Commander ── Advanced OS Simulation Matrix

Cache Commander is an interactive, zero-dependency web simulation engine designed to demystify lower-level CPU memory architectures and operating system resource paging structures. The dashboard translates abstract memory operations into a real-time gamified tracking workspace, mapping hardware cache optimization policies onto a predictable data lane.

---

## 🛠️ The Core Architectural Concepts

An operating system uses cache lines to store small sets of fast-access storage objects so the processor can bypass reading from slow primary disk blocks. This simulator explicitly implements three deterministic, real-time page-replacement strategies alongside analytics monitoring boards:

### 1. FIFO (First-In, First-Out)
* **The Rule:** The oldest element added to the cache is the first to be dropped when space runs out.
* **Tracking State:** Monitors a progressive timestamp parameter (`insertedAt`). It does not care how many times an element is hit or when it was last updated; eviction is strictly a factor of linear timeline age.

### 2. LRU (Least Recently Used)
* **The Rule:** Discards the data element that has gone unreferenced for the longest period of time.
* **Tracking State:** Updates an access clock metric (`lastAccessed`) whenever a hit occurs on an existing slot. The algorithm checks this array value to drop the least active item, aligning with the principle of temporal locality.

### 3. LFU (Least Frequently Used)
* **The Rule:** Evicts the item that has accumulated the fewest references over the lifetime of the cache runtime block.
* **Tracking State:** Increments a frequency count register (`frequency`) every time a hit occurs. When a cache miss triggers an eviction loop, it targets the lowest hit counter.

---

## 🏎️ Scoring & Game Balance Subroutines

The system applies an iterative penalty/reward loop to simulate software execution efficiency:
* **Cache Hit (+10 pts):** Data is already allocated in a high-speed lane. Execution operates at maximum velocity without latency spikes.
* **Cache Miss (-5 pts):** The request fails to resolve locally. The simulation experiences a blocking delay while fetching records from main memory, and an eviction event occurs if the 4-slot cache layout is fully saturated.

---

## 📁 Technical Folder Structure

```text
./public/cache_commander/
├── index.html   # Semantic dashboard wireframe, control hooks, and HUD panels
├── style.css    # Retro neon cybersecurity cyber-grid layout and responsive layers
└── script.js    # Core state mechanics, tracking vectors, and $O(N)$ eviction linear loops