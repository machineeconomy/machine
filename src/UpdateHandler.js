const CronJob = require('cron').CronJob;

const { getOpenOrders, checkStatus } = require('./controllers/Orders.js')

const initUpdate = () => {
    new CronJob('*/10 * * * * *', async function () {

        console.log("CRON JOB")

        getOpenOrders().then(orders => {
            if (orders) {
                orders.forEach(order => {
                    checkStatus(order)
                });
            }
        })

        // get all orders with status 0.

        // is there a order with created >= 10 minutes -> delete it (if there is no transaction)

        // 

    }, null, true, 'America/Los_Angeles');
}



module.exports = {
    initUpdate
}