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

// CONFIG
const INITIAL_TREAT = [20, 10, 40, 15, 30, 15, 10];

// LINE
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);

// 友達追加
const greeting_follow = async (event) => {
  const { displayName } = await client.getProfile(event.source.userId);
  // INSERT QUERY
  const table_insert = {
    text:
      "INSERT INTO users (line_uid,display_name,timestamp,cuttime,shampootime,colortime,spatime) VALUES($1,$2,$3,$4,$5,$6,$7);",
    values: [
      event.source.userId,
      displayName,
      event.timestamp,
      INITIAL_TREAT[0],
      INITIAL_TREAT[1],
      INITIAL_TREAT[2],
      INITIAL_TREAT[3],
    ],
  };
  connection
    .query(table_insert)
    .then(() => {
      console.log("insert");
    })
    .catch((err) => console.log(err));

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: displayName + "さん、フォローありがとうございます\uDBC0\uDC04",
  });
};

// メッセージ送信時
const handleMessage = async (event) => {
  const { displayName } = await client.getProfile(event.source.userId);
  const text = event.message.type === "text" ? event.message.text : "";
  if (text.includes("予約")) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "次回予約を受け付けました。メニューは……",
    });
  } else {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: displayName + "「" + text + "」",
    });
  }
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
