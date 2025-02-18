const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

// tasks - GET

// options:
//      filter by completed
//      limit & skip results - if not provided -> mongoose ignores
//      sort options
router.get("/tasks", auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "asc" ? 1 : -1; //ascending or descending
    }

    try {
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            })
            .execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            creator: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

// tasks - POST
router.post("/tasks", auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            creator: req.user._id
        });
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// tasks - PATCH
router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["completed"];
    const isValidUpdates = updates.every(update =>
        allowedUpdates.includes(update)
    );

    if (!isValidUpdates) {
        return res.status(400).send({ error: "Invalid Updates" });
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            creator: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => (task[update] = req.body[update]));
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

//tasks - DELETE
router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            creator: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
