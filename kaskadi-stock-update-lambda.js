const AWS = require('aws-sdk')
const sns = new AWS.SNS({apiVersion: '2010-03-31'})
const getLambdaEventSource = require('./helpers/get-lambda-event-source.js')
const listWarehouses = require('./helpers/list-warehouses.js')
const updateStocks = require('./helpers/update-stocks.js')

module.exports.handler = async (event) => {
  const eventSource = getLambdaEventSource(event)
  switch (eventSource) {
    case 'isApiGatewayAwsProxy':
      const eventBody = JSON.parse(event.body)
      let warehouses
      if (eventBody.warehouses[0] === '*') {
        warehouses = await listWarehouses()
      }
      warehouses = eventBody.warehouses
      await updateStocks(warehouses)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Stocks updated!'
        })
      }
    case 'isScheduledEvent':
      const warehouses = await listWarehouses()
      await updateStocks(warehouses)
      const params = {
        Message: 'Stocks updated!',
        Subject: 'Stock update',
        TopicArn: process.env.TOPIC_ARN
      }
      await sns.publish(params).promise()
      break
    default:
      break
  }
}