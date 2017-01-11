const xml2json = require('simple-xml2json');
const utils = require('./utils.js');

const agency = 'ttc';

const getCanIMakeTheNextStreetCar = (req, res) => {
  // from list of routes: http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc
  const stopTag = 6459;
  // from list of stops: http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=505
  const routeId = 505;
  utils.getPrediction(agency, stopTag, routeId)
    .then((response) => {
      const json = xml2json.parser(response.data);
      const streetCars = json.body.predictions.direction.prediction.filter((streetcar) => {
        return streetcar.minutes >= 5 && streetcar.minutes <= 7;
      });
      const message = streetCars.length ?
        `You're in luck killer, there's a streetcar with your name on it ${streetCars[0].minutes} away` :
        `Nope. Looks like you're walking.`;
      res.say(message);
      res.send();
    })
    .catch(apologize(res));

  return false;
};

const getNextStreetCarDefault = (req, res) => {
  // from list of routes: http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc
  const stopTag = 6459;
  // from list of stops: http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=505
  const routeId = 505;
  utils.getPrediction(agency, stopTag, routeId)
    .then((response) => {
      const json = xml2json.parser(response.data);
      const firstStreetCar = json.body.predictions.direction.prediction[0];
      const secondStreetCar = json.body.predictions.direction.prediction[1];
      return sayNextStreetCar(firstStreetCar, secondStreetCar, res);
    })
    .catch(apologize(res));

  return false;
};

const getNextStreetCarWithIntersection = (req, res) => {
  const routeNumber = req.slot('RouteNumber');
  const routeDirection = req.slot('Direction').toLowerCase();
  const streetOne = req.slot('StreetOne').toLowerCase();
  const streetTwo = req.slot('StreetTwo').toLowerCase();
  utils.getStopsAlongRoute(agency, routeNumber)
    .then((response) => {
      const json = xml2json.parser(response.data);
      const possibleStopMatches = utils.getPossibleStops(json, streetOne, streetTwo);
      const stopsGoingAppropriateDirection = utils.getStopsGoingTheRightDirection(json, routeDirection);
      return utils.getRequestedStop(possibleStopMatches, stopsGoingAppropriateDirection);
    })
    .then((actualStop) => {
      if (!actualStop) {
        throw 'No stop found';
      }
      return utils.getPrediction(agency, actualStop.tag, routeNumber);
    })
    .catch(apologize(res))
    .then((response) => {
      const json = xml2json.parser(response.data);
      const firstStreetCar = json.body.predictions.direction.prediction[0];
      const secondStreetCar = json.body.predictions.direction.prediction[1];
      sayNextStreetCar(firstStreetCar, secondStreetCar, res);
    })
    .catch(apologize(res));

  return false;
};

const apologize = (res) => () => {
  res.say('There was a problem with your request.');
  res.send();
};

const sayNextStreetCar = (first, second, res) => {
  res.say(`The next streetcar is coming in ${first.minutes} and ${second.minutes} minutes`);
  res.send();
};

module.exports = {
  getNextStreetCarDefault: getNextStreetCarDefault,
  getNextStreetCarWithIntersection: getNextStreetCarWithIntersection,
  getCanIMakeTheNextStreetCar: getCanIMakeTheNextStreetCar
};