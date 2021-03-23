const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const { randomBytes } = require("crypto");

const posts = {};

app.use(cors());
app.use(express.json());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };
  res.status(201).send(posts[id]);
});

app.listen(port, () => {
  console.log("Listening on " + port);
});
