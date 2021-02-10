require("dotenv").config();

// ORM
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CONFIG
const INITIAL_TREAT = [20, 10, 40, 15, 30, 15, 10];

// LINE
const line = require("@line/bot-sdk");
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);

// 友達追加
const greetingFollow = async (event) => {
  const { displayName } = await client.getProfile(event.source.userId);

  // INSERT QUERY
  const newUser = {
    uid: event.source.userId,
    name: displayName,
  };
  try {
    await prisma.user.create({
      data: newUser,
    });
  } catch (error) {
    console.log(error);
  }

  // Reply
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

const testFunc = (event) => {
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "TEST\uDBC0\uDC79",
  });
};

const setProfile = (event) => {
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "プロフィール文を入力してください\uDBC0\uDC79",
  });
};

// メッセージ送信時
const handleMessage = async (event) => {
  const { displayName } = await client.getProfile(event.source.userId);
  const text = event.message.type === "text" ? event.message.text : "";

  // プロフィール設定
  if (text === "プロフィール") setProfile(event);
  if (text === "test") testFunc(event);

  // オウム返し
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: displayName + "「" + text + "」",
  });
};

// 希望日時選択
const askDate = async (event, orderedMenu) => {
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
              label: "来店希望日を選択する",
              data: `date&${orderedMenu}`,
              mode: "date",
            },
          },
        ],
      },
    },
  });
};

const askTime = (event, orderedMenu, selectedDate) => {
  console.log(event, orderedMenu, selectedDate);
  return;
};

// 予約時
const handlePostbackEvent = async (event) => {
  const { displayName } = await client.getProfile(event.source.userId);
  const data = event.postback.data;
  const splitData = data.split("&");
  if (splitData[0] === "menu") {
    const orderedMenu = splitData[1];
    askDate(event, orderedMenu);
  }
  if (splitData[0] === "date") {
    const orderedMenu = splitData[1];
    const selectedDate = event.postback.dare;
    askTime(event, orderedMenu, selectedDate);
  }
};

exports.lineBot = (req, res) => {
  res.status(200).end();
  const events = req.body.events;
  const promises = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    console.log(event);
    switch (event.type) {
      case "follow":
        promises.push(greetingFollow(event));
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
