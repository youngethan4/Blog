const express = require("express");
const app = express();
const axios = require("axios");
const port = 4005;
const servicePorts = [4000, 4001, 4002, 4003];

app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);
  servicePorts.forEach(async (port) => {
    try {
      await axios.post(`http://localhost:${port}/events`, event);
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
