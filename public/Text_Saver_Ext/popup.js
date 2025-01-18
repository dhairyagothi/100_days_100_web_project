// Function to display saved texts
function displaySavedTexts() {
    chrome.storage.local.get("savedTexts", (result) => {
      const textList = result.savedTexts || [];
      const textListDiv = document.getElementById("textList");
      textListDiv.innerHTML = "";
  
      if (textList.length === 0) {
        textListDiv.innerHTML = "<p>No saved texts found.</p>";
        return;
      }
  
      textList.forEach((entry) => {
        const entryDiv = document.createElement("div");
        entryDiv.className = "text-entry";
  
        const textPara = document.createElement("p");
        textPara.textContent = entry.text;
        entryDiv.appendChild(textPara);
  
        const urlLink = document.createElement("a");
        urlLink.href = entry.url;
        urlLink.textContent = entry.url;
        urlLink.className = "url";
        urlLink.target = "_blank";
        entryDiv.appendChild(urlLink);
  
        textListDiv.appendChild(entryDiv);
      });
    });
  }
  
  // Function to clear saved texts
  function clearSavedTexts() {
    chrome.storage.local.clear(() => {
      alert("All saved texts have been cleared.");
      displaySavedTexts(); // Refresh the display to show no saved texts
    });
  }
  
  // Function to download saved texts as a file
  function downloadSavedTexts() {
    chrome.storage.local.get("savedTexts", (result) => {
      const textList = result.savedTexts || [];
      if (textList.length === 0) {
        alert("No texts to save!");
        return;
      }
  
      // Create the file content
      let fileContent = "Saved Texts with URLs:\n\n";
      textList.forEach((entry, index) => {
        fileContent += `Entry ${index + 1}:\n`;
        fileContent += `Text: ${entry.text}\n`;
        fileContent += `Source: ${entry.url}\n\n`;
      });
  
      // Create a blob with the file content
      const blob = new Blob([fileContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
  
      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = "saved_texts.txt"; // Filename for the downloaded file
      a.click();
  
      // Clean up the URL object after download
      URL.revokeObjectURL(url);
    });
  }
  
  // Event listeners
  document.getElementById("downloadButton").addEventListener("click", downloadSavedTexts);
  document.getElementById("clearButton").addEventListener("click", clearSavedTexts);
  
  // Run when popup opens
  document.addEventListener("DOMContentLoaded", displaySavedTexts);
  