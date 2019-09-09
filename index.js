const { spreadsheet } = require('./spreadsheet.js')

// Extract the required classes from the discord.js module
const { Client, MessageEmbed } = require('discord.js');

const http = require('http');

const format = require('date-fns-tz/format')
const utcToZonedTime = require('date-fns-tz/utcToZonedTime')

require('dotenv').config()

const jpTimeZone = 'Asia/Tokyo'

http.createServer((req, res) => {
  res.writeHead(200, {
      'Content-type': 'text/plain'
  });
      res.write('Hey');
      res.end();
  }).listen(4000);
  
// Create an instance of a Discord client
const client = new Client();

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.discord_token);

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async(msg) => {
  const jpDate = utcToZonedTime(msg.createdAt, jpTimeZone)
  const formatedJpDate = format(jpDate, 'yyyy/MM/dd HH:mm', { timeZone: jpTimeZone })
  if (msg.content.startsWith('出勤')) {
    const payload = {
      '時間': formatedJpDate,
      '名前': msg.author.username,
      '打刻タイプ': '出勤'
    }
    spreadsheet(payload)
    msg.reply(`${msg.author.username}は${formatedJpDate}に出勤しました`)
  }
  if (msg.content.startsWith('退勤')) {
    const payload = {
      '時間': formatedJpDate,
      '名前': msg.author.username,
      '打刻タイプ': '退勤'
    }
    spreadsheet(payload)
    msg.reply(`${msg.author.username}は${formatedJpDate}に出勤しました`)
  }
})