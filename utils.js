const axios = require('axios');

const getPrediction = (agency, stopTag, routeId) => {
  return axios.get(`http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=${agency}&s=${stopTag}&r=${routeId}`)
};

const getStopsAlongRoute = (agency, routeId) => {
  return axios.get(`http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=${agency}&r=${routeId}`)
};

const getPossibleStops = (json, streetOne, streetTwo) => {
  return json.body.route.stop.filter((stop) => {
    return stop.title.toLowerCase().indexOf(streetOne) >= 0 && stop.title.toLowerCase().indexOf(streetTwo) >= 0;
  });
};

const getStopsGoingTheRightDirection = (json, routeDirection) => {
  return json.body.route.direction.find((direction) => {
    return direction.name.toLowerCase() === routeDirection;
  });
};

const getRequestedStop = (possibleStopMatches, stopsGoingAppropriateDirection) => {
  return possibleStopMatches.find((stop) => {
    return stopsGoingAppropriateDirection.stop.filter((a) => {
        return a.tag === stop.tag
      }).length > 0;
  });
};

module.exports = {
  getPrediction: getPrediction,
  getStopsAlongRoute: getStopsAlongRoute,
  getPossibleStops: getPossibleStops,
  getStopsGoingTheRightDirection: getStopsGoingTheRightDirection,
  getRequestedStop: getRequestedStop
};
