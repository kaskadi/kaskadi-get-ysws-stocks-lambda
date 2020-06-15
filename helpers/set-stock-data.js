module.exports = async (payload) => {
  if (payload.stockData.length > 0) {
    const AWS = require('aws-sdk')
    const lambda = new AWS.Lambda({region: 'eu-central-1'})
    await lambda.invoke({
      FunctionName: 'kaskadi-set-stocks-lambda',
      Payload: JSON.stringify(payload),
      InvocationType: 'Event'
    }).promise()
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify([payload])
  }
}