const { Telegraf } = require('telegraf');
const axios = require('axios');
const fs = require('fs');

const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
const botToken = settings.botToken;

const bot = new Telegraf(botToken);

async function getRandomJoke() {
    try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single');
        if (response.data.error) {
            return 'Sorry, I could not fetch a joke at the moment.';
        } else {
            return response.data.joke;
        }
    } catch (error) {
        console.error('Error fetching joke:', error);
        return 'Oops, something went wrong while fetching the joke.';
    }
}

bot.command('joke', async (ctx) => {
    const joke = await getRandomJoke();
    ctx.reply(joke);
});

bot.command('jokeofday', async (ctx) => {
    const jokeOfTheDay = await getRandomJoke();
    ctx.reply(`Joke of the day: ${jokeOfTheDay}`);
});

bot.start((ctx) => {
    ctx.reply(
        "Welcome to the Random Joke Bot! Here's how you can use it:\n\n" +
        "/joke - Get a random joke\n" +
        "/jokeofday - Get a joke of the day\n\n" +
        "Just type one of the commands and I'll send you a joke! Enjoy!"
    );
});

bot.launch();
