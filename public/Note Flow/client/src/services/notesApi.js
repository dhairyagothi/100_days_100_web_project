const API = "http://localhost:5000/api/notes";

export const getNotes = async () => {
  const res = await fetch(API);
  return await res.json();
};

export const createNote = async (note) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });
  return await res.json();
};

export const updateNote = async (id, note) => {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });
};


export const deleteNote = async (id) => {
  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });
};