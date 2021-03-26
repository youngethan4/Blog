const express = require("express");
const app = express();
const cors = require("cors");
const port = 4002;
const axios = require("axios");
const eventBusUrl = "http://event-bus-svc:4005/events";

const posts = {};

app.use(express.json());
app.use(cors());

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.sendStatus(200);
});

app.listen(port, async () => {
  console.log("Listening on " + port);

  try {
    const res = await axios.get(eventBusUrl);
    res.data.forEach((event) => {
      console.log("Processing event: ", event.type);
      handleEvent(event.type, event.data);
    });
  } catch (err) {
    console.error(err);
  }
});
