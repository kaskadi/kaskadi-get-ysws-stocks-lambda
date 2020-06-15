module.exports = () => {
  const es = require('aws-es-client')({
    id: process.env.ES_ID,
    token: process.env.ES_SECRET,
    url: process.env.ES_ENDPOINT
  })
  return es.get({ id: 'ysws', index: 'warehouses' }).then(esData => esData.body._source.stockLastUpdated)
}