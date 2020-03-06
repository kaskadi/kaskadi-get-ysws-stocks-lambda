const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({
  region: 'eu-central-1'
})
const WemaloClient = require('wemalo-api-wrapper')
const client = new WemaloClient({token: process.env.WEMALO_TOKEN})

module.exports.handler = async (event) => {
  const lastUpdated = process.env.LAST_UPDATED.length > 0 ? parseInt(process.env.LAST_UPDATED) : (new Date(2019, 0, 1, 0)).getTime()
  const yswsStockData = await client.availableStock(new Date(lastUpdated))
  process.env.LAST_UPDATED = Date.now().toString()
  const stocks = yswsStockData.articles.map(article => {
    return {
      id: article.externalId,
      quantity: article.quantity
    }
  })
  const invokeEvent = {
    stockData: stocks,
    warehouse: 'ysws'
  }
  await lambda.invoke({
    FunctionName: 'kaskadi-update-stocks-lambda',
    Payload: JSON.stringify(invokeEvent),
    InvocationType: 'Event' // makes the operation asynchronous
  }).promise() // we await here the API call to invoke the lambda, not the lambda invokation itself
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Stocks fetched from YSWS'
    })
  }
}
