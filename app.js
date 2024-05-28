const express = require('express')
const app = express()
const { getAllTopics } = require("./controllers/topics-controller")

app.get('/api/topics', getAllTopics)


app.use((req, res, next) => {
    res.status(404).send({ message: "Bad path, not found!" })
  });

app.use((err, req, res, next) => {
    res.status(500).send({ message: 'Server error' })
  });


module.exports = app