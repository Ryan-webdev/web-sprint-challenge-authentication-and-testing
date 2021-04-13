const supertest = require("supertest")
const server = require("./server")
const db = require("../database/dbConfig.js")

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicnlhbiIsImlhdCI6MTU5OTg3MDkyNX0.zvhnPReAvUA4cM469Sk6tqODk1-xT9fRFfYMHcdQzDk";

    beforeAll((done) => {
        supertest(server)
        .post('/api/auth/login')
        .send({
          username: "ryan",
          password: "password",
        })
        .end((err, res) => {
          token = res.body.token; // save the token!
          done();
        });
    });

describe("server.js", () => {
    beforeEach(async () => {
        await db('users').truncate()
    })

    it("POST api/auth/register - should return status 200", function () {
        return supertest(server)
            .post("/api/auth/register")
            .send({ username: "ryan", password: "password" })
            .then(res => {

                expect(res.status).toBe(200);
            })
    })

    it("POST /auth/register - res.type should match json", function () {
        return supertest(server)
            .post("/api/auth/register")
            .send({ username: "ryan", password: "password" })
            .then(res => {

                expect(res.type).toMatch(/json/i);
            })
    })

    it("POST api/auth/login - res.type should match json", function () {
        return supertest(server)
            .post("/api/auth/login")
            .send({ username: "ryan", password: "password" })
            .then(res => {

                expect(res.type).toMatch(/json/i);
            })
    })

    it("POST api/auth/login - should return status 401", function () {
        return supertest(server).post("/api/auth/login")
            .send({ username: "ryan", password: "password" })
            .then(res => {

                expect(res.status).toBe(401);
            })
    })

    it("GET api/jokes/ - res.type should match json", function () {
        return supertest(server)
            .get("/api/jokes/")
            .then(res => {

                expect(res.type).toMatch(/json/i);
            })
    })

    it("GET api/jokes/ - should be defined", function () {
        return supertest(server)
            .get("/api/jokes/")
            .then(res => {

                expect(res.body).toBeDefined();
            })
    })

    it("should respond with JSON", () => {
        return supertest(server)
        .get("/api/users")
        .set("authorization", `${token}`)
        .then((res) => {
            expect(res.status).toBe(200)
            expect(res.type).toBe('application/json');
        })
    })
})