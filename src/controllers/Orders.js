
var mongoose = require('mongoose');
const uuid = require('uuid/v4'); 

// Define schema
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    uuid: String,
    data: String,
    status: Number,
    created: { type: Date, default: Date.now() },
    _someId: Schema.Types.ObjectId,
    address: String
});

// Compile model from schema
var Order = mongoose.model('Order', OrderSchema);

const createOrder = (order) => {

    console.log("create order")
    order.uuid = uuid();
    order.status = 0;
    // Create an instance of model SomeModel
    var new_order = new Order(order);

    // Save the new model instance, passing a callback
    new_order.save(function (err) {
        if (err) return handleError(err);
        // saved!
    });
}

const getOrderByUUID = (uuid) => {
    return new Promise(function (resolve, reject) {
        // find all athletes who play tennis, selecting the 'name' and 'age' fields
        Order.findOne({ 'uuid': uuid }, function (err, order) {
            if (err) return handleError(err);
            // 'athletes' contains the list of athletes that match the criteria.
            console.log("order", order)
            resolve(order);

        })
    });
}

const getOrders = () => {
    return new Promise(function (resolve, reject) {
        Order.find({}, function (err, orders) {
            if (err) return handleError(err);
            // 'athletes' contains the list of athletes that match the criteria.
            console.log("orders", orders)
            resolve(orders);

        })
    });

}



module.exports = {
    createOrder,
    getOrderByUUID,
    getOrders
}