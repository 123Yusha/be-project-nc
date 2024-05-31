const app = require("../app")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const topicData = require("../db/data/test-data/topics.js")
const userData = require("../db/data/test-data/users.js")
const articleData = require("../db/data/test-data/articles.js")
const commentData = require("../db/data/test-data/comments.js")
const request = require("supertest")
const { endPoints } = require("../endpoints.json")
const sorted = require("jest-sorted")

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

describe('GET /api endpoints 404: non existant end point test', () => {
    test('404: should respond with an error for a non existing end point ', () => {
        return request(app)
        .get('/api/incorrect')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Bad path, not found!")
        })
        
    });

})


describe('GET /api/articles/:article_id', () => {
    test('Returns the correct article when given a valid id', () => {
       return request(app)
       .get('/api/articles/1')
       .expect(200)
       .then(({ body }) => {
        expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
       })
    });
})

describe('GET /api/articles/:article_id ERRORS', () => {
    test('404: responds with error when article_id does not exist', () => {
       return request(app)
       .get('/api/articles/99999999')
       .expect(404)
       .then(({ body }) => {
        expect(body.message).toBe('Article does not exist')
       })
    });
    test('400: responds with an error when article_id invalid', () => {
        return request(app)
        .get('/api/articles/five')
        .expect(400)
        .then(({ body }) => {
         expect(body.message).toBe('Invalid input')
        })   
    });
})

describe("GET /api/articles", () => {

    test('200: responds with an array of articles ', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then (({ body}) => { 
            expect(Array.isArray(body.articles)).toBe(true)
            expect(body.articles.length).toBe(13)
            body.articles.forEach(article => {
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url');
                expect(article).toHaveProperty('comment_count');  
            })
         })
    })
    test('200: responds with an array of articles sorted by created_at in descending order ', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at', {descending: true})
        
        })
    });
}) 

describe("GET /api/articles ERRORS", () => {
    test('404: should respond with an error for a non existing end point ', () => {
        return request(app)
        .get('/api/aaarticles')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Bad path, not found!")
        })
        
    });

})

describe('GET /api/articles/:article_id/comments', () => {
test('200: Responds with an ampty array if the id exists, but there are no comments', () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({ body }) => {
        expect(body.comments).toEqual([])
    })
    });
test('Responds with a correct array of comments when given a valid article_id', () => {
    return request(app)
    .get('/api/articles/6/comments')
    .expect(200)
    .then(({ body }) => {
        const { comments } = body
        expect(comments).toEqual([{
            comment_id: 16 ,
            body: "This is a bad article name",
            votes: 1,
            author: "butter_bridge",
            article_id: 6,
            created_at: "2020-10-11T15:23:00.000Z"
          }])
    }) 
});
test('200: responds with an array of comments by article_id sorted by most recent comments first ', () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
    expect(body.comments).toBeSortedBy('created_at', {descending: true})
    
    })
});
}
)

describe('GET /api/articles/:article_id/comments ERRORS', () => {
    test('404: responds with error when article id does not exist', () => {
        return request(app)
        .get('/api/articles/9999999/comments')
        .expect(404)
        .then((response) => {
    expect(response.body.message).toBe('Article does not exist')
        })
     });
     test('400: responds with an error when article_id invalid', () => {
         return request(app)
         .get('/api/articles/"five"/comments')
         .expect(400)
         .then(({ body }) => {
          expect(body.message).toBe('Invalid input')
         })   
     });
}
)

describe('POST /api/articles/:article_id/comments', () => {
test('Should add a new comment for a valid article_id ', () => {

    const newComment = {
        username: 'butter_bridge',
        body: 'Test Comment'
    }
    return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(200)
            .then(response => {
                expect(response.body.comment).toBeTruthy();
                expect(response.body.comment.author).toBe(newComment.username);
                expect(response.body.comment.body).toBe(newComment.body);
     })
});


})

describe('POST /api/articles/:article_id/comments ERRORS', () => {
    test('400: return error if missing username or body', () => {
        const invalidComment = {body: 'Test comment'};
    
        return request(app)
          .post('/api/articles/1/comments')
          .send(invalidComment)
          .expect(400)
          .then(response => {
            expect(response.body).toEqual({ message: 'Required key missing' });
          });
      });
      test('400: return error if article_id is invalid input', () => {
        const commentData = {
            username: 'Yusha',
            body: 'Test comment'
          };
    
        return request(app)
          .post('/api/articles/one/comments')
          .send(commentData)
          .expect(400)
          .then(response => {
            expect(response.body).toEqual({ message: 'Invalid input' });
          });
      });

      test('should return 404 if article ID does not exist', () => {
        const commentData = {
          username: 'Yusha',
          body: 'Test comment'
        };
    
        return request(app)
          .post('/api/articles/123456/comments')
          .send(commentData)
          .expect(404)
          .then(response => {
            expect(response.body).toEqual({ message: 'Article does not exist' });
          });
      });
      test('should return 404 if username does not exist', () => {
        const commentData = {
          username: 'Yusha',
          body: 'Test comment'
        };
    
        return request(app)
          .post('/api/articles/123456/comments')
          .send(commentData)
          .expect(404)
          .then(response => {
            expect(response.body).toEqual({ message: 'Article does not exist' });
          });
      });
      
})

describe('PATCH /api/articles/:article_id', () => {
    test('updates valid article_id votes with valid inc_votes value', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 10 })
            .expect(200)
            .then(response => {
                expect(response.body.article.votes).toBe(110);
            })
    });
})

describe('PATCH /api/articles/:article_id ERRORS', () => {
    test('404: returns error if article_id does not exist', () => {
        return request(app)
            .patch('/api/articles/999999')
            .send({ inc_votes: 10 })
            .expect(404);
    });
    test('400: returns error if article_id is invalid format', () => {
        return request(app)
            .patch('/api/articles/one')
            .send({ inc_votes: 10 })
            .expect(400);
    });
    test('400: returns error if inc_votes is invalid format or missing', () => {
        return request(app)
            .patch('/api/articles/1')
            .expect(400)
            .then(() => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: 'invalid vote format' })
                    .expect(400);
            });
    });

})

describe('DELETE /api/comments/:comment_id', () => {
    test('Should delete the appropriate comment by comment_id', () => {
    return request(app)
    .delete('/api/comments/2')
    .expect(204)
    });
})

describe('DELETE /api/comments/:comment_id ERRORS', () => {
    test('404: returns an error if comment does not exist', () => {
        return request(app)
        .delete('/api/comments/1234567')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('Comment not found')
        }) 
    });
    test('400: returns an error if the comment_id is invalid', () => {
        return request(app)
            .delete('/api/comments/comment_one')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('Invalid input');
            });
    });
})








