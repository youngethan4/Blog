const express = require("express");
const app = express();
const cors = require("cors");
const port = 4001;
const { randomBytes } = require("crypto");
const axios = require("axios");
const eventBusUrl = "http://localhost:4005/events";

const commentsByPostId = {};

app.use(cors());
app.use(express.json());

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const postId = req.params.id;
  const { content } = req.body;
  const comments = commentsByPostId[postId] || [];

  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[postId] = comments;
  try {
    axios.post(eventBusUrl, {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId,
        status: "pending",
      },
    });
  } catch (err) {
    console.error(err);
  }
  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    await axios.post(eventBusUrl, {
      type: "CommentUpdated",
      data,
    });
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log("Listening on " + port);
});
