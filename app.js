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
    text: "INSERT INTO users (line_uid,display_name,timestamp,cuttime,shampootime,colortime,spatime) VALUES($1,$2,$3,$4,$5,$6,$7);",
    values: [event.source.userId, displayName, event.timestamp, INITIAL_TREAT[0], INITIAL_TREAT[1], INITIAL_TREAT[2], INITIAL_TREAT[3]],
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

// メニュー選択
const orderChoice = (event) => {
  return client.replyMessage(event.replyToken, {
    type: "flex",
    altText: "menuSelect",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "baseline",
        contents: [
          {
            type: "text",
            text: "予約メニュー",
            size: "lg",
            decoration: "none",
            style: "normal",
            position: "relative",
            align: "center",
            weight: "bold",
            color: "#545454",
          },
        ],
        position: "relative",
        offsetBottom: "none",
        paddingBottom: "none",
      },
      hero: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "複数選択 可",
            weight: "regular",
            align: "center",
            margin: "xs",
            size: "sm",
          },
        ],
        paddingAll: "sm",
        paddingStart: "md",
        paddingEnd: "md",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "カット",
                  data: "menu&0",
                },
                style: "secondary",
              },
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "シャンプー",
                  data: "menu&1",
                },
                style: "secondary",
              },
            ],
            spacing: "md",
            paddingBottom: "md",
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "カラー",
                  data: "menu&2",
                },
                style: "secondary",
              },
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "ヘッドスパ",
                  data: "menu&3",
                },
                style: "secondary",
              },
            ],
            spacing: "md",
            paddingBottom: "md",
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "カラー",
                  data: "menu&4",
                },
                style: "secondary",
              },
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "ヘッドスパ",
                  data: "menu&5",
                },
                style: "secondary",
              },
            ],
            spacing: "md",
            paddingBottom: "md",
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "マッサージ",
                  data: "menu&6",
                },
                style: "secondary",
              },
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "顔剃り",
                  data: "menu&7",
                },
                style: "secondary",
              },
            ],
            spacing: "md",
            paddingBottom: "md",
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "眉",
                      data: "menu&8",
                    },
                    style: "secondary",
                  },
                ],
                width: "50%",
                paddingEnd: "sm",
              },
            ],
            spacing: "md",
            paddingBottom: "md",
          },
          {
            type: "button",
            action: {
              type: "postback",
              label: "決定する",
              data: "end",
            },
            style: "primary",
            margin: "md",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "キャンセル",
            action: {
              type: "postback",
              label: "キャンセル",
              data: "cancel",
            },
            align: "center",
            margin: "sm",
            size: "sm",
          },
        ],
      },
      styles: {
        header: {
          separator: true,
        },
      },
    },
  });
};

// メッセージ送信時
const handleMessage = async (event) => {
  const { displayName } = await client.getProfile(event.source.userId);
  const text = event.message.type === "text" ? event.message.text : "";
  console.log;
  // 予約の場合メニュー表示
  if (text.contains("予約")) orderChoice(event);

  // オウム返し
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: displayName + "「" + text + "」",
  });
};

const askData = async (event) => {
  return client.replyMessage(event.replyToken, {
    type: "flex",
    altText: "予約日選択",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "来店希望日",
            size: "md",
            weight: "bold",
            align: "center",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            action: {
              type: "datetimepicker",
              label: "来店希望日時を選択する",
              data: `date&${orderedMenu}`,
              mode: "date",
            },
          },
        ],
      },
    },
  });
};

// 予約時
const handlePostbackEvent = async (event) => {
  const profile = await client.getProfile(event.source.userId);
  const data = event.postback.data;
  const splitData = data.split("&");
  if (splitData[0] !== "menu") return;
  const orderedMenu = splitData[1];
  askData(event, orderedMenu);
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
      case "postback":
        promises.push(handlePostbackEvent(event));
        break;
    }
  }
  Promise.all(promises)
    .then(console.log("passed"))
    .catch((err) => console.log(err.stack));
};

app.post("/hook", line.middleware(config), (req, res) => lineBot(req, res)).listen(PORT, () => console.log("STARTED"));
