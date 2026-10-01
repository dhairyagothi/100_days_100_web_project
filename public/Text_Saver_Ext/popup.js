// ===============================
// Storage Helper
// ===============================

function getStorage() {
  if (
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.local
  ) {
    return {
      get(defaults, callback) {
        chrome.storage.local.get(defaults, callback);
      },

      set(data, callback) {
        chrome.storage.local.set(data, callback);
      }
    };
  }

  // Fallback for normal webpages
  return {
    get(defaults, callback) {
      const result = {};

      Object.keys(defaults).forEach(key => {
        try {
          const stored = localStorage.getItem(key);

          result[key] = stored
            ? JSON.parse(stored)
            : defaults[key];
        } catch {
          result[key] = defaults[key];
        }
      });

      callback(result);
    },

    set(data, callback) {
      Object.keys(data).forEach(key => {
        localStorage.setItem(
          key,
          JSON.stringify(data[key])
        );
      });

      if (callback) callback();
    }
  };
}

const storage = getStorage();

let allSavedTexts = [];

// ===============================
// Render Saved Texts
// ===============================

function render(filter = "") {
  storage.get(
    {
      savedTexts: []
    },
    (result) => {
      allSavedTexts = result.savedTexts || [];

      const textList =
        document.getElementById("textList");

      const itemCount =
        document.getElementById("itemCount");

      if (!textList) return;

      if (itemCount) {
        itemCount.textContent =
          `${allSavedTexts.length} item${allSavedTexts.length !== 1 ? "s" : ""}`;
      }

      const filteredTexts =
        allSavedTexts.filter(item => {
          const text =
            String(item.text || "").toLowerCase();

          const url =
            String(item.url || "").toLowerCase();

          const search =
            filter.toLowerCase();

          return (
            text.includes(search) ||
            url.includes(search)
          );
        });

      textList.innerHTML = "";

      if (filteredTexts.length === 0) {
        textList.innerHTML = `
          <div class="empty">
            No saved texts found
          </div>
        `;
        return;
      }

      filteredTexts.forEach((item, index) => {
        const div =
          document.createElement("div");

        div.className = "text-entry";

        div.innerHTML = `
  <div class="saved-text">
    ${escapeHtml(item.text || "")}
  </div>

  <a
    class="url"
    href="${item.url}"
    target="_blank"
  >
    🌐 ${item.url}
  </a>

  <div class="card-actions">
    <button class="card-btn copy-btn">
      Copy
    </button>

    <button class="card-btn delete-btn">
      Delete
    </button>
  </div>
`;

        // Double-click to delete
        div.addEventListener("dblclick", () => {
          deleteItem(index);
        });

        textList.appendChild(div);
      });
    }
  );
}

// ===============================
// Delete Item
// ===============================

function deleteItem(index) {
  const confirmed =
    confirm("Delete this saved text?");

  if (!confirmed) return;

  allSavedTexts.splice(index, 1);

  storage.set(
    {
      savedTexts: allSavedTexts
    },
    () => {
      render();
    }
  );
}

// ===============================
// Clear All
// ===============================

function clearAll() {
  const confirmed =
    confirm("Delete ALL saved texts?");

  if (!confirmed) return;

  storage.set(
    {
      savedTexts: []
    },
    () => {
      render();
    }
  );
}

// ===============================
// Export TXT
// ===============================

function exportTexts() {
  storage.get(
    {
      savedTexts: []
    },
    (result) => {
      const data =
        result.savedTexts || [];

      if (data.length === 0) {
        alert("No saved texts available.");
        return;
      }

      let output =
        "===== TEXT SAVER EXPORT =====\n\n";

      data.forEach((item, index) => {
        output +=
          `[${index + 1}]
URL: ${item.url || ""}

TEXT:
${item.text || ""}

------------------------------------

`;
      });

      const blob = new Blob(
        [output],
        {
          type: "text/plain"
        }
      );

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;
      a.download = "saved-texts.txt";

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    }
  );
}

// ===============================
// Escape HTML
// ===============================

function escapeHtml(text) {
  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// ===============================
// DOM Ready
// ===============================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    render();

    const searchInput =
      document.getElementById("searchInput");

    const clearButton =
      document.getElementById("clearButton");

    const downloadButton =
      document.getElementById("downloadButton");

    if (searchInput) {
      searchInput.addEventListener(
        "input",
        (e) => {
          render(e.target.value);
        }
      );
    }

    if (clearButton) {
      clearButton.addEventListener(
        "click",
        clearAll
      );
    }

    if (downloadButton) {
      downloadButton.addEventListener(
        "click",
        exportTexts
      );
    }
  }
);

const copyBtn =
  div.querySelector(".copy-btn");

const deleteBtn =
  div.querySelector(".delete-btn");

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(item.text);
});

deleteBtn.addEventListener("click", () => {
  deleteItem(index);
});