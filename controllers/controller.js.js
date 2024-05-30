const { selectTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId } = require("../models/models")
const { endPoints } = require("../endpoints.json")

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
selectAllArticles().then((articles) => {
    res.status(200).send({ articles })
})
.catch((err) => {
    next(err)
})
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










