const Note = require("../models/Notes");

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({
      title: title || "Untitled",
      content: content || "<p></p>"
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({
      createdAt: -1
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const updatedNote =
      await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnDocument: "after"
        }
      );
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Note Deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {createNote, getNotes, updateNote, deleteNote };