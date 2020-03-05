const stockUpdaters = {
  ysws: require('./update-ysws-stocks.js')
}

module.exports = async (warehouses) => {
  for (const warehouse of warehouses) {
    await stockUpdaters[warehouse]()
  }
}
