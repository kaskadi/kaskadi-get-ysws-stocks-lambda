const es = require('aws-es-client')({
  id: process.env.ES_ID,
  token: process.env.ES_SECRET,
  url: process.env.ES_ENDPOINT
})

module.exports = async (warehouse, id, stockData) => {
  const productData = await es.get({
    id,
    index: 'products'
  })
  let stocks = [...productData._source.stocks]
  stocks = stocks.map(stock => {
    if (stock.warehouse === warehouse) {
      return {
        warehouse: stock.warehouse,
        ...stockData
      }
    }
    return stock
  })
  await es.update({
    id,
    index: 'products',
    body: {
      doc: {
        stocks
      }
    }
  })
}
