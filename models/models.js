const db = require("../db/connection")

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then((response) => {
         return response.rows
    }
    )
    }

exports.selectArticleById = (article_id) => {
    return db.query(`
            SELECT articles.*, COUNT(comments.comment_id) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id
        `, [article_id])
        .then(({ rows }) => {
           const article = rows[0];
           if (!article) {
                return Promise.reject({
                    status: 404,
                    msg: 'Article does not exist'
                });
           }
           return article;
        })
    }

exports.selectAllArticles = (topic) => {
    let query = `SELECT 
            a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
            FROM articles a
            LEFT JOIN comments c ON a.article_id = c.article_id `;
        
const params = []
        
        if (topic) {
            query += `WHERE a.topic = $1 `;
            params.push(topic);
        }
    
        query += `GROUP BY a.article_id 
            ORDER BY a.created_at DESC`;
    
        return db.query(query, params)
            .then((result) => {
                return result.rows;
            });
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
    return db.query(
        'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *',
        [article_id, username, body]
    )
    .then(({ rows }) => {
        return rows[0];
    });
}

exports.updateArticleVotesById = (article_id, inc_votes) => {
    return db.query(
        `UPDATE articles
         SET votes = votes + $2
         WHERE article_id = $1
         RETURNING *`,
        [article_id, inc_votes]
    ).then(({ rows }) => {
        const article = rows[0]
        if (!article) {
            return Promise.reject({
                status: 404,
                msg: 'Article does not exist'
            });
        }
        return rows[0];
    });
}

exports.extractCommentById = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [comment_id])
    .then(({ rows }) => {
        const comment = rows[0]
        console.log(comment)
        if(!comment) {
            return Promise.reject({
                status: 404,
                msg: 'Comment not found'
             })
        }
    })
}

exports.selectUsers = () => {
    return db.query('SELECT * FROM users').then((response) => {
        return response.rows
    })
}
   
