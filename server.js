"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const discord_js_1 = __importStar(require("discord.js"));
const eth_phishing_detect_1 = __importDefault(require("eth-phishing-detect"));
const pipeable_1 = require("@emnudge/domyno/pipeable");
const domyno_1 = require("@emnudge/domyno");
// const testString = 'please go to http://austinakers.com or https://metamask.io/ or  testing. etherclassicwallet.com or go to dev.to or try hitting up dev.com';
dotenv_1.default.config();
const bot = new discord_js_1.default.Client();
const { TOKEN, ADMIN_CHANNEL_ID } = process.env;
//returns Iterable of RegExpMatchArray
const extractURLs = (comment) => comment.matchAll(/(?:https?:\/\/)?(?:\S+\.\S+)/gu);
// returns an iterable of the first item of an iterable
const mapFirst = pipeable_1.map(([first]) => first);
// return a tuple of [url, phishingStatus]
const mapURLPhishingStatus = pipeable_1.map((url) => [url, eth_phishing_detect_1.default(url)]);
// turn an iterable into a map
const collectMap = (listOfURLs) => new Map(listOfURLs);
const isPhishingPair = ([, isPhishing]) => isPhishing;
const filterUrlIsPhishing = pipeable_1.filter(isPhishingPair);
const someUrlIsPhishing = pipeable_1.some(isPhishingPair);
// compose our steps together
const checkURLs = domyno_1.pipe(extractURLs, mapFirst, mapURLPhishingStatus, collectMap);
const listPhishingURLs = domyno_1.pipe(filterUrlIsPhishing, mapFirst);
bot.login(TOKEN);
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user?.tag}!`);
});
bot.on('message', msg => {
    if (msg.author.bot)
        return;
    const results = checkURLs(msg.content);
    if (someUrlIsPhishing(results)) {
        const { content } = msg;
        const adminChannel = msg.guild?.channels.resolve(ADMIN_CHANNEL_ID);
        if (adminChannel && adminChannel.type === 'text') {
            const textChannel = adminChannel;
            msg.delete();
            const maliciousUrls = [...listPhishingURLs(results)];
            textChannel.send(`User <@${msg.author.id}> posted a message with a phishing link`, new discord_js_1.MessageEmbed({
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
                    { name: "Dangerous Url(s)", value: maliciousUrls.join(', ') }
                ]
            }));
        }
    }
    else {
        console.log('message does not contain any urls');
    }
});
