#!/usr/bin/env node

const app = require("./app");
const http = require("http");
const lodash = require("lodash");
const socketIo = require("socket.io");
const Redis = require("ioredis");

const port = "8000";
app.set("port", port);

const server = http.createServer(app);

const serverIo = socketIo(server, {
  cors: {
    origin: "*",
  },
});
const redis = new Redis();
const sockets = [];
const events = [];

serverIo.on("connection", (socket) => {
  sockets.push(socket);

  socket.on("disconnect", () => {
    sockets.splice(sockets.indexOf(socket), 1);
  });
});

const emitEvents = lodash.throttle(() => {
  if (events.length === 0) {
    return;
  }

  sockets.forEach((socket) => {
    socket.emit("events", events);
  });

  events.splice(0, events.length);
}, 5000);

redis.subscribe("events", (error, count) => {
  if (error) {
    console.log("ERROR - redis.subcribe", error);
    return;
  }
});

redis.on("message", (channel, message) => {
  if (channel !== "events") {
    console.log("ERROR - redis.on", channel);
    return;
  }

  emitEvents();
  events.unshift(JSON.parse(message));
});

redis.on("error", (error) => {
  if (error) {
    console.log("ERROR - redis.on", error);
    return;
  }

  sockets.forEach((socket) => {
    socket.emit("error", error);
  });
});

server.listen(port, () => console.log(`started started on ${port}`));
