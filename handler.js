const alexa = require('alexa-app');

const ttc = require('./app.js');
const intents = require('./intents.js');

const app = new alexa.app('ttc');

intents.addTo(app);

// console.log(app.schema());
// console.log(app.utterances());

module.exports.ttc = app.lambda();