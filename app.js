const express = require('express')
const app = express()

app.get('/api/topics', getAllTopics)



module.exports = app