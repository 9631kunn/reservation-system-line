require("dotenv").config();
const express = require("express");
const app = express();
const line = require("@line/bot-sdk");
const { Client } = require("pg");
const PORT = process.env.PORT || 3000;

// DB
const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect();

// SQL
const create_userTable = {
  text:
    "CREATE TABLE IF NOT EXISTS users (id SERIAL NOT NULL, line_uid VARCHAR(255), display_name VARCHAR(255), timestamp VARCHAR(255), cuttime SMALLINT, shampootime SMALLINT, colortime SMALLINT, spatime SMALLINT);",
};

connection
  .query(create_userTable)
  .then(() => {
    console.log("table USERS created");
  })
  .catch((err) => console.log(err));

// LINE
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);

// 友達追加
const greeting_follow = async (event) => {
  const { displayName } = await client.getProfile(event.source.userId);
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: displayName + "さん、フォローありがとうございます\uDBC0\uDC04",
  });
};

// メッセージ送信時
const handleMessage = async (event) => {
  const { displayName } = await client.getProfile(event.source.userId);
  const text = event.message.type === "text" ? event.message.text : "";
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: displayName + "「" + text + "」",
  });
};

const lineBot = (req, res) => {
  res.status(200).end();
  const events = req.body.events;
  const promises = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    console.log(event);
    switch (event.type) {
      case "follow":
        promises.push(greeting_follow(event));
        break;
      case "message":
        promises.push(handleMessage(event));
        break;
    }
  }
  Promise.all(promises)
    .then(console.log("passed"))
    .catch((err) => console.log(err.stack));
};

app
  .post("/hook", line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log("STARTED"));
