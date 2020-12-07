
import dotenv from 'dotenv';
import Discord, { TextChannel, MessageEmbed } from 'discord.js';
import checkForPhishing from 'eth-phishing-detect';
import { map, filter, some } from '@emnudge/domyno/pipeable';
import { pipe } from '@emnudge/domyno';

// const testString = 'please go to http://austinakers.com or https://metamask.io/ or  testing. etherclassicwallet.com or go to dev.to or try hitting up dev.com';
dotenv.config()
const bot = new Discord.Client();

const {TOKEN, ADMIN_CHANNEL_ID} = process.env;

//returns Iterable of RegExpMatchArray
const extractURLs = (comment: string) => comment.matchAll(/(?:https?:\/\/)?(?:\S+\.\S+)/gu); 

// returns an iterable of the first item of an iterable
const mapFirst = map(([first]: Iterable<string>) => first)

// return a tuple of [url, phishingStatus]
const mapURLPhishingStatus = map<string,[string,boolean]>((url: string) => [url, checkForPhishing(url)])

// turn an iterable into a map
const collectMap = <K,V>(listOfURLs: Iterable<[K, V]>) => new Map<K,V>(listOfURLs);

const isPhishingPair = ([, isPhishing]: [string, boolean]) => isPhishing
const filterUrlIsPhishing = filter(isPhishingPair)
const someUrlIsPhishing = some(isPhishingPair)



// compose our steps together
const checkURLs = pipe<string, Map<string, boolean>>(
  extractURLs,
  mapFirst, 
  mapURLPhishingStatus,
  collectMap
)

const listPhishingURLs = pipe(
  filterUrlIsPhishing, 
  mapFirst
)

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user?.tag}!`);
});

bot.on('message', msg => {
  if (msg.author.bot)
    return
  const results = checkURLs(msg.content)

  if (someUrlIsPhishing(results)) {
    const {content} = msg

    const adminChannel = msg.guild?.channels.resolve(ADMIN_CHANNEL_ID)

    if(adminChannel && adminChannel.type === 'text') {
      const textChannel = adminChannel as TextChannel
      msg.delete()
      const maliciousUrls = [...listPhishingURLs(results)]

      textChannel.send(`User <@${msg.author.id}> posted a message with a phishing link`,new MessageEmbed({
        color: '#f00000',
        title: 'Original Message',
        description: content,
        fields: [
          {
            name: 'Channel',
            value: `<#${msg.channel.id}>`,
            inline: true
          },
          {
            name: 'User',
            value: `<@${msg.author.id}>`,
            inline: true
          },
          { name: "Dangerous Url(s)", value: maliciousUrls.join(', ')}
        ]
      }))
    }
  } else {
    console.log('message does not contain any urls')
  }
})
