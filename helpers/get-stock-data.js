module.exports = async (lastUpdated) => {
  const WemaloClient = require('wemalo-api-wrapper')
  const client = new WemaloClient({token: process.env.WEMALO_TOKEN})
  const yswsData = await client.availableStock(new Date(lastUpdated))
  return yswsData.articles.map(article => {
    return {
      id: article.ean,
      quantity: article.quantity
    }
  })
}