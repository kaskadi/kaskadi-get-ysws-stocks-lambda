const AWS = require('aws-sdk')
const WemaloClient = require('wemalo-api-wrapper')
const client = new WemaloClient({token: process.env.WEMALO_TOKEN})
const lambda = new AWS.Lambda({region: 'eu-central-1'})
const es = require('aws-es-client')({
  id: process.env.ES_ID,
  token: process.env.ES_SECRET,
  url: process.env.ES_ENDPOINT
})

module.exports.handler = async (event) => {
  const lastUpdated = (await es.get({
    id: 'ysws',
    index: 'warehouses'
  })).body._source.stockLastUpdated
  const stocks = await getStocksData(lastUpdated)
  const payload = {
    idType: 'EAN',
    warehouse: 'ysws',
    stockData: stocks
  } 
  await setStockData(payload)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify([payload])
  }
}

async function setStockData(payload) {
  if (payload.stockData.length === 0) {
    return
  }
  await lambda.invoke({
    FunctionName: 'kaskadi-set-stocks-lambda',
    Payload: JSON.stringify(payload),
    InvocationType: 'Event'
  }).promise()
}

async function getStocksData(lastUpdated) {
  const yswsData = await client.availableStock(new Date(lastUpdated))
  return yswsData.articles.map(article => {
    return {
      id: article.ean,
      quantity: article.quantity
    }
  })
}
