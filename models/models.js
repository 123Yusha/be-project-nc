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
            msg: 'Bad path, not found!'
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

   