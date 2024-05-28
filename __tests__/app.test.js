const app = require("../app")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const topicData = require("../db/data/test-data/topics.js")
const userData = require("../db/data/test-data/users.js")
const articleData = require("../db/data/test-data/articles.js")
const commentData = require("../db/data/test-data/comments.js")
const request = require("supertest")
const { endPoints } = require("../endpoints.json")

beforeEach(() => {
    return seed({ topicData, userData, articleData, commentData })
})

afterAll(() => {
    db.end()
})

describe("GET /api/topics", () => {

    test('200: responds with an array of topics ', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then (({ body}) => { 
            expect(Array.isArray(body.topics)).toBe(true)
            expect(body.topics.length).toBe(3)
            expect(body.topics.every(item => item.hasOwnProperty('slug') && item.hasOwnProperty('description'))).toBe(true);

        })
    });
}) 

describe('GET error tests', () => {
    test('404: should respond with an error for a non existing end point ', () => {
        return request(app)
        .get('/api/incorrect')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Bad path, not found!")
        })
        
    });
})

describe("GET /api endpoints ", () => {
    test('Should respond with an object of available endPoints and their useful info', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual({ endPoints })
        })
    });
})





