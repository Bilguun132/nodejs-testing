const { User } = require("../models/user.model");
const request = require("supertest");
const expect = require("chai").expect;
const app = require("../app");

describe("api/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all users", async () => {
      const users = [
        { name: "test", email: "test@gmail.com", gender: "male" },
        { name: "test1", email: "test1@gmail.com", gender: "female" }
      ];
      await User.insertMany(users);
      console.log(users);
      const res = await request(app).get("/api/users");
      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
    });
  });

  describe("GET/:id", () => {
    it("should return a user if valid id is passed", async () => {
      const user = new User({
        name: "test",
        email: "test@gmail.com",
        gender: "male"
      });
      await user.save();
      const res = await request(app).get("/api/users/" + user._id);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", user.name);
    });

    it("should return 400 error when invalid object id is passed", async () => {
      const res = await request(app).get("/api/users/1");
      expect(res.status).to.equal(400);
    });

    it("should return 404 error when valid object id is passed but does not exist", async () => {
      const res = await request(app).get("/api/users/111111111111");
      expect(res.status).to.equal(404);
    });
  });

  describe("POST /", () => {
    it("should return user when the all request body is valid", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({
          name: "test",
          email: "test@gmail.com",
          gender: "male"
        });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("_id");
      expect(res.body).to.have.property("name", "test");
    });

    // add more tests to validate request body accordingly eg, make sure name is more than 3 characters etc
  });

  describe("PUT /:id", () => {
    it("should update the existing order and return 200", async () => {
      const user = new User({
        name: "test",
        email: "test@gmail.com",
        gender: "male"
      });
      await user.save();

      const res = await request(app)
        .put("/api/users/" + user._id)
        .send({
          name: "newTest",
          email: "newemail@gmail.com",
          gender: "male"
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name", "newTest");
    });
  });

  describe("DELETE /:id", () => {
    it("should delete requested id and return response 200", async () => {
      const user = new User({
        name: "test",
        email: "test@gmail.com",
        gender: "male"
      });
      await user.save();

      const res = await request(app).delete("/api/users/" + user._id);
      expect(res.status).to.be.equal(200);
    });

    it("should return 404 when deleted user is requested", async () => {
      const user = new User({
        name: "test",
        email: "test@gmail.com",
        gender: "male"
      });
      await user.save();

      let res = await request(app).delete("/api/users/" + user._id);
      expect(res.status).to.be.equal(200);

      res = await request(app).get("/api/users/" + user._id);
      expect(res.status).to.be.equal(404);
    });
  });
});
