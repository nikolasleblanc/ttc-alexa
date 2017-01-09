const alexa = require('alexa-app');
const axios = require('axios');
const xml2json = require('simple-xml2json');

const app = new alexa.app('ttc');

const agency = 'ttc';
// from list of routes: http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc
const stopTag = 6459;
// from list of stops: http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=505
const routeId = 505;

const getNextStreetCarDefault = (req, res) => {
  axios.get(`http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=${agency}&s=${stopTag}&r=${routeId}`)
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

const getNextStreetCarWithIntersection = (req, res) => {
  const routeNumber = req.slot('RouteNumber');
  const routeDirection = req.slot('Direction');
  const streetOne = req.slot('StreetOne').toLowerCase();
  const streetTwo = req.slot('StreetTwo').toLowerCase();
  res.card("TTC app", `${routeNumber} ${routeDirection} ${streetOne} ${streetTwo}`);
  axios.get(`http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=${agency}&r=${routeNumber}`)
    .then((response) => {
      const json = xml2json.parser(response.data);
      const possibleStopMatches = json.body.route.stop.filter((stop) => {
        return stop.title.toLowerCase().indexOf(streetOne) >= 0 && stop.title.toLowerCase().indexOf(streetTwo) >= 0;
      });
      const stopsGoingAppropriateDirection = json.body.route.direction.find((direction) => {
        return direction.name.toLowerCase() === routeDirection.toLowerCase().replace('bound', '');
      });
      const actualStop = possibleStopMatches.find((stop) => {
        return stopsGoingAppropriateDirection.stop.filter((a) => {
          return a.tag === stop.tag
        }).length > 0;
      });

      axios.get(`http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=${agency}&s=${actualStop.tag}&r=${routeNumber}`)
        .then((response) => {
          const json = xml2json.parser(response.data);
          const firstStreetCar = json.body.predictions.direction.prediction[0];
          const secondStreetCar = json.body.predictions.direction.prediction[1];
          sayNextStreetCar(firstStreetCar, secondStreetCar, res);
        });

      return false;
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

app.intent('GetNextStreetCarDefault',
  {
    'slots': {},
    'utterances': [
      'When is the next streetcar coming?'
    ]
  },
  getNextStreetCarDefault
);

app.intent('GetNextStreetCarWithIntersection',
  {
    "slots": {
      "StreetOne": "AMAZON.StreetAddress",
      "StreetTwo": "AMAZON.StreetAddress",
      "RouteNumber": "AMAZON.NUMBER",
      "Direction": "DIRECTION"
    },
    'utterances': [
      'When is the next {Direction|DIRECTION} {RouteNumber|NUMBER} coming to {StreetOne|StreetAddress} and {StreetTwo|StreetAddress}'
    ]
  },
  getNextStreetCarWithIntersection
);

// console.log(app.schema());
// console.log(app.utterances());

module.exports.ttc = app.lambda();