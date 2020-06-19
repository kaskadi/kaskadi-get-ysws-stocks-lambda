module.exports.handler = async (event) => {
  const getLastUpdatedData = require('./helpers/get-last-updated-data.js')
  const getStockData = require('./helpers/get-stock-data.js')
  const setStockData = require('./helpers/set-stock-data.js')
  return await getLastUpdatedData()
  .then(getStockData)
  .then(stocks => {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify([{
        idType: 'EAN',
        warehouse: 'ysws',
        stockData: stocks
      }])
    }
  })
  // .then(stocks => setStockData({ idType: 'EAN', warehouse: 'ysws', stockData: stocks }))
}
