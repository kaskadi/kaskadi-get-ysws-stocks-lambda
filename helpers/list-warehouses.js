const es = require('aws-es-client')({
  id: process.env.ES_ID,
  token: process.env.ES_SECRET,
  url: process.env.ES_ENDPOINT
})

module.exports = async () => {
  const warehousesData = await es.search({
    index: 'warehouses',
    body: {
      from: 0,
      size: 500,
      query: {
        match_all: {}
      }
    }
  })
  const warehouses = warehousesData.hits.hits.map(warehouseData => warehouseData._source.name)
  return warehouses
}
