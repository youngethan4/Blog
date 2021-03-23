const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const { randomBytes } = require("crypto");
const axios = require("axios");
const eventBusUrl = "http://localhost:4005/events";

const posts = {};

app.use(cors());
app.use(express.json());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };
  try {
    await axios.post(eventBusUrl, {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    });
  } catch (err) {
    console.error(err);
  }
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log("Listening on " + port);
});
