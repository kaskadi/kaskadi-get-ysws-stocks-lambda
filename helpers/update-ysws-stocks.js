const WemaloClient = require('wemalo-api-wrapper')
const client = new WemaloClient({token: process.env.WEMALO_TOKEN})
const es = require('aws-es-client')({
  id: process.env.ES_ID,
  token: process.env.ES_SECRET,
  url: process.env.ES_ENDPOINT
})

const updateProductStocks = require('./update-product-stocks.js')

module.exports = async () => {
  const yswsData = await client.getAllProducts()
  const products = await filterProducts(yswsData.products)
  const stocks = await getStocks(products)
  console.log(stocks)
  for (const stock of stocks) {
    await updateProductStocks('ysws', stock.id, stock.stockData)
  }
}

async function filterProducts(products) {
  let filteredProducts = []
  for (const product of products) {
    const id = product.externalId
    const productExistsDB = await productExists(id)
    if (productExistsDB) {
      filteredProducts.push(product)
    }
  }
  return filteredProducts
}

async function productExists(id) {
  return await es.exists({
    id,
    index: 'products'
  })
}

async function getStocks(products) {
  let stocks = []
  for (const product of products) {
    const id = product.externalId
    const yswsStocks = await getProductStocks(id)
    stocks.push({
      id,
      stockData: {...yswsStocks}
    })
  }
  return stocks
}

async function getProductStocks(id) {
  const data = await client.getStockReduced(id, true)
  return {
    quantity: data.quantity || 0,
    quantityReserved: data.quantityReserved || 0
  }
}
