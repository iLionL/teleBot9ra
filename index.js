const TelegramApi = require("node-telegram-bot-api");

require("dotenv").config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const { gameOptions, againOptions, inviteToGameOptions } = require("./options");
const bot = new TelegramApi(TELEGRAM_TOKEN, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Давай поиграем в игру, угадай число от 0 до 9`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  console.log(randomNumber);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадай", gameOptions);
};

// команды бота

bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
  { command: "/info", description: "Получить информацию о пользователе" },
  { command: "/game", description: "Поиграть" },
  // { command: "/create", description: "Create to do list" },
  // { command: "/todo", description: "Create task" },
  // { command: "/list", description: "See all current tasks" },
  // { command: "/lists", description: "See all lists" },
  { command: "/help", description: "Help" },
]);

// ответы бота

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    const username = msg.from.username;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/192/14.webp"
      );
      return bot.sendMessage(chatId, `а я тебя знаю ${firstName}`);
    }

    if (text === "/info") {
      return (
        bot.sendSticker(
          chatId,
          "https://tlgrm.ru/_/stickers/6b7/c7f/6b7c7f20-f690-336c-9619-b5706b0e55e6/8.webp"
        ),
        bot.sendMessage(chatId, `Привет ${firstName} или ${username}`)
      );
    }
    if (text === "/help") {
      console.log(inviteToGameOptions);
      return (
        bot.sendSticker(
          chatId,
          "https://tlgrm.ru/_/stickers/fe1/084/fe10849e-fb5c-3a29-9ebe-2e21fe8dbc35/8.webp"
        ),
        bot.sendMessage(
          chatId,
          `Привет ${firstName}, основной функционал в разработке но ты можешь поиграть в игру`,
          inviteToGameOptions
        )
      );
    }
    //  else if(text === "Поиграть"){
    //   const randomNumber = Math.floor(Math.random() * 10);
    //   console.log(randomNumber);
    //   chats[chatId] = randomNumber;
    //   await bot.sendMessage(chatId, "Отгадай", gameOptions);
    // }

    if (text === "/game") {
      return startGame(chatId);
    } else
      return (
        bot.sendMessage(chatId, "Не понятно"),
        bot.sendSticker(
          chatId,
          "https://tlgrm.ru/_/stickers/b17/97a/b1797a28-5728-3c1b-bff2-ffb7354bcfc3/4.webp"
        )
      );
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (Number(data) === chats[chatId]) {
      return await (bot.sendMessage(
        chatId,
        `Ты угадал цифру ${chats[chatId]}`,
        againOptions
      ),
      bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/38e/fd6/38efd62b-bffc-3c0d-ada4-2fe765d56e4e/2.webp"
      ));
    } else {
      return await bot.sendMessage(
        chatId,
        `Ты не угадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};
start();
