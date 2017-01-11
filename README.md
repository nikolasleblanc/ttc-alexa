# TTC Alexa

Alexa app that does two things, and only one of those things well.

## Summary

### University and Dundas (Eastbound)

This one's easy. It just calls an api and reports back the next two streetcars for
that hard coded stop.

Utterances include, "Alexa, ask ttc...":

- When {is|} the next streetcar {is|} coming
- How long {till|until} the next streetcar

Note: {is|} is optional, {till|until} is either or.

### University and Dundas (Eastbound), 5 to 7 minutes away

This one was a little specific, Steph wanted to know if there'd be a streetcar
at the stop within the range that she could walk to it, so that she could either
hustle to get there in time or just head to the subway station instead.

Utterances include, "Alexa, ask ttc...":

- {Can I|If I can} make the next streetcar
- If I'm {gonna|going to} make it

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

To output the schema and intents, run `npm run output`. This will spit out the schema which you can copy
and paste into your skill's configuration on Amazon's Developer page, and it will also spit out the 
utterances that your app will accept, which you can also copy and paste onto the same page.

## Todos

- unit tests
- figure out chatskills issues mentioned above
