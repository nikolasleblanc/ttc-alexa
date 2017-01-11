const alexa = require('alexa-app');
const chatskills = require('chatskills');
const readlineSync = require('readline-sync');

chatskills.name('alexa');

const ttc = require('./app.js');
const intents = require('./intents.js');

const app = chatskills.app('ttc');

intents.addTo(app);

function main() {
  var text = readlineSync.question('> ');

  if (text != 'quit') {
    // Respond to input.
    console.log('text', text);
    chatskills.respond(text, function (response) {
      console.log(response);
      main();
    });
  }
}

// Start the 'chatbot' skill immediately, to fire up the chatbot.
chatskills.respond('chatskills, ask ttc to say hi', function(response) {
  main();
});