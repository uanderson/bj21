# Welcome

Welcome to our super cool version of the classic Blackjack game! 🎉

Grab your friends and get ready for some multiplayer fun because this game lets multiple players join in on the action at the same time. Currently, we've got a limited number of seats, so it's first-come, first-served. Just a heads up, though: we're not quite ready for multiple games happening at once... but who knows what the future holds?

We're keeping it simple with our tech stack. For the front-end, we're rocking vanilla web components? On the back-end, we've got Node.js with Express, handling all the heavy lifting.

So, shuffle up, deal the cards, and may the best hand win! 🃏✨

## How to run the fun?

Ready to dive in? Here’s how you get started:

Firstly, make sure you have Node.js 18.x or higher installed.

Secondly, clone this repo and navigate to that folder from your terminal. Then, run this command to get everything set up:

```shell
npm ci
```

Grab a coffee while it installs, and once it’s done, fire it up with:

```shell
npm start
```
And that’s it! Head over to http://localhost:8021 and let the games begin!

## Sanity check? Run the tests

We've got some tests to keep things running smoothly. To run them, just use this command:

```shell
npm run client:test.ci
npm run server:test.ci
```

Do you want to watch the tests in action and see what happens when you make changes? Remove the .ci from the end of the command:

```shell
npm run client:test
npm run server:test
```

Just remember to run them in separate terminals, because they block the process. Happy testing!

## Demo

https://github.com/uanderson/bj21/assets/2034724/b8ccad5b-432b-42f1-96b4-336db9b760c3
