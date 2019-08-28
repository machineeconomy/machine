Code Example:

You can integrate the payment module in your existing Express app, by mounting the payment-module app on a specific path using startModule(opts).

```bash

var module = require('payment-module')
var app = require('express')()

var yourSettings = {
    mongo_db: true, // default: false
    seed: "AAA...ZZZ", // default: generateSeed()
    ws: true, // default: false
    // ...
}

app.use('/payments', module(yourSettings))
app.listen(3000, function() {
  // Started Express app with payment module on '/payments'
})

```

