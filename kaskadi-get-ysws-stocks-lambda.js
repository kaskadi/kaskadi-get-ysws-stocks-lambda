const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({
  region: 'eu-central-1'
})
const WemaloClient = require('wemalo-api-wrapper')
const client = new WemaloClient({token: process.env.WEMALO_TOKEN})
const es = require('aws-es-client')({
  id: process.env.ES_ID,
  token: process.env.ES_SECRET,
  url: process.env.ES_ENDPOINT
})

module.exports.handler = async (event) => {
  const lastUpdated = (await es.get({
    id: 'ysws',
    index: 'warehouses'
  }))._source.stock_last_updated || (new Date(2019, 0, 1, 0)).getTime()
  const yswsStockData = await client.availableStock(new Date(lastUpdated))
  const stocks = getStocksData(yswsStockData)
  await invokeStockUpdate(stocks)
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

async function invokeStockUpdate(stocks) {
  const event = {
    stockData: stocks,
    warehouse: 'ysws'
  }
  await lambda.invoke({
    FunctionName: 'kaskadi-update-stocks-lambda',
    Payload: JSON.stringify(event),
    InvocationType: 'Event' // makes the operation asynchronous
  }).promise() // we await here the API call to invoke the lambda, not the lambda invokation itself
}

function getStocksData(yswsData) {
  return yswsData.articles.map(article => {
    return {
      id: article.externalId,
      quantity: article.quantity
    }
  })
}
