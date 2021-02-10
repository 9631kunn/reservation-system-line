require("dotenv").config();

// LINE
const line = require("@line/bot-sdk");
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);

exports.testFunc = (event) => {
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "TEST\uDBC0\uDC79",
  });
};

exports.setProfile = (event) => {
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "プロフィール文を入力してください\uDBC0\uDC79",
  });
};
