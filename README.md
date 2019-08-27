# IOTA Tangle Payment Module

This repository contains all functions to make payments with IOTA. This module is a microervice, which handles payments automaticly and provides different channels for communication. Wir features like MAM logging and watching live transaction, this is the perfect start to work with the tangle.  


[THere is an live demonstration](https://m2m.akitablock.io/) of this module.  


## Setup and run

Start all 4 machines (robot 1 and 2 + solar and wind energy)

You have to install [Docker](https://www.docker.com).

```bash
git clone https://github.com/machineeconomy/machine
cd machine
npm install
npm start
```

## Architecture

This module provides an IOTA wallet, Logging services and order management. 

Everything can be configured via environment variables.

### Environment Variables

| Variable   |      Example      |  Description |
|----------|:-------------:|------:|
| PORT |    3000   |  application port. |
| NAME |  robot 1 | the name of the service. |
| SEED |    AVL...RFS   |  81 trytes long iota seed for the wallet. |
| IS_PROVIDER |    true/false   |  Defines to module as provider. |
| PROVIDER_URL |    http://localhost:3002   |  Provider URl. |
| VALUE |    1337   |  Defines the cost of an order. |
| CUSTOM_SCRIPT |    true/false   |  Runs custom script after payment. |
| DEVELOPMENT |    true/false   |  Defines the module mode. |

#### Default .env File
```bash
PORT=3001
NAME=dev robot 1	
SEED=AAAAAAVTYWSUOLUWJTRYYPOIGF9KHFRVAZKAUHXKVHPOZJJZ9ELIPIEPPIIMTXIMMKQSHAAAAAAAAAAAA
IS_PROVIDER=false
PROVIDER_URL=http://localhost:3002
VALUE=0
CUSTOM_SCRIPT=true
DEVELOPMENT=true
```



### Webserver

The service provide some endpoints to get information about the state of the service.

| PATH   |  Method  |     Example      |  Description |
|----------|:-----|:--------:|------:|
| / |  GET  |    http://localhost:3000/   | show module dashboard |
| /orders | GET  |    http://localhost:3000/orders   | get a list of all orders |
| /orders | POST  |    http://localhost:3000/orders   | create a new order, returns an addresss |
| /orders/:uuid | GET  |    http://localhost:3000/orders/abc-123-efg   | get order details about the order with given id |
| /get_account_data | GET  |    http://localhost:3000/get_account_data   | get IOTA account data from the module 


### Websockets

The sevice also provides a websocket connection. It runs also on the same PORT like the webserver under path `/sockets`.

When a new user connect to the ws server, the service emits a message with the name and status of the machine in the `welcome` channel.

The service listens to the `order` channel, for incoming orders through the user application. 


### module status


|  Status   | Description |
|-----------|-------------|
|  booting  | machine starts up. |
|  waiting_for_order  | machine wait for an incoming order. |
|  waiting_for_tx  | machine waits for incoming transaction to IRI via ZMQ messages. |
|  waiting_for_tx_confirm  | machine waits for incoming transaction to be confirmed. |
|  payout_provider  | machine pays the provider |
|  working  | machine is working |
