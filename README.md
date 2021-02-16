This repository implements a bot that listens to a Slack channel and when appropriate, responds with one of Brian Eno and Peter Schmidt's Oblique Strategies.

The bot will listen, in any channel where it has been invited, for "strategy", "strategies", and "oblique". If
it sees amy of those words, it will respond with a random strategy from the `strategies.yml` file.

It can also be directly addressed with any text other than 'help' to receive a strategy in return.

![Help](https://raw.githubusercontent.com/joemcmahon/obliquebot/master/_layouts/help.png)

This bot has been converted to run at Heroku in a hobby dyno. It uses the [Slapp](https://www.npmjs.com/package/slapp)
library, and takes advantage of the [Slack Events API](slack-events-api).

# I just want obliquebot in my Slack
Click this button and you'll get `obliquebot` in your Slack, no extra work required. See the *Connect your bot to Slack* section below, starting at step 3. You won't need to enter the bot page's URL.

<a href='https://obliquebot.herokuapp.com'><img alt='Add to Slack' height='40' width='139' src='https://platform.slack-edge.com/img/add_to_slack.png' srcset='https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x' /></a>

# Build your own based on this repository
If you want to create your own bot based on obliquebot:

# Let Slack know about the bot.

1. Create a new Slack app. The instructions at https://slack.dev/bolt-js/tutorial/getting-started will walk you through this.

Follow the steps laid out in the wizard. You'll want to enable **Event Subscriptions** on your Slack App using the `URL` provided and add subscriptions for the following **Bot Events**:

+ `im_created`
+ `message.channels`
+ `message.groups`
+ `message.im`
+ `message.mpim`

You'll need to record the following to set up your environment on Heroku:

 - Slack Signing Secret
 - Slack Bot Token
 - Bot User OAuth Access Token

# State storage

The bot needs to store the basic authentication information for the various Slacks it will be added to. We
use [Firebase](https://firebase.google.com/) to store this data.

1. Log in to your Google account. You'll need to do this to be able to create a new Firebase database.
2. Go to [Firebase](https://firebase.google.com) and click "Go to Console".
3. Click the big "Add Project" button to set up a new database, and walk through the wizard to finish setting it up.
 - Enter a project name (if you're just cloning obliquebot to test things out, that's a reasonable name).
 - Enable analytics if you like; you'll need a Google Analytics account to connect to if so.
 - Otherwise, say no, and click "Create project".
4. When the screen says "your new project is ready", click through to see the new database.
5. We will be using the Realtime Database. Under "Build" in the left-hand sidebar, click "Realtime Database".
6. In the main page, click the "Create Database" button. Just choose the defaults in the wizard that pops up.
7. We will start by defining access rules to prevent anyone who doesn't have the obliquebot credentials from reading or writing the database. In the main pane, click the "Rules" tab, and replace the existing rule definition with the one below.
~~~
    {
      "rules": {
        "teams": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    }
~~~
You've now set up the database; the server code will take care of putting the data in it. Now we need to provide access to
the database for the bot. Click the gear icon next to `Project overview` in the left sidebar, then select `Project settings` in the popup.

In the main pane, click the `Service Accounts` tab, then the `Generate new private key` button. Read the popup, which reminds you that this is a database key, like a password. Make sure you don't commit it to Git! Then click the `Generate key` button.

This will generate and download a JSON file containig the credentials needed for your bot to access this new Firebase database.

# Set up the bot on Heroku.

1. Fork this repo.

   git clone git@githib.com:joemcmahon/obliquebot

2. Log in to Heroku. On the Dashboard, click the `New` button and select `Create new app`.
3. Type in the app name (this will be the name in the app's `herokuapp.com` URL) and click `Create app`.
4. You'll be on the deploy page; in the `Deployment method` section, click the `Connect to Github` button. This will go through the Github process to authenticate Heroku access to your account. 
5. It will now ask you to `search for a repository to connect to` in your account. Since you forked `obliquebot`, choose that one and click `Search`. It will find that repo and show a `Connect` button. Click it.
6. Click the `Overview` tab, then click `Configure dynos`.
7. You should see `Free dynos`, and `web  yarn run start` and a switch control in the `off` position. Click the pencil icon to edit this setup, and switch the dyno on, then click `Confirm` to enable the dyno. You will now be able to run your code. (If you don't do this step, Heroku will happily build your code, but never start it running!)
8. Set up the app configuration. Click the `Settings` tab and scroll down to `Config vars`, then click `Reveal config vars`.
9. You will need to set all of the following:

| KEY            | VALUE |
|----------------|-------|
| FIREBASE_DB_URL | https://yourdatabasename.firebaseio.com/ |
| FIREBASE_SERVICE_ACCOUNT_BASE64 | Base64-encoded Firebase access JSON |
| PORT | 8080 |
| SLACK_CLIENT_ID | xxxxxxxxxx.xxxxxxxxxx |
| SLACK_CLIENT_SECRET | ... |
| SLACK_VERIFY_TOKEN | ... |

# Deployment

8. Let's assume you want to just deploy the obliquebot code as is. Go back to the `Deploy` tab and scroll down to `Manual Deploy`.
9. The default branch will be selected (it's `master` for now, but `main` is supported too). Click `Deploy branch`.

Heroku will build the service and ready it for execution. Once the build completes, scroll back to the top and click `More` and select `View logs` in the popup. If everything is set up properly here on Heroku, you should see log entries like this:

    ... heroku[web.1]: State changed from down to starting
    ... heroku[web.1]: Starting process with command `yarn run start`
    ... app[web.1]: [heroku-exec] Starting
    ... app[web.1]: yarn run v1.22.10
    ... app[web.1]: $ node server.js
    ... app[web.1]: undefined
    ... app[web.1]: loading team info
    ... heroku[web.1]: State changed from starting to up
    ... app[web.1]: Launching bot
    ... app[web.1]: attaching to database at  https://obliquebot-xxxxx.firebaseio.com/
    ... app[web.1]: account info loaded
    ... app[web.1]: app initialized
    ... app[web.1]: have database
    ... app[web.1]: initializing Slapp
    ... app[web.1]: (Organic) machinery
    ... app[web.1]: http server started on port 9120

# Connect your bot to Slack.

While testing, I strongly suggest creating a test Slack for just yourself; you can show off your bot in public once you're sure it's working as you desire.

1. Log in to the Slack you want to add the bot to, then click on the Slack name at the top of the Slack left sidebar.
2. Mouse down to `Settings and administration`, and then `Manage apps` in the submenu. Your browser should open at `app.slack.com`.
3. Now type `https://yourherokuappsname.herokuapp.com` into the URL bar and hit enter. You should see the obliquebot logo and an `Add to Slack` button. Click the `Add to Slack` button.
4. You should, if the app is running correctly, see a new page with the text `obliquebot is requesting permission to access the [some name] Slack workspace` and an `Allow` button. Click `Allow` to proceed.ot-
5. The wait indicator should circle for a second, then you should see `This Slack App has been successfully added to the [some name] team`.
6. Go back to Slack, and you should now see `obliquebot` in the `Apps` section of the left sidebar. Click on `obliquebot` and you'll be in a private conversation with the bot. Type anything, and you should get a strategy.
7. Add `obliquebot` to any channels where you'd like it to be listening; when it hears its keywords, or it's included in a message, it will respond with a strategy.
