const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// CREATE TASK
router.post("/", auth, async (req, res) => {

  const task = new Task({
    userId: req.user.id,
    title: req.body.title
  });

  await task.save();

  res.json(task);
});

// GET TASKS
router.get("/", auth, async (req, res) => {

  const tasks = await Task.find({
    userId: req.user.id
  });

  res.json(tasks);
});

// DELETE TASK
router.delete("/:id", auth, async (req, res) => {

  await Task.findByIdAndDelete(req.params.id);

  res.send("Task Deleted");
});

module.exports = router;