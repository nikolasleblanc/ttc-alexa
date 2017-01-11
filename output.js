const alexa = require('alexa-app');
const intents = require('./intents.js');

const app = new alexa.app('ttc');

intents.addTo(app);

console.log(app.schema());
console.log(app.utterances());