const axios = require('axios');
const xml2json = require('simple-xml2json');

const agency = 'ttc';

const getNextStreetCarDefault = (req, res) => {
  // from list of routes: http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc
  const stopTag = 6459;
  // from list of stops: http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=505
  const routeId = 505;
  axios.get(`http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=${agency}&s=${stopTag}&r=${routeId}`)
    .then((response) => {
      const json = xml2json.parser(response.data);
      const firstStreetCar = json.body.predictions.direction.prediction[0];
      const secondStreetCar = json.body.predictions.direction.prediction[1];
      sayNextStreetCar(firstStreetCar, secondStreetCar, res);
    })
    .catch((error) => {
      res.say('There was a problem reaching the myttc api.', error);
      res.shouldEndSession(true);
    });

  return false;
};

const getPossibleStops = (json, streetOne, streetTwo) => {
  try {
    return json.body.route.stop.filter((stop) => {
      return stop.title.toLowerCase().indexOf(streetOne) >= 0 && stop.title.toLowerCase().indexOf(streetTwo) >= 0;
    });
  } catch (error) {
    apologize(error);
  }
};

const getStopsGoingTheRightDirection = (json, routeDirection) => {
  try {
    return json.body.route.direction.find((direction) => {
      return direction.name.toLowerCase() === routeDirection;
    });
  } catch (error) {
    apologize(error);
  }
};

const getRequestedStop = (possibleStopMatches, stopsGoingAppropriateDirection) => {
  try {
    return possibleStopMatches.find((stop) => {
      return stopsGoingAppropriateDirection.stop.filter((a) => {
          return a.tag === stop.tag
        }).length > 0;
    });
  } catch (error) {
    apologize(error);
  }
};

const getNextStreetCarWithIntersection = (req, res) => {
  const routeNumber = req.slot('RouteNumber');
  const routeDirection = req.slot('Direction').toLowerCase();
  const streetOne = req.slot('StreetOne').toLowerCase();
  const streetTwo = req.slot('StreetTwo').toLowerCase();
  axios.get(`http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=${agency}&r=${routeNumber}`)
    .then((response) => {
      const json = xml2json.parser(response.data);
      const possibleStopMatches = getPossibleStops(json, streetOne, streetTwo);
      const stopsGoingAppropriateDirection = getStopsGoingTheRightDirection(json, routeDirection);
      return getRequestedStop(possibleStopMatches, stopsGoingAppropriateDirection);
    })
    .then((actualStop) => {
      if (!actualStop) {
        throw 'No stop found';
      }
      return axios
        .get(`http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=${agency}&s=${actualStop.tag}&r=${routeNumber}`);
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

const apologize = (res) => (error) => {
  res.say('There was a problem with your request.');
  res.shouldEndSession(true);
};

const sayNextStreetCar = (first, second, res) => {
  res.say(`The next streetcar is coming in ${first.minutes} and ${second.minutes} minutes`);
  res.shouldEndSession(false);
};

module.exports = {
  getNextStreetCarDefault: getNextStreetCarDefault,
  getNextStreetCarWithIntersection: getNextStreetCarWithIntersection
};