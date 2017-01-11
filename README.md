# TTC Alexa

Alexa app that does two things, and only one of those things well.

## Summary

### University and Dundas (Eastbound)

This one's easy. It just calls an api and reports back the next two streetcars for
that hard coded stop.

Utterances include, "Alexa, ask ttc...":

- 'When {is|} the next streetcar {is|} coming',
- 'How long {till|until} the next streetcar',
- 'Can I make the next streetcar' (going to make a time limit based one for this)

### Stops by route number, direction, and intersection

This one's kind of a mess, but again, it works pretty well with Dundas. Queen and 
King confuse it, since the api also reports buses. Next steps, really.

Utterances include, "Alexa, ask ttc...":

- 'About the {-|RouteNumber} {-|Direction} at {-|StreetOne} and {-|StreetTwo}'
 
Uses the myttc api.
 
## Usage

To test locally, run `npm start`.

To run the chatskills version of the app, run `npm run chat`. Note that it requires numbers instead of
the written form of numbers, which is... weird. Also, you have to ctrl+c out of it after each request.
Working on it. Note that with chatskills, it's also strangely case sensitive about utterances.

To deploy to lambda, run `serverless deploy`.

To output the schema and intents, run `npm run output`.

## Todos

- unit tests
- figure out chatskills issues mentioned above
