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
