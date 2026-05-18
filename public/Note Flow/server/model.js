const Note = mongoose.model("Note", {
title: String,
content: String,
createdAt: {
type: Date,
default: Date.now
}
});
