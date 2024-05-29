const express = require('express')
const app = express()
const { getAllTopics, getAllEndpoints, getArticleById } = require("./controllers/controller.js")

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById )


  app.all("*",(req, res) => {
    res.status(404).send({ message: "Bad path, not found!" })
  });

  app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ message: err.message });
    } else if (err.code === '22P02') {
        res.status(400).send({ message: "Invalid input" });
    } else {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
  
module.exports = app