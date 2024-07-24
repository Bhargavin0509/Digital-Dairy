const express = require("express");
const mongoose = require("mongoose");
const DiaryEntry = require("./model.diaryEntry");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/DigitalDiary")
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.log("Failed to connect!");
  });

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));



// add a new diary entry
app.post("/add-entry", (req, res) => {
  const { date, content } = req.body; // Extract date and content from request body

  // Create a new diary entry instance
  const newEntry = new DiaryEntry({
    date,
    content,
  });

  // Save the new entry to the database
  newEntry
    .save()
    .then(() => {
      console.log("New entry added successfully!");
      res.redirect("/"); // Redirect to home page or any other page
    })
    .catch((err) => {
      console.error("Error adding entry:", err);
      res.status(500).send("Error adding entry");
    });
});

// fetch all diary entries
app.get("/get-all-entries", async (req, res) => {
  try {
    const entries = await DiaryEntry.find({}, "date content");
    res.json(entries);
  } catch (error) {
    console.error("Error fetching entries: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update a diary entry
app.put("/update-entry/:id", async (req, res) => {
  const { id } = req.params;
  const { date, content } = req.body;

  try {
    // Check if the entry with the given id exists
    const existingEntry = await DiaryEntry.findById(id);
    if (!existingEntry) {
      return res.status(404).send("Entry not found");
    }

    // Update the entry with the new date and content
    existingEntry.date = date;
    existingEntry.content = content;
    const updatedEntry = await existingEntry.save();

    // Send the updated entry in the response
    res.json(updatedEntry);
  } catch (error) {
    console.error("Error updating entry: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to delete a diary entry
app.delete("/delete-entry/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await DiaryEntry.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).send("Entry not found");
    }
    res.send("Entry deleted successfully");
  } catch (error) {
    console.error("Error deleting entry: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
