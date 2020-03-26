const request = require("supertest");
const app = require("../src/app");
const { initialUser, initialUserId, setupDB } = require("./fixtures/db");
const User = require("../src/models/user");

beforeEach(setupDB);

test("Should signup a new user", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "Roy",
            email: "royjiny@gmail.com",
            password: "roy123123",
            age: 20
        })
        .expect(201);

    //make sure that the user exists
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //make sure the user was created correctly
    expect(response.body).toMatchObject({
        user: {
            name: "Roy",
            email: "royjiny@gmail.com"
        },
        token: user.tokens[0].token
    });

    //make sure password is not plain text
    expect(user.password).not.toBe("roy123123");
});

test("Should login existing user", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: initialUser.email,
            password: initialUser.password
        })
        .expect(200);

    const user = await User.findById(initialUserId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login wrong user", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: "blah@blah.com",
            password: "1111111111"
        })
        .expect(400);
});

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${initialUser.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Should not get profile for not authenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401);
});

test("Should delete for authenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${initialUser.tokens[0].token}`)
        .send()
        .expect(200);

    // make sure user actually deleted
    const user = await User.findById(initialUserId);
    expect(user).toBeNull();
});

test("Should not delete for not authenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401);
});

test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${initialUser.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/profile-pic.jpg")
        .expect(200);

    const user = await User.findById(initialUserId);
    expect(user.avatar).toEqual(expect.any(Buffer)); //checks type and not content
});

test("Should update valid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${initialUser.tokens[0].token}`)
        .send({
            name: "RoyJiny"
        })
        .expect(200);

    const user = await User.findById(initialUserId);
    expect(user.name).toEqual("RoyJiny");
});

test("Should not update invalid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${initialUser.tokens[0].token}`)
        .send({
            location: "TLV"
        })
        .expect(400);
});
