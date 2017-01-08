const alexa = require('alexa-app');
const axios = require('axios');
const xml2json = require('simple-xml2json');

const app = new alexa.app('ttc');

const getNextStreetCar = (req, res) => {
  axios.get('http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&s=6459&r=505')
    .then((response) => {
      const json = xml2json.parser(response.data);
      const firstStreetCar = json.body.predictions.direction.prediction[0];
      const secondStreetCar = json.body.predictions.direction.prediction[1];
      sayNextStreetCar(firstStreetCar, secondStreetCar, res);
    })
    .catch((error) => {
      console.log(error);
      res.say('There was a problem reaching the myttc api.');
      res.shouldEndSession(true);
      res.send()
    });

  return false;
};

const sayNextStreetCar = (first, second, res) => {
  res.say(`The next streetcar is coming in ${first.minutes} and ${second.minutes} minutes`);
  res.shouldEndSession(true);
  res.send()
};

app.intent('GetNextStreetCar',
  {
    'slots': {},
    'utterances': [
      'When is the next streetcar coming?'
    ]
  },
  getNextStreetCar
);

// console.log(app.schema());
// console.log(app.utterances());

module.exports.ttc = app.lambda();