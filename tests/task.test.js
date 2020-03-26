const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
    initialUser,
    initialUserId,
    initialUser2,
    initialUser2Id,
    task1,
    task2,
    task3,
    setupDB
} = require("./fixtures/db");

beforeEach(setupDB);

test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${initialUser.tokens[0].token}`)
        .send({
            description: "test task"
        })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test("Should return only related tasks for user", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${initialUser.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
});

test("Should not delete unrelated tasks by user", async () => {
    const response = await request(app)
        .delete(`/tasks/${task1._id}`)
        .set("Authorization", `Bearer ${initialUser2.tokens[0].token}`)
        .send()
        .expect(404);

    const task = Task.findById(task1._id);
    expect(task).not.toBeNull();
});
