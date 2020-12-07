# discord-eth-phishing-detection-bot

## Contributors
- Austin Akers
  - [Github](https://github.com/BboyAkers)
  - [Twitter](https://twitter.com/tweetmonster999)
- Adam Dorling 
  - [Github](https://github.com/laquasicinque)
  - [Twitter](https://twitter.com/LaQuasiCinque)
  
## Overview
This bot is designed to block unsafe urls from weird people in blockchain community discord channels. This bot is designed to do several things:
1.  Monitor chats to see if known malicious urls are being posted in channels.(It uses [Eth Phishing Detect](https://github.com/MetaMask/eth-phishing-detect) by [MetaMask](https://github.com/MetaMask) to check the urls.
2.  If url(s) are found it'll delete the message(needs to have a role that allows the bot to delete messages) and send the information regarding the malicous message to the desired channel for admins to determe the fate fo the user.

## Information bot sends to desired channel
A message containing the:
- Original Message
- Channel It Was Sent
- User Who Sent It
- Dangerous Url(s)

## Getting Started:

### First:
`git clone https://github.com/BboyAkers/discord-eth-phishing-detection-bot.git`

### Second:
Navigate to the directory where you clone this repository on your computer.

### Create an .env file

#### .Env

```
TOKEN= //insert token generated for your bot here
ADMIN_CHANNEL_ID= //insert channel id of the admin channel or prefered channel to send information to.
```

### Lastly
`npm run start`

You now have a bot that'll detect known phishing urls and delete them!
--
