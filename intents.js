const ttc = require('./app.js');

const addTo = (app) => {
  app.intent('GetNextStreetCarDefault',
    {
      'slots': {},
      'utterances': [
        'When is the next streetcar coming'
      ]
    },
    ttc.getNextStreetCarDefault
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
        'When is the next {-|Direction} {-|RouteNumber} coming to {-|StreetOne} and {-|StreetTwo}',
        'Hi {-|Direction}'
      ]
    },
    ttc.getNextStreetCarWithIntersection
  );
};

module.exports = {
  addTo: addTo
};
