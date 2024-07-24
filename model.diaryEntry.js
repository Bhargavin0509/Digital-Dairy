const mongoose = require("mongoose");

//  diary entry schema
const diaryEntrySchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Create a model from the schema
const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema);

module.exports = DiaryEntry;
