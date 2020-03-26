//set up the data base
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const initialUserId = new mongoose.Types.ObjectId();
const initialUser = {
    _id: initialUserId,
    name: "Bot",
    email: "bot@mail.com",
    password: "123123123",
    age: 22,
    tokens: [
        {
            token: jwt.sign({ _id: initialUserId }, process.env.JWT_SECRET)
        }
    ]
};

const initialUser2Id = new mongoose.Types.ObjectId();
const initialUser2 = {
    _id: initialUser2Id,
    name: "Bot2",
    email: "bot2@mail.com",
    password: "123123123",
    age: 22,
    tokens: [
        {
            token: jwt.sign({ _id: initialUser2Id }, process.env.JWT_SECRET)
        }
    ]
};

const task1 = {
    _id: new mongoose.Types.ObjectId(),
    description: "first task",
    completed: false,
    creator: initialUserId
};

const task2 = {
    _id: new mongoose.Types.ObjectId(),
    description: "second task",
    completed: true,
    creator: initialUserId
};
const task3 = {
    _id: new mongoose.Types.ObjectId(),
    description: "third task",
    completed: true,
    creator: initialUser2Id
};

const setupDB = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(initialUser).save();
    await new User(initialUser2).save();
    await new Task(task1).save();
    await new Task(task2).save();
    await new Task(task3).save();
};

module.exports = {
    initialUser,
    initialUserId,
    initialUser2,
    initialUser2Id,
    task1,
    task2,
    task3,
    setupDB
};
