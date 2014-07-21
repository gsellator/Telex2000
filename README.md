# Telex2000
> Messenger app for BERG Cloud's Little Printer

## Getting Started
Telex2000 is a [NodeJs](http://nodejs.org/) app which let you send messages, photos and [Yo's](http://www.justyo.co/) to a Little Printer you own without having to be logged in on BERG Cloud official system. You'll need [MongoDB](http://www.mongodb.org/) to run it.

## Berg & YO APIs
First get the 'Direct Print API Code' of your Little Printer on [Berg Cloud's developper website](http://remote.bergcloud.com/developers/littleprinter/direct_print_codes). Then go on [Yo's website](http://developer.justyo.co/), set yourdomaine.com/yo as the callback address and collect the API Key. Finally, put those codes on the project's root folder inside a file called `.apis` formated like this :
```json
{
  "bergapi": "XXXXXXXXXXXX",
  "yoapi": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}
```

## Setup
Install dependancies with npm and run the app :
```shell
npm install
node app.js
```

The result should be visible at the address http://localhost:3030/. For more info about deployment, check the 'DEPLOYMENT.md' file.

## Example
My own Little Printer is linked to the following website : http://telex.radio97.fr. You can send me 'Thank you' notes or YO me at COLOCPREF but please don't spam me too much :)