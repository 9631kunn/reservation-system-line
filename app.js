require("dotenv").config();
const express = require("express");
const app = express();
const line = require("@line/bot-sdk");
const PORT = process.env.PORT || 3000;

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

app
  .post("/hook", line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log("STARTED"));
