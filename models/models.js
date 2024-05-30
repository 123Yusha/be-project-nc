const db = require("../db/connection")

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then((response) => {
         return response.rows
    }
    )
    }

exports.selectArticleById = (article_id) => {
    
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({ rows }) => {
       const article = rows[0]
       if(!article) {
        return Promise.reject({
            status: 404,
            msg: 'Article does not exist'
        })
       }
       return article
    }
    )}

exports.selectAllArticles = () => {
    return db.query(`SELECT 
    a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id 
    GROUP BY a.article_id 
    ORDER BY a.created_at DESC`).then((result) => {
        return result.rows
    })
}

exports.selectCommentsByArticleId = (article_id) => {
    return db.query (`
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `, [article_id])
    .then(({ rows }) => {
        return rows
    })
}

exports.insertCommentByArticleId = (article_id, username, body) => {
   
    return exports.selectArticleById(article_id)
    .then(article => {
        return db.query("INSERT INTO comments(article_id, username, body) VALUES ($1, $2, $3) RETURNING *", [article_id, username, body]
)})
    .then(({ rows }) => {
        return rows[0]
    })
}
   
