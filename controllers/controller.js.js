const { selectTopics } = require("../models/models")
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








