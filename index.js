const Alexa = require('ask-sdk-core')
const axios = require('axios')

// AMAZON.HelpIntent
// AMAZON.NavigateHomeIntent
// AMAZON.NoIntent
// AMAZON.YesIntent

const StopAndCancelIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    const outputText = "Thank you for using Everything Movies, goodbye!"

    return handlerInput.responseBuilder
      .speak(outputText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

const StopAndCancelIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
  },
  handle(handlerInput) {
    const outputText = "Thank you for using Everything Movies, goodbye!"

    return handlerInput.responseBuilder
      .speak(outputText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

const getDirector = async (title) => {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${process.env.API_KEY}`)

    return response.data.Director
  } catch (error) {
    return ''
  }
}

const DirectorIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DirectorIntent'
  },
  async handle(handlerInput) {
    const title = handlerInput.requestEnvelope.request.intent.slots.title.value
    const director = await getDirector(title)
    const answer = `The director of ${title} is ${director}.`
    const reprompt = 'Would you like information on another movie?'

    return handlerInput.responseBuilder
      .speak(`${answer} ${reprompt}`)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse()
  }
}

const ErrorHandler = {
  canHandle(handlerInput) {
    return true
  },
  handle(handlerInput) {
    const outputText = 'Sorry, was not able to get that information for you.'
    const repromptText = 'Would you like info on a movie?'

    return handlerInput.responseBuilder
      .speak(`${outputText} ${repromptText}`)
      .reprompt(repromptText)
      .withShouldEndSession(false)
      .getResponse()
  }
}

const skillBuilder = Alexa.SkillBuilders.custom()

exports.handler = skillBuilder
  .addRequestHandlers(
    DirectorIntentHandler,
    StopAndCancelIntentHandler
  )
  .addErrorHandler(ErrorHandler)
  .lambda()
