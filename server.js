'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const yaml = require('js-yaml')
const fs = require('fs')
const _ = require('lodash')

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})

var internetradio = require('node-internet-radio');
var STATION_URI = 'http://pstnet1.shoutcastnet.com:13100';
var trackMonitor = '...warming up...'; 

// Load oblique strategies. Have a default if something's wrong.
var strategies = ['I seem to have misplaced my notes, sorry',
 'Uh, no, wait, don\'t tell me...',
 'I seem to have forgotten everything.',
 'Who am I? Why am I here?'];
try {
  strategies = yaml.safeLoad(fs.readFileSync('strategies.yml', 'utf8'));
  console.log(strategies[0]);
} catch(e) {
  console.log("Failed to load Oblique Strategies: " + e);
}

// enable debugging
require('beepboop-slapp-presence-polyfill')(slapp, { debug: true })

var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\`track\` - to see what the current track is.
`

// *********************************************
// Setup different handlers for messages
// *********************************************

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
  msg.say(HELP_TEXT)
})

slapp.message(/oblique|strateg(y|ies)/i, ['mention', 'direct_message', 'direct_mention'], (msg) => {
    msg.say(_.sample(strategies))
})

// Catch-all for any other responses not handled above
slapp.message('.*', ['direct_mention'], (msg) => {
    msg.say(_.sample(strategies))
})

// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
