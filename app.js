const express = require('express')
const app = express()
const { getAllTopics, getAllEndpoints } = require("./controllers/controller.js")

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)


app.use((req, res, next) => {
    res.status(404).send({ message: "Bad path, not found!" })
  });

app.use((err, req, res, next) => {
    res.status(500).send({ message: 'Server error' })
  });


module.exports = app