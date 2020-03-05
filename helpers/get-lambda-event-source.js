module.exports = (event) => {
    if (event.path && event.httpMethod && event.headers) {
      return 'api'
    }
    if (event.source === 'aws.events') {
      return 'scheduled'
    }
}

// see here: https://stackoverflow.com/questions/41814750/how-to-know-event-souce-of-lambda-function-in-itself?noredirect=1&lq=1
