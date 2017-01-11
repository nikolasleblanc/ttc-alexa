const ttc = require('./app.js');

const addTo = (app) => {
  app.intent('GetNextStreetCarDefault',
    {
      'slots': {},
      'utterances': [
        'When {is|} the next streetcar {is|} coming',
        'How long {till|until} the next streetcar'
      ]
    },
    ttc.getNextStreetCarDefault
  );

  app.intent('GetCanIMakeTheNextStreetCar',
    {
      'slots': {},
      'utterances': [
        '{Can I|If I can} make the next streetcar',
        'If I\'m {gonna|going to} make it'
      ]
    },
    ttc.getCanIMakeTheNextStreetCar
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
        'About the {-|RouteNumber} {-|Direction} at {-|StreetOne} and {-|StreetTwo}'
      ]
    },
    ttc.getNextStreetCarWithIntersection
  );
};

module.exports = {
  addTo: addTo
};
