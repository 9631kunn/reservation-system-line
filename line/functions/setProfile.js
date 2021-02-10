export const setProfile = (event) => {
  return client.replayMessage(event.replyToken, {
    type: "text",
    text: "プロフィール文を入力してください\uDBC0\uDC79",
  });
};
