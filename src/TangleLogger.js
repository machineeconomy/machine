const Mam = require('@iota/mam')
const { log } = require('./Logger.js')

const { asciiToTrytes, trytesToAscii } = require('@iota/converter')


const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`


const TLog = message => {
    console.log(message)
    publish(message).then(root => {
        console.log("root: ", root)
    }, error => {
        console.log("error: ", error)
    })
}

// Initialise MAM State
let mamState = Mam.init(provider)

// Publish to tangle
const publish = async packet => {
    return new Promise((resolve, reject) => {

        // Create MAM Payload - STRING OF TRYTES
        const trytes = asciiToTrytes(JSON.stringify(packet))
        const message = Mam.create(mamState, trytes)

        // Save new mamState
        mamState = message.state

        // Attach the payload
        Mam.attach(message.payload, message.address, 3, 9, 'CUSTOMTAG').then(success => {
            log("Published to MAM channel: " + packet);
            resolve(message.root)
        }, error => {
            console.log("error", error)
            reject(error)
        })
    });
}

module.exports = {
    TLog
}