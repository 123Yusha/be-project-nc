const express = require("express");
const app = express();
const {
  getAllTopics,
  getAllEndpoints,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentById,
  getAllUsers,
} = require("./controllers/controller.js");
const connection = require("./db/connection.js");

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getAllUsers);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Bad path, not found!" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid input" });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = app;
