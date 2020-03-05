const stockUpdaters = {
  ysws: require('./update-ysws-stocks.js')
}

module.exports = async (warehouses) => {
  console.log('warehouses requested for update', warehouses)
  for (const warehouse of warehouses) {
    await stockUpdaters[warehouse]()
  }
}
