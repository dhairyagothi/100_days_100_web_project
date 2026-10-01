const suggestionsList = document.getElementById("suggestionsList");

export function generateSuggestions(
  prompt, clarity, specificity, context, structure
) {
  suggestionsList.innerHTML = "";

  const suggestions = [];

  if (clarity < 70) {
    suggestions.push("Use clearer instructions and goals.");
  }

  if (specificity < 70) {
    suggestions.push("Add more specific requirements.");
  }

  if (context < 70) {
    suggestions.push("Provide additional background context.");
  }

  if (structure < 70) {
    suggestions.push("Use bullet points or structured formatting.");
  }

  if (prompt.split(" ").length < 10) {
    suggestions.push("Describe the desired output in more detail.");
  }

  suggestions.push("Specify the role the AI should act as.");
  suggestions.push("Mention the desired output format.");

  suggestions.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    suggestionsList.appendChild(li);
  });
}

export function resetSuggestions() {
  suggestionsList.innerHTML =
    "<li>Analyze a prompt to receive suggestions.</li>";
}
