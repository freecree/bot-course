const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = '5102038942:AAFRa_poHhCIuZjopmuhzFAKd4i7LUc8Vas';

const bot = new TelegramApi(token, {polling: true});

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты попробуй отгадать`);
    let number = Math.floor(Math.random()*10);
    chats.chatId = number;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
    //await bot.sendMessage(chatId, `ChatId: ${chatId}`);
}

const start = () => {
    bot.setMyCommands([{command: '/start', description: 'Приветствие'},
                    {command: '/info', description: 'Инфо о пользователе'},
                    {command: '/game', description: 'Игра в \'Угадай число\''} ]);

    bot.on('message', async msg => {
        const chatId = msg.chat.id;
        const text = msg.text;
        if (text === '/start') {
            await bot.sendMessage(chatId, `Приветствую, ${msg.chat.username}! Добро пожаловать в чат`);
            return bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `Сори, я не понимаю)`);
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats.chatId) {
            bot.sendMessage(chatId, `Поздравляю! Вы угадали число ${data}`, againOptions);
        } else {
            bot.sendMessage(chatId, `К сожалению Вы не угадали, правильный ответ ${chats.chatId}`, againOptions);
        }
    })
}

start();

require('http').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('')
})
