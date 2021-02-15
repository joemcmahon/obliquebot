'use strict'

const Slapp = require('slapp')
const Context = require('./context')
const ConvoStore = require('./convo-store')

const YAML = require('js-yaml')
const fs = require('fs')

const _ = require('lodash')

const request = require('request')

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = (server, db) => {
console.log('initializing Slapp')
  let app = Slapp({
    verify_token: process.env.SLACK_VERIFY_TOKEN,
    context: Context(db),
    convo_store: ConvoStore(db)
  })

// Load oblique strategies
var strategies = ['I seem to have misplaced my notes, sorry!',
 'Uh, no, wait, don\'t tell me...',
 'I seem to have forgotten everything.',
 'Who am I? Why am I here?'];
try {
  strategies = YAML.safeLoad(fs.readFileSync('strategies.yml', 'utf8'));
  console.log(strategies[0]);
} catch(e) {
  console.log("Failed to load strategies: " + e);
}

var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\`strategy\` - to get a random Oblique Strategy.
`

// *********************************************
// Setup different handlers for messages
// *********************************************

app
  .event('url_verification', (msg) => {
      //parse for the challenge element and return its value
      msg.respond(msg.challenge, (err) => {})
  })
  .message(/oblique|strateg(y|ies)/i, ['mention', 'direct_message'], (msg) => {
      msg.say(_.sample(strategies))
  })
  .message('help', ['mention', 'direct_mention', 'direct_message'], (msg, text) => {
      msg.say(HELP_TEXT)
  })
  .message('.*', ['mention', 'direct_mention', 'direct_message'], (msg) => {
      msg.say(_.sample(strategies))
  })
  .attachToExpress(server)

  return app
}
