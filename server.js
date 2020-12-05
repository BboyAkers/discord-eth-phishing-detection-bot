require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const checkForPhishing = require('eth-phishing-detect');
// const testString = 'please go to http://austinakers.com or https://metamask.io/ or  testing. etherclassicwallet.com or go to dev.to or try hitting up dev.com';

const TOKEN = process.env.TOKEN;

const extractURLS = (comment) => {
  const matches = comment.matchAll(/(?:https?:\/\/)?(\S+\.\S+)/g);
  return matches;

}

const checkUrls = (listOfURLs) => {
  return new Map(listOfURLs.map(url => [url, checkForPhishing(url)]));
}



bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.author.bot)
    return
  const urlList = extractURLS(msg.content)
  if (urlList) {
    checkUrls(extractURLS(msg.content))
    msg.reply('hey we have the url(s)')
  } else {
    console.log('message does not contain any urls')
  }
})