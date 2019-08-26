
var mongoose = require('mongoose');
const { router } = require('../src/WebServer.js')
const { log } = require('../src/Logger.js')
const uuid = require('uuid/v4');

console.log("custom js initialized")


// Define schema
var Schema = mongoose.Schema;

var AreaSchema = new Schema({
    iac: String,
    player_name: String,
    player_id: String,
    created: { type: Date, default: Date.now() },
    _someId: Schema.Types.ObjectId,
    address: String,
    amount: Number
});

// Compile model from schema
var Area = mongoose.model('Area', AreaSchema);

const runCustomPaymentScript = (order, amount) => {
    console.log("runCustomPaymentScript", order)

    // create new area
    let data = JSON.parse(order.data)
    console.log("data", data)
    console.log("amount", amount)

    if(!data.player_id || !data.player_name) return;


    Area.findOne({ 'iac': data.iac }, function (err, area) {
        if (err) response.send("not found");
        console.log("area", area)

        if (area) {
            console.log("area was found!", area)
            if (area.player_id == data.player_id) {
                console.log("user owns the area! :-) Support!")

                // area.amount + amount
                Area.findByIdAndUpdate(
                    // the id of the item to find
                    area.id,

                    // the change to be made. Mongoose will smartly combine your existing 
                    // document with this change, which allows for partial updates too
                    { amount: area.amount + amount},

                    // an option that asks mongoose to return the updated version 
                    // of the document instead of the pre-updated one.
                    { new: false },

                    // the callback function
                    (err, updated_area) => {
                        // Handle any possible database errors
                        if (err) console.log("error", err);
                        console.log("success::updated_area", updated_area)
                        
                    }
                )

            } else {
                console.log("user does not own the area! ATTACK! ")

                let amount_affter_attack = area.amount - amount

                if (amount_affter_attack < 0) {

                    console.log("attacker wins")
                    console.log("amount_affter_attack:", amount_affter_attack)
                    // attacker wins
                    Area.findByIdAndUpdate(
                        // the id of the item to find
                        area.id,

                        // the change to be made. Mongoose will smartly combine your existing 
                        // document with this change, which allows for partial updates too
                        { amount: (amount_affter_attack * -1), player_id: data.player_id, player_name: data.player_name },

                        // an option that asks mongoose to return the updated version 
                        // of the document instead of the pre-updated one.
                        { new: false },

                        // the callback function
                        (err, updated_area) => {
                            // Handle any possible database errors
                            if (err) console.log("error", err);
                            console.log("success::updated_area", updated_area)

                        }
                    )

                } else {
                    // defender wins
                    console.log("defender wins")
                    console.log("amount_affter_attack:", amount_affter_attack)
                    Area.findByIdAndUpdate(
                        // the id of the item to find
                        area.id,

                        // the change to be made. Mongoose will smartly combine your existing 
                        // document with this change, which allows for partial updates too
                        { amount: amount_affter_attack },

                        // an option that asks mongoose to return the updated version 
                        // of the document instead of the pre-updated one.
                        { new: false },

                        // the callback function
                        (err, updated_area) => {
                            // Handle any possible database errors
                            if (err) console.log("error", err);
                            console.log("success::updated_area", updated_area)

                        }
                    )
                }
                
                
            }
        } else {
            console.log("area was not found. Create new one!")
            let area = {
                iac: data.iac,
                player_name: data.player_name,
                player_id: data.player_id,
                amount: amount,
                address: order.address,
                uuid: uuid()
            }
            // Create an instance of model SomeModel
            var new_area = new Area(area);

            // Save the new model instance, passing a callback
            new_area.save(function (err, saved_area) {
                if (err) return handleError(err);
                // saved!
                console.log("saved_area", saved_area)
            });
        }
    })    
}


router.get('/areas/:iac', function (request, response) {
    log("Get areas")
    console.log('Request iac:', request.params.iac);

    Area.findOne({ 'iac': request.params.iac }, function (err, area) {
        if (err) response.send("area not found");
        console.log("area", area)
        response.send(area)
    })
});

router.get('/areas/', function (request, response) {
    log("List all areas")

    response.send("success")
    return
    getOrders().then(orders => {
        console.log("index::orders: ", orders)
    })
});


// custom script (index.js)
module.exports = {
    runCustomPaymentScript
}