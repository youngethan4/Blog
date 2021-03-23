const express = require("express");
const app = express();
const port = 4003;
const axios = require("axios");
const eventBusUrl = "http://localhost:4005/events";

app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    try {
      await axios.post(eventBusUrl, {
        type: "CommentModerated",
        data: {
          ...data,
          status,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log("Listening on " + port);
});
