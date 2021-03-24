const express = require("express");
const app = express();
const axios = require("axios");
const port = 4005;
const services = [
  "http://posts-clusterip-svc:4000/events",
  "http://comments-clusterip-svc:4001/events",
  "http://query-clusterip-svc:4002/events",
  "http://moderation-clusterip-svc:4003/events",
];

app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);
  services.forEach(async (url) => {
    try {
      await axios.post(url, event);
    } catch (err) {
      console.error("Error sending event", event.type);
    }
  });
  res.sendStatus(200);
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(port, () => {
  console.log("Listening on " + port);
});
