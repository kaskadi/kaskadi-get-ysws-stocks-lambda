module.exports.handler = async (event) => {
  const getLastUpdatedData = require('./helpers/get-last-updated-data.js')
  const getStockData = require('./helpers/get-stock-data.js')
  // const setStockData = require('./helpers/set-stock-data.js')
  const getApiResponse = require('./helpers/get-api-response.js')
  return await getLastUpdatedData()
  .then(getStockData)
  .then(getApiResponse)
  // .then(stocks => setStockData({ idType: 'EAN', warehouse: 'ysws', stockData: stocks }))
}
