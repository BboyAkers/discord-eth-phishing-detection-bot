"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const discord_js_1 = __importDefault(require("discord.js"));
const eth_phishing_detect_1 = __importDefault(require("eth-phishing-detect"));
const pipeable_1 = require("@emnudge/domyno/pipeable");
const domyno_1 = require("@emnudge/domyno");
// const testString = 'please go to http://austinakers.com or https://metamask.io/ or  testing. etherclassicwallet.com or go to dev.to or try hitting up dev.com';
dotenv_1.default.config();
const bot = new discord_js_1.default.Client();
const TOKEN = process.env.TOKEN;
//returns Iterable of RegExpMatchArray
const extractURLs = (comment) => comment.matchAll(/(?:https?:\/\/)?(?:\S+\.\S+)/gu);
// returns an iterable of the first item of an iterable
const mapFirst = pipeable_1.map(([first]) => first);
// return a tuple of [url, phishingStatus]
const mapURLPhishingStatus = pipeable_1.map((url) => [url, eth_phishing_detect_1.default(url)]);
// turn an iterable into a map
const collectMap = (listOfURLs) => new Map(listOfURLs);
// compose our steps together
const checkURLs = domyno_1.pipe(extractURLs, mapFirst, mapURLPhishingStatus, collectMap);
bot.login(TOKEN);
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user?.tag}!`);
});
bot.on('message', msg => {
    if (msg.author.bot)
        return;
    const results = checkURLs(msg.content);
    // const isMalicious = () => {
    //   return results.filter()
    // }
    if (urlList) {
        msg.reply('hey we have the url(s)');
    }
    else {
        console.log('message does not contain any urls');
    }
});
