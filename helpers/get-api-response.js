module.exports = (stocks) => {
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
}