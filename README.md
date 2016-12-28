This repository implements a bot that listens to the channel and when addressed directly, responds with one of Brian Eno and Peter Schmidt's Oblique
Strategies.

Send `@obliquebot` a Direct Message of `help` to see what it can do.

![Help](https://raw.githubusercontent.com/joemcmahon/obliquebot/master/_layouts/help.png)

This Slackbot is hosted at [Beep Boop][bb], uses the [Slapp][slapp]
library, and takes advantage of the [Slack Events API][slack-events-api].

<a href='https://beepboophq.com/api/slack/auth/add-to-slack/365f2d09fa3347248592ad508a16e1fb'><img alt='Add to Slack' height='40' width='139' src='https://platform.slack-edge.com/img/add_to_slack.png' srcset='https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x' /></a>

## Setup Instructions if you want to create your own bot based on obliquebot:

First, clone this repo, then 
create a new [Beep Boop](bb) project with your new repo. Once that's done, go to your Beepboop project's **Settings** tab and enable a Slack App.

![Enable Slack App](https://cloud.githubusercontent.com/assets/367275/19362140/b4039c86-9142-11e6-9b31-941609c1b090.gif)

Follow the steps laid out in the wizard. You'll want to enable **Event Subscriptions** on your Slack App using the `URL` provided and add subscriptions for the following **Bot Events**:

+ `im_created`
+ `message.channels`
+ `message.groups`
+ `message.im`
+ `message.mpim`

### 🔥 it up

Once you've finished setting up your Slack App and saved the `Client ID`, `Client Secret` and `Verification Token` on Beep Boop, go ahead and **Start** your project.

![Start](https://cloud.githubusercontent.com/assets/367275/19364564/edb43efa-914b-11e6-9265-d33122bf5f9a.png)

Once your project has started, go to the **Teams** tab and add your new Slack App to one of your Slack teams. This will automatically add a new `@obliquebot` user to your team.

![Add Team](https://cloud.githubusercontent.com/assets/367275/19364343/012e4922-914b-11e6-8f0a-bb020b016fd2.png)

### Showing your bot as on-line

The obliquebot already integrates the presence-polyfill work-around to show the bot as on-line when it's up. Read the [details][presence-polyfill] for the setup to get it to work.

[bb]: https://beepboophq.com
[slapp]: https://github.com/BeepBoopHQ/slapp
[slack-events-api]: https://api.slack.com/events-api
[presence-polyfill]: https://github.com/BeepBoopHQ/beepboop-slapp-presence-polyfill
