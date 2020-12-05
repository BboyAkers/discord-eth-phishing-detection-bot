
import dotenv from 'dotenv';
import Discord from 'discord.js';
import checkForPhishing from 'eth-phishing-detect';
import { map } from '@emnudge/domyno/pipeable';
import { pipe } from '@emnudge/domyno';
// const testString = 'please go to http://austinakers.com or https://metamask.io/ or  testing. etherclassicwallet.com or go to dev.to or try hitting up dev.com';
dotenv.config()
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

//returns Iterable of RegExpMatchArray
const extractURLs = (comment: string) => comment.matchAll(/(?:https?:\/\/)?(?:\S+\.\S+)/gu);

// returns an iterable of the first item of an iterable
const mapFirst = map(([first]: string[]) => first)

// return a tuple of [url, phishingStatus]
const mapURLPhishingStatus = map((url: string) => [url, checkForPhishing(url)])

// turn an iterable into a map
const collectMap = <K,V>(listOfURLs: Iterable<[K, V]>) => new Map<K,V>(listOfURLs);

// compose our steps together
const checkURLs = pipe<string, Map<string,boolean>>(extractURLs, mapFirst, mapURLPhishingStatus, collectMap)

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user?.tag}!`);
});

bot.on('message', msg => {
  if (msg.author.bot)
    return
  const results = checkURLs(msg.content)
  // const isMalicious = () => {
  //   return results.filter()
  // }
  if (urlList) {
    msg.reply('hey we have the url(s)')
  } else {
    console.log('message does not contain any urls')
  }
})
