// datavase settings
const { log } = require('./Logger.js')
const low = require('lowdb')

const NAME = process.env.NAME


const FileSync = require('lowdb/adapters/FileSync')

const filename = "databases/db_" + NAME.replace(/ /g, "") + '.json'

const adapter = new FileSync(filename)
const db = low(adapter)


let currentIndex = db.get('keyIndex').value()
let currentBalance = db.get('currentBalance').value()


if (Number.isInteger(currentIndex)) {
    log("Database loaded. Current index: " + currentIndex)
} else {
    // setup database
    currentIndex = 0
    db.set('keyIndex', currentIndex)
        .write()
    log("Database created.")
}

const nextIndex = function() {
    increaseIndex()
    return currentIndex
}
const getCurrentIndex = function() {
    return currentIndex
}

const saveCurrentBalance = function(balance) {
    currentBalance = balance
    db.set('balance', currentBalance)
        .write()
}

const getCurrentBalance = function () {
    return currentBalance
}


const increaseIndex = function () {
    currentIndex = currentIndex  + 1
    db.set('keyIndex', currentIndex)
        .write()
}
module.exports = {
    db,
    nextIndex,
    getCurrentIndex,
    saveCurrentBalance,
    getCurrentBalance
}