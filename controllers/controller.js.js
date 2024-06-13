const { selectTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleVotesById, extractCommentById, selectUsers } = require("../models/models")
const endPoints = require("../endpoints.json")

exports.getAllTopics = (req,res) => {
    selectTopics().then((topics) => {
    res.status(200).send({ topics })
})
.catch((err) => {
next(err)
})
}

exports.getAllEndpoints = (req,res) => {

    res.status(200).send({ endPoints })
}

exports.getArticleById = (req,res,next) => {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => 
    res.status(200).send( { article }))
.catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req,res,next) => {
const { topic } = req.query;
let articlePromise;

if(topic) {
    articlePromise = selectAllArticles(topic)
} else {articlePromise = selectAllArticles()

}
articlePromise
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
}

exports.getCommentsByArticleId = (req,res,next) => {
const { article_id } = req.params
selectArticleById(article_id).then(() => {
   return selectCommentsByArticleId(article_id)
})
.then((comments) => {
    res.status(200).send({ comments })
})
.catch((err) => {
    next(err)
})
}

exports.postCommentByArticleId = (req,res,next) => {
const { article_id } = req.params
const {username, body } = req.body
if(!username || !body) {
    return next({
        status: 400,
        msg: 'Required key missing'
    });
}
selectArticleById(article_id)
        .then(() => {
            return insertCommentByArticleId(article_id, username, body);
        })
        .then(comment => {
            
            res.status(201).send({ comment });
        })
        .catch(err => {
            next(err);
        });
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if (inc_votes === undefined || isNaN(inc_votes)) {
        return next({
            status: 400,
            msg: 'Invalid inc_votes value'
        });
    }
    updateArticleVotesById(article_id, inc_votes)
        .then((updatedArticle) => {
            res.status(200).send({ article: updatedArticle });
        })
        .catch((err) => {
            next(err);
        });
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    extractCommentById(comment_id)
    .then(() => {
        res.status(204).end() 
    })
    .catch((err) => {
        next(err)
    })
}

exports.getAllUsers = (req,res) => {
    selectUsers().then((users) => {
    res.status(200).send({ users })
})
.catch((err) => {
next(err)
})
}










